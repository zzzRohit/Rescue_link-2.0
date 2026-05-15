import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('...') || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    console.warn('MONGODB_URI is not set. Server started without database connection.');
    return;
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

export default connectDB;
