import React from 'react'
import Logo from '../images/logo.png'
import SignInForm from '../components/auth/SignInForm'
import { Link } from 'react-router-dom'
const SignIn = () => {
    return (
        <div className="sign-in auth-page">
            <div className="auth-page__form">
                <div className="auth-page__form-wrapper">
                    <img src={Logo} alt="logo" className="auth-page__form-logo" />
                    <h2 className="auth-page__form-title">Đăng Nhập</h2>
                    <p className="auth-page__form-detail">Bạn chưa có tài khoản? <Link to='/sign-up'>Đăng kí</Link></p>
                    <SignInForm />
                </div>
            </div>
            <div className="auth-page__background">
                <div className='auth-page__background-content'>
                    <h2>Chào mừng bạn đến với CLASSKIT</h2>
                    <p>Với trang web này việc điểm danh sinh viên trở nên dễ dàng khi giáo viên có thể tự điểm danh, hoặc có thể điểm danh tự động bằng khuôn mặt một cách chính xác,
                        nhanh gọn, ổn định, hạn chế mọi thủ tục rườm rà.</p>
                    <div className='auth-page__background-circle auth-page__background-circle--small'></div>
                    <div className='auth-page__background-circle auth-page__background-circle--medium'></div>
                    <div className='auth-page__background-dots'>
                        <svg width="300" height="200" viewBox="0 0 100 100">
                            <defs>
                                <pattern id="lines" height="10" width="10" patternUnits="userSpaceOnUse">
                                    <line x1="0" y1="4" x2="2" y2="4" strokeWidth="2" stroke="rgba(90, 102, 119, 0.5)" />
                                </pattern>
                            </defs>
                            <rect x="10" y="10" width="80" height="80" fill="url(#lines)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
