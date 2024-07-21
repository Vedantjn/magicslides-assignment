import React from 'react';
import styled from 'styled-components';
import EmailItem from './EmailItem';

const EmailListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const EmailList = ({ emails, onEmailClick }) => {
  return (
    <EmailListContainer>
      {emails.map((email) => (
        <EmailItem 
          key={email.id} 
          email={email} 
          onClick={() => onEmailClick(email)}
        />
      ))}
    </EmailListContainer>
  );
};

export default EmailList;