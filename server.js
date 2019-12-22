const express = require('express');
const dotenv = require('dotenv');

// Route files
const profiles = require('./routes/profiles');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Mount routers
app.use('/api/v1/profiles', profiles);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
