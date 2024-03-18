import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { ThemeConfig } from './config/theme.config.tsx';

import './index.css'; 
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeConfig>
    <App />  
  </ThemeConfig>
  // </React.StrictMode>,
)
