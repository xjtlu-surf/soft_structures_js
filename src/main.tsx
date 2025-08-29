import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

// 这里可以根据需要切换语言，默认中文
const locale = zhCN

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={locale}>
    <App />
    </ConfigProvider>
  </StrictMode>,
)
