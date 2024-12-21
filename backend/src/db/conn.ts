import mongoose from 'mongoose'

const connectDB = async () => {
  const MongoConnectionURI = process.env.MONGO_URI
  try {
    if (!MongoConnectionURI) {
      throw new Error()
    }
    const connectionInstance = await mongoose.connect(MongoConnectionURI)

    console.log(
      `MongoDB connected on : ${connectionInstance.connection.name} 😎`
    )
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

export default connectDB
