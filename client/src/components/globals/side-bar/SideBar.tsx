import React from 'react';
import Logo from '../../../images/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { RootStore } from '../../../utils/interface'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../../store/actions/authActions'
import "./SideBar.scss"
import { TOGGLE } from '../../../store/types/sidebarTypes'

// MUI
import { IconButton } from '@mui/material';
import PrimaryTooltip from '../tool-tip/Tooltip';
const SideBar = () => {

    const dispatch = useDispatch();

    const { auth, sidebar } = useSelector((state: RootStore) => state)
    const localtion = useLocation();

    const avtive = (path: string) => {
        if (path === localtion.pathname) {
            return "active"
        }
        return "";
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    const handleCloseSideBar = () => {
        dispatch({ type: TOGGLE, payload: { open: true } })
    }

    return <div className='side-bar-wrapper'>
        <div className={`side-bar__fade ${sidebar.open === false ? "active" : ""}`} onClick={handleCloseSideBar}></div>
        <div className={`side-bar ${sidebar.open ? "side-bar--right" : ""}`}>
            <div className="side-bar__header">
                <Link to='/'>
                    <img className="side-bar__header-logo" src={Logo} alt='logo'></img>
                </Link>
                <PrimaryTooltip title="Đóng">
                    <IconButton size="large" onClick={handleCloseSideBar}>
                        <i className='bx bx-x' style={{color:"#fff", fontSize:"3rem"}}></i>
                    </IconButton>
                </PrimaryTooltip>
            </div>
            <div className='side-bar__infor'>
                <img src={auth.user ? auth.user.avatar : ""} alt="user-avatar">
                </img>
                <h2 className='side-bar__infor-name'>
                    {auth.user?.name}
                </h2>
                <p className='side-bar__infor-email'>
                    {auth.user?.account}
                </p>
            </div>
            <div className='side-bar__menu'>
                <div className="side-bar__menu-user">
                    <div className="user__as">
                        <h3>Đăng nhập với tư cách</h3>
                        <p>{auth.user?.role}</p>
                    </div>
                    <ul className="user__list">

                        <li className={avtive("/")}>
                            <Link to="/">
                                <i className="bx bx-calendar-week"></i>
                                <span>Điều khiển</span>
                            </Link>
                        </li>

                        <li className={avtive(`/profile/${auth.user?._id}`)}>
                            <Link to={`/profile/${auth.user?._id}`}>
                                <i className="bx bx-user-circle"></i>
                                <span>Tài khoản</span>
                            </Link>
                        </li>

                        <li>
                            <div onClick={handleLogout}>
                                <i className="bx bx-exit"></i>
                                <span>Đăng xuất</span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    </div>;
};

export default SideBar;
