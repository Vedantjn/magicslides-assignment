const { google } = require('googleapis');

const getGmailEmails = async (accessToken, count) => {
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
        format: 'full', // Request full message format
      });

      const headers = email.data.payload.headers;
      const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
      const fromHeader = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
      
      // Extract sender name or organization
      const fromMatch = fromHeader.match(/^(?:"?(.+?)"?\s)?(?:<?(.+@[^>]+)>?)$/);
      const sender = fromMatch ? (fromMatch[1] || fromMatch[2].split('@')[0]) : 'Unknown Sender';

      // Extract the email body
      let body = '';
      if (email.data.payload.parts) {
        // If the email has parts (multipart email)
        const bodyPart = email.data.payload.parts.find(part => part.mimeType === 'text/plain' || part.mimeType === 'text/html');
        if (bodyPart && bodyPart.body.data) {
          body = Buffer.from(bodyPart.body.data, 'base64').toString('utf-8');
        }
      } else if (email.data.payload.body.data) {
        // If the email body is directly in the payload
        body = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8');
      }

      return {
        id: email.data.id,
        subject: subject,
        sender: sender,
        snippet: email.data.snippet,
        body: body, // Include the full body
      };
    })
  );

  return emails;
};

module.exports = { getGmailEmails };

module.exports = { getGmailEmails };