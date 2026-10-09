import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import { AGENT_PROFILE, GIULIO_CV } from './src/data/cvData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini SDK client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt grounding for Giulio Pintus's Assistant
const SYSTEM_INSTRUCTION = `${AGENT_PROFILE.systemPrompt}

Comprehensive reference CV data:
Name: ${GIULIO_CV.name}
Title: ${GIULIO_CV.title}
Completed Key Internship: ${GIULIO_CV.completedInternship.agency} (${GIULIO_CV.completedInternship.duration}, ${GIULIO_CV.completedInternship.location}).
Role & Major Achievements: ${GIULIO_CV.completedInternship.summary}
Specific Missions: ${GIULIO_CV.completedInternship.achievements.join('; ')}
Contact: Email: ${GIULIO_CV.contact.email}, Phone: ${GIULIO_CV.contact.phone}, Base: ${GIULIO_CV.contact.locations.join(' and ')}, Age: ${GIULIO_CV.contact.age} (Born ${GIULIO_CV.contact.birthDate})
Languages: ${GIULIO_CV.languages.map(l => `${l.language}: ${l.level} (${l.description})`).join('; ')}
Education:
${GIULIO_CV.education.map(e => `- ${e.degree} at ${e.institution} (${e.location}, ${e.period}). Details: ${e.highlights.join('; ')}`).join('\n')}
Experience:
${GIULIO_CV.experience.map(e => `- [${e.type.toUpperCase()}] ${e.role} at ${e.organization} (${e.period}). Key work: ${e.description.join('; ')}`).join('\n')}
Hard Skills: ${GIULIO_CV.hardSkills.join(', ')}
Soft Skills: ${GIULIO_CV.softSkills.join(', ')}
Tools: ${GIULIO_CV.tools.join(', ')}
Interests: ${GIULIO_CV.interests.map(i => `${i.title} (${i.duration}) - ${i.description}`).join('; ')}
`;

// 1. Text / Conversational endpoint (gemini-3.8-flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], voiceResponse = false, voiceName = 'Kore' } = req.body;
    if (!messages.length) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in server environment.' });
    }

    // Format chat history for Gemini API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Hello, I am Giulio’s assistant, what would you like to know about him?";

    let audioBase64: string | null = null;
    if (voiceResponse && replyText) {
      try {
        // Clean text for natural speech (remove markdown symbols that sound awkward when spoken)
        const speechText = replyText
          .replace(/[*_#`~[\]]/g, '')
          .replace(/https?:\/\/\S+/g, '')
          .slice(0, 800); // Keep spoken clips punchy and responsive

        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: speechText,
                  speechMetadata: {
                    style: 'Warm, professional, articulate executive assistant',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
              },
            },
          },
        });

        audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (ttsErr) {
        console.warn('TTS generation notice:', ttsErr);
      }
    }

    res.json({
      reply: replyText,
      audio: audioBase64,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat response' });
  }
});

// 2. Dedicated Text-to-Speech endpoint (gemini-3.8-flash-lite-tts)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in server environment.' });
    }

    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 1000);

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, warm, friendly executive assistant tone',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      return res.status(500).json({ error: 'Audio data not generated by TTS' });
    }

    res.json({
      audio: audioBase64,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate voice audio' });
  }
});

// 3. Audio Transcription endpoint (gemini-3.5-transcribe)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType = 'audio/webm' } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio base64 is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType.split(';')[0],
        data: audio,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe the user voice query verbatim. If the audio is empty or quiet, return nothing.' }
        ]
      },
    });

    res.json({
      transcript: response.text?.trim() || '',
    });
  } catch (error: any) {
    console.error('Transcribe error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// 4. WebSocket Server for Real-Time Gemini Live API (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url?.split('?')[0];
  if (pathname === '/live' || pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs) => {
  let liveSession: any = null;

  try {
    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY is missing on server.' }));
      clientWs.close();
      return;
    }

    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err: any) => {
          clientWs.send(JSON.stringify({ error: err?.message || 'Live API error' }));
        },
        onclose: () => {
          clientWs.send(JSON.stringify({ closed: true }));
        }
      },
    });

    clientWs.send(JSON.stringify({ ready: true, greeting: AGENT_PROFILE.scriptAtStart }));

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: parsed.mimeType || 'audio/pcm;rate=16000',
            },
          });
        }
      } catch (err) {
        console.error('Client message handling error:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        if (liveSession && typeof liveSession.close === 'function') {
          liveSession.close();
        }
      } catch (_) {}
    });
  } catch (err: any) {
    console.error('Live connect error:', err);
    clientWs.send(JSON.stringify({ error: err?.message || 'Could not initiate Live API session' }));
    clientWs.close();
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Server listening on port ${port} (mode: ${isDev ? 'dev' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
