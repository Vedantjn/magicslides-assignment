import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const emailFacts = [
    "The first email was sent in 1971 by Ray Tomlinson.",
    "The '@' symbol in email addresses is called the 'asperand'.",
    "Over 300 billion emails are sent daily worldwide.",
    "The most common password for email accounts is '123456'.",
    "Gmail was launched on April Fool's Day in 2004.",
    "The term 'spam' comes from a Monty Python sketch.",
    "You've got mail... and probably a lot of it!",
    "Email moves through the internet at the speed of light.",
    "The first email spam was sent in 1978.",
    "Emails travel through underwater cables across oceans.",
    "The 'CC' in email stands for 'Carbon Copy'.",
    "BCC stands for 'Blind Carbon Copy', not 'Blank Carbon Copy'.",
    "The average office worker receives 121 emails per day.",
    "Email predates the Internet by several years.",
    "The longest email address can be 64 characters long."
  ];

const FactSpinner = styled.div`
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: white;
  animation: fadein 2s infinite alternate;

  @keyframes fadein {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
`;

const LoadingFact = () => {
  const [fact, setFact] = useState(emailFacts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFact(emailFacts[Math.floor(Math.random() * emailFacts.length)]);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return <FactSpinner>Did you know? {fact}</FactSpinner>;
};

export default LoadingFact
