export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'iwb',
      bufferCommands: false,
    }).catch(error => {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("MongoDB connection failed");
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
