import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

import { setupFetchInterceptor } from './utils/FetchInterceptor.js'
import './i18n/i18n.js'
// ✅ Setup interceptor BEFORE React renders
setupFetchInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);