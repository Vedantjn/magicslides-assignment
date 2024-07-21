import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import LoadingFact from './LoadingFact';

const SidebarContainer = styled.div`
  width: 700px;
  height: 100%;
  background-color: #1e1e1e;
  color: #ffffff;
  overflow-y: auto;
  padding: 20px;
  position: fixed;
  top: 0;
  right: ${props => props.$isVisible ? '0' : '-700px'}; // Note the $ before isVisible
  transition: right 0.3s ease-in-out;
  box-shadow: ${props => props.$isVisible ? '-5px 0 15px rgba(0,0,0,0.3)' : 'none'}; // Note the $ before isVisible

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.$isVisible ? '0' : '-100%'}; // Note the $ before isVisible
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
`;

const EmailField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.h4`
  margin-bottom: 5px;
  color: #888888;
  font-size: 14px;
`;

const Value = styled.p`
  margin: 0;
  font-size: 16px;
  word-break: break-word;
  white-space: pre-wrap;
  color: #ffffff;
`;

// const LoadingSpinner = styled.div`
//   border: 4px solid #f3f3f3;
//   border-top: 4px solid #3498db;
//   border-radius: 50%;
//   width: 30px;
//   height: 30px;
//   animation: spin 1s linear infinite;
//   margin: 20px auto;

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
`;

const Sidebar = forwardRef(({ email, onClose, isOpen, isLoading, error }, ref) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const sanitizeEmailContent = (content) => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
      ALLOWED_ATTR: ['href']
    });
  };

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return stripHtmlTags(decodeHtmlEntities(content));
    }
    if (content && content.snippet) {
      return stripHtmlTags(decodeHtmlEntities(content.snippet));
    }
    return 'No content available';
  };


  return (
    <SidebarContainer ref={ref} $isVisible={isVisible}>
      <CloseButton onClick={handleClose}>×</CloseButton>
      
      {isLoading ? (
        <LoadingFact />
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : email ? (
        <>
          <EmailField>
            <Label>From:</Label>
            <Value>{renderContent(email.from || email.sender || 'N/A')}</Value>
          </EmailField>
          
          <EmailField>
            <Label>Subject:</Label>
            <Value>{renderContent(email.subject || 'N/A')}</Value>
          </EmailField>
          
          <EmailField>
            <Label>Content:</Label>
            <Value dangerouslySetInnerHTML={{ __html: email.body ? sanitizeEmailContent(email.body) : '' }} />
          </EmailField>
        </>
      ) : (
        <p>Select an email to view details</p>
      )}
    </SidebarContainer>
  );
});

export default Sidebar;