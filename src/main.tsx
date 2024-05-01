import React from 'react'
import ReactDOM from 'react-dom/client'
import './plugins/i18n'
import App from '@/App.tsx'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import '@/scss/index.scss'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
    <LanguageSwitcher />
  </React.StrictMode>,
)
