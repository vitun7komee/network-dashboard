import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    background-color: #1f1f1f;
    color: #e4e4e4;
    font-family: 'Inter', sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;
