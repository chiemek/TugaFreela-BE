// Configuration file for environment variables
module.exports = {
  MONGO_URI: process.env.MONGO_URI, // MongoDB connection string
  PORT: process.env.PORT || 5000, // Server port
  JWT_SECRET: process.env.JWT_SECRET, // JWT secret key (if needed)
};
