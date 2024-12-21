import http from 'http'
import app from './app'
import connectDB from './db/conn'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000

const httpServer = http.createServer(app)

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.error(`Something went wrong while booting up the system: ${error}`)
    process.exit(1)
  })
