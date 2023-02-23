import './config/database';

require('dotenv').config();
require('./config/database');
const express = require('express')

const app = express();

app.use(express.json());

module.exports = app;