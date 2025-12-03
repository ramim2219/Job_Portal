// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // already connected or connecting
  }

  mongoose.connection.on('connected', () => console.log('Database Connected'));
  mongoose.connection.on('error', (err) => console.error('Mongo error:', err));

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'job-portal',
  });
};

export default connectDB;
