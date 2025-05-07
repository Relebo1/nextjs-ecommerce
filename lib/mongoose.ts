import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const connectToDatabase=()=> {
  // If connection already exists, return it
  if (cached.conn) return cached.conn

  // If no promise is cached, initiate the connection and cache the promise
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'iwb', // Specify the database name
      bufferCommands: false, // Disable buffering of commands when disconnected
    }).catch(error => {
      console.error("Error connecting to MongoDB:", error) // Log connection error
      throw new Error("MongoDB connection failed") // Propagate the error
    })
  }

  // Wait for the connection promise to resolve
  cached.conn = await cached.promise
  return cached.conn
}
