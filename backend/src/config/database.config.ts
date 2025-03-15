import mongoose from 'mongoose'; // Import mongoose library
import { config } from './app.config'; // Import configuration from app.config

const connectDatabase = async () => {
  // Define an asynchronous function to connect to the database
  try {
    await mongoose.connect(config.MONGO_URI); // Attempt to connect to the MongoDB database using the URI from the config
    console.log('Connected to Mongo Database'); // Log success message if connection is successful
  } catch (error) {
    console.log('Error connecting to Mongo database'); // Log error message if connection fails
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDatabase; // Export the connectDatabase function as the default export

