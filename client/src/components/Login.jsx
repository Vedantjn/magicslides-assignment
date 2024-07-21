import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser } from '../utils/api';
import { setOpenAIKey } from '../utils/localStorage';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000000;
  color: #ffffff;
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ffffff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 300px;
  background-color: #000000;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 4px;
`;

const Login = () => {
  const [openaiKey, setOpenaiKeyState] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = async (tokenResponse) => {
    try {
      console.log("Token response:", tokenResponse);
      const res = await loginUser(tokenResponse.access_token);
      if (res.user) {
        const userToStore = {
          ...res.user,
          access_token: tokenResponse.access_token // Make sure to include the access token
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        setOpenAIKey(openaiKey);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (error) => console.log('Login Failed:', error),
    scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
    flow: 'implicit'
  });

  return (
    <LoginContainer>
      <Button onClick={() => login()}>Login with Google</Button>
      <Input
        type="password"
        placeholder="Enter OpenAI API Key"
        value={openaiKey}
        onChange={(e) => setOpenaiKeyState(e.target.value)}
      />
    </LoginContainer>
  );
};

export default Login;