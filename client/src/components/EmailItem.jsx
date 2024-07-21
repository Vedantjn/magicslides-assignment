import React from 'react';
import styled from 'styled-components';

const EmailItemContainer = styled.div`
  background-color: #111111;
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 10px 15px 20px 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto 10px;
  max-width: 900px;
  height: 130px; // Set a fixed height
`;

const EmailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  min-height: 28px; // Ensure consistent height whether classification is present or not
`;

const EmailSubject = styled.p`
  margin: 0 0 5px;
  font-size: 16px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailSnippet = styled.p`
  margin: 0;
  font-size: 14px;
  color: #cccccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailSender = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #ffffff;
`;

const Classification = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  background-color: ${(props) => {
    switch (props.type) {
      case 'Important':
        return '#00FF00';
      case 'Promotions':
        return '#FFFF00';
      case 'Social':
        return '#FF0000';
      case 'Marketing':
        return '#FF0000';
      case 'Spam':
        return '#FF0000';
      case 'General':
        return '#FF0000';
      default:
        return '#FFFFFF';
      
    }
  }};
`;

const EmailItem = ({ email, onClick }) => {
  return (
    <EmailItemContainer onClick={onClick}>
      <EmailHeader>
        <EmailSender>{email.sender}</EmailSender>
        {email.classification && (
          <Classification type={email.classification}>
            {email.classification}
          </Classification>
        )}
      </EmailHeader>
      <EmailSubject>{email.subject}</EmailSubject>
      <EmailSnippet>
        {email.body ? email.body.substring(0, 100) + '...' : email.snippet}
      </EmailSnippet>
    </EmailItemContainer>
  );
};

export default EmailItem;