import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import './index.css'
import App from './App.tsx' //메인 페이지
import SignUp from './pages/sign-up.tsx' // 회원가입 페이지
import SignIn from './pages/sign-in.tsx' // 로그인 페이지

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
