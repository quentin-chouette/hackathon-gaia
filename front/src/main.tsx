import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles';
import { chouetteTheme } from './themes.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={chouetteTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
)
