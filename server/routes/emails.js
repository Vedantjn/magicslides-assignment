const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { classifyEmails } = require('../utils/classifyEmails');

router.get('/', async (req, res) => {
  const { count = 15 } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1];

  console.log('Received access token:', accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: count,
    });

    const emails = await Promise.all(
      response.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        return {
          id: email.data.id,
          subject: email.data.payload.headers.find((header) => header.name === 'Subject')?.value,
          snippet: email.data.snippet,
        };
      })
    );

    res.json({ emails });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
  }
});

router.post('/classify', async (req, res) => {
  const { emails, openaiKey } = req.body;

  if (!emails || emails.length === 0 || !openaiKey) {
    return res.status(400).json({ error: 'Missing emails or OpenAI key' });
  }

  try {
    const classifiedEmails = await classifyEmails(emails, openaiKey);
    res.json({ classifiedEmails });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify emails', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const emailId = req.params.id;

  console.log(`Received request for email ID: ${emailId}`);
  console.log(`Access Token: ${accessToken ? accessToken.substring(0, 10) + '...' : 'Not provided'}`);

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'full',
    });

    // Process the email data
    const email = response.data;
    const headers = email.payload.headers;
    const body = email.payload.parts ? email.payload.parts.find(part => part.mimeType === 'text/plain').body.data : email.payload.body.data;

    const decodedBody = Buffer.from(body, 'base64').toString('utf-8');

    const processedEmail = {
      id: email.id,
      threadId: email.threadId,
      subject: headers.find(header => header.name === 'Subject')?.value,
      from: headers.find(header => header.name === 'From')?.value,
      to: headers.find(header => header.name === 'To')?.value,
      date: headers.find(header => header.name === 'Date')?.value,
      body: decodedBody,
    };

    res.json(processedEmail);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to fetch full email', details: error.message });
  }
});

module.exports = router;