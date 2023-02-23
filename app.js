import './config/database';

require('dotenv').config();
require('./config/database');

const express = require('express');

application.use(express.json());

export default app