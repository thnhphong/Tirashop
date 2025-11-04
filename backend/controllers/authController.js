const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

const ACCESS_TOKEN_EXPIRY = '15m'; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Refresh token expires in 7 days

const authController = {
}