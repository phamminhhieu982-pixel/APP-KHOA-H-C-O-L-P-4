import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - GPT-like Gemini prompt proxy
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ error: 'Message payload is required' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'GEMINI_API_KEY is not defined on the hosting server environment.' });
        return;
      }

      // Initialize server-side Google GenAI client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `Em là học sinh lớp 4 Việt Nam. Hãy giải đáp câu hỏi này bằng ngôn ngữ robot thông thái, siêu cực kỳ ngộ nghĩnh, ngắn gọn dưới 3 dòng, giàu trí tưởng tượng và tạo động lực STEM: \n"${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Bạn là robot Kiki, trợ lý giáo dục khoa học tiểu học ở Việt Nam nổi tiếng vui tai, nhí nhảnh, nhiều năng lượng.',
          temperature: 0.8
        }
      });

      const text = response.text || 'Anh Kiki gặp chút nhiễu sóng vệ tinh. Em thử lại nhé!';
      res.json({ text });
    } catch (err: any) {
      console.error('Server side Gemini Error:', err);
      res.status(500).json({ error: err.message || 'General error calling AI client.' });
    }
  });

  // Serve static assets OR use Vite Dev Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khoa Hoc Ao Grade 4 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
