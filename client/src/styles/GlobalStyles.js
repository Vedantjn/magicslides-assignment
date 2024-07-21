import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #000000;
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  body.sidebar-open {
    overflow: hidden;
  }
`;

export default GlobalStyles;