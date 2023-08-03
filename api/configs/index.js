require("dotenv").config();

const COR_OPTIONS = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

const SOCKET_OPTIONS = {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
};

module.exports = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,

  MONGO_URL: process.env.MONGO_URL,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  COR_OPTIONS,

  SOCKET_OPTIONS,
};
