import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { router } from './router'
import viVN from 'antd/locale/vi_VN'
import "antd/dist/reset.css"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={viVN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)
