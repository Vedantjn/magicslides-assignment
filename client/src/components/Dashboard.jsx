import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchEmails as fetchEmailsApi, classifyEmails, fetchFullEmail } from '../utils/api';
import EmailList from './EmailList';
import Sidebar from './Sidebar';

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #111111;
  color: #ffffff;
  transition: margin-right 0.3s ease-in-out;
  margin-right: ${props => props.isSidebarOpen ? '700px' : '0'}; // Match sidebar width

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  width: 100%;
  margin: 0 auto 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserEmail = styled.span`
  color: #ffffff;
  font-size: 14px;
  margin-right: 10px;
`;

const EmailCount = styled.select`
  background-color: #111111;
  color: #ffffff;
  border: 1px solid #333333;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #333333;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 10px;
  font-size: 14px;
`;

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailCount, setEmailCount] = useState(15);
  const [userEmail, setUserEmail] = useState('');
  const [fullEmail, setFullEmail] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleEmailClick = async (email) => {
    setIsSidebarOpen(true);
    setIsLoading(true);
    setError(null);
    setFullEmail(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // If the email already has full content, use it directly
      if (email.body) {
        setFullEmail(email);
      } else {
        // Otherwise, fetch the full email content
        const fullEmailContent = await fetchFullEmail(user.access_token, email.id);
        setFullEmail(fullEmailContent);
      }
    } catch (error) {
      console.error('Error fetching full email:', error);
      setError('Failed to fetch full email content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleSidebarClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const fetchedEmails = await fetchEmailsApi(user.access_token, emailCount);
      setEmails(fetchedEmails);
      setUserEmail(user.email);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [emailCount]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleClassify = async () => {
    setLoading(true);
    setError(null);
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const classified = await classifyEmails(emails, user.access_token);
      setEmails(classified);
    } catch (error) {
      console.error('Error classifying emails:', error);
      setError('Failed to classify emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('openaiKey');
    navigate('/');
  };

  return (
    <DashboardContainer>
      <MainContent>
        <Header>
          <UserInfo>
            <UserEmail>{userEmail}</UserEmail>
            <EmailCount value={emailCount} onChange={(e) => setEmailCount(Number(e.target.value))}>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </EmailCount>
          </UserInfo>
          <div>
            <Button onClick={handleClassify}>Classify</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </Header>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <EmailList emails={emails} onEmailClick={handleEmailClick} />
        {loading && <LoadingSpinner />}
      </MainContent>
      <Sidebar 
        ref={sidebarRef} 
        email={fullEmail} 
        onClose={() => setIsSidebarOpen(false)}
        isOpen={isSidebarOpen}
        isLoading={isLoading}
        error={error}
      />
    </DashboardContainer>
  );
};

export default Dashboard;
