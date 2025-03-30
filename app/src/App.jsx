import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ChapterPage from './pages/ChapterPage.jsx';
import ChapterByIdPage from './pages/ChapterByIdPage.jsx';
import Navbar from './components/ui/Navbar.jsx';
import Footer from './components/ui/Footer.jsx';
import './styles/Button.scss'

const App = () => {
    const {authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg size-10"></span>
            </div>
        )
    }

    return (
        <div className='bg-gray_light font-neko'>
            <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
                <Route path='/profile/:nameTag' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
                <Route path='/chat-room' element={authUser ? <ChatPage /> : <Navigate to='/login' />} />
                <Route path='/forgot-password' element={<ForgotPasswordPage />} />
                <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
                <Route path='/post/:id' element={<ChapterPage />} />
                <Route path='/post/:id/chapter/:chapterId' element={<ChapterByIdPage />} />
            </Routes>
            <Toaster
              position="top-left"
              reverseOrder={false}
            />

            {/* Hide Footer on path /chat-container */}
            {location.pathname !== "/chat-room" && <Footer />}
        </div>
    )
}

export default App;