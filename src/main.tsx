import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App'

// Pre-flight configuration check
const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL1;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY1;

function renderError() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #0f172a; display: flex; align-items: center; justify-content: center; padding: 24px; color: white; font-family: sans-serif; text-align: center;">
        <div style="max-width: 600px; width: 100%; background-color: rgba(30, 41, 59, 0.5); padding: 48px; border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <div style="width: 80px; height: 80px; background-color: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px;">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#f43f5e"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T800-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
          </div>
          <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">Configuration Required</h1>
          <p style="color: #94a3b8; font-size: 16px; margin-bottom: 32px; line-height: 1.6;">
            Your project is missing Supabase environment variables. <br/>
            Please add <strong style="color: white;">VITE_SUPABASE_URL</strong> and <strong style="color: white;">VITE_SUPABASE_ANON_KEY</strong> to your Vercel Project Settings and redeploy.
          </p>
          <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; margin-bottom: 32px; text-align: left; font-size: 13px;">
            <p style="color: #6366f1; font-weight: bold; margin-bottom: 8px;">Helpful Tip:</p>
            <p style="color: #cbd5e1; line-height: 1.5;">Vercel doesn't automatically pick up local .env files. You must manually add these keys in "Project Settings > Environment Variables" on the Vercel website.</p>
          </div>
          <button onclick="window.location.reload()" style="width: 100%; padding: 16px; background-color: white; color: #0f172a; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
            I've Added Them - Retry 
          </button>
        </div>
      </div>
    `;
  }
}

if (!url || !key) {
  renderError();
} else {
  try {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <ErrorBoundary>
            <BrowserRouter>
              <AuthProvider>
                <AppProvider>
                  <App />
                </AppProvider>
              </AuthProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </StrictMode>,
      );
    }
  } catch (err) {
    console.error("Critical Render Error:", err);
    renderError();
  }
}
