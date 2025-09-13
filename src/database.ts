// database.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to SIGTERM');
      process.exit(0);
    });
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};
