import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const loginUser = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/google`, { token });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const classifyEmails = async (emails, accessToken) => {
  const openaiKey = localStorage.getItem('openaiKey');
  if (!openaiKey) {
    throw new Error('OpenAI key not found');
  }
  try {
    const response = await axios.post(
      `${API_BASE_URL}/emails/classify`,
      { emails, openaiKey },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data.classifiedEmails;
  } catch (error) {
    console.error('Classification error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchEmails = async (accessToken, count = 15) => {
  console.log('Sending access token:', accessToken);
  try {
    const response = await axios.get(`${API_BASE_URL}/emails`, {
      params: { count },
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.emails;
  } catch (error) {
    console.error('Error fetching emails:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchFullEmail = async (accessToken, emailId) => {
  try {
    console.log(`Fetching email with ID: ${emailId}`);
    console.log(`Access Token: ${accessToken.substring(0, 10)}...`);
    const response = await axios.get(`${API_BASE_URL}/emails/${emailId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching full email:', error.response ? error.response.data : error.message);
    throw error;
  }
};