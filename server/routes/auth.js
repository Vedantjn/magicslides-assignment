const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({ user: userInfo.data });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).json({ error: 'Invalid token', details: error.message });
  }
});

module.exports = router;
