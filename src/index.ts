// index.ts
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { connectDB, disconnectDB } from './database';
import { errorHandler, notFoundHandler } from './errorHandler.middleware';
import router from './routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use('/api', router);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('*', notFoundHandler);
app.use(errorHandler);

(async () => {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
})().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
