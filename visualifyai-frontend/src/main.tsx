import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// styles
import '@/assets/css/global.css'
import '@/assets/scss/main.scss'

// service
import '@/services/global-service.ts'

// configs
import { antdThemeConfig } from '@/configs/antd-theme.ts'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={antdThemeConfig}>
    <App />
  </ConfigProvider>
)
