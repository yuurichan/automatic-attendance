import React, { useEffect, useState } from 'react';
import { AuthPayload } from '../../store/types/authTypes'
import VietNameIcon from '../../images/vietnam.png'
import dayjs from 'dayjs'
interface DashBroadUserProps {
    auth: AuthPayload
}

const DashBroadUser: React.FC<DashBroadUserProps> = ({ auth }) => {

    const [time, setTime] = useState(new Date().toISOString())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toISOString())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return <div className="dashbroad__user">
        <div className="dashbroad__user-infor">
            <img src={auth.user?.avatar} alt="avatar" />
            <div>
                <h2 className="infor__name">Chào mừng, {auth.user?.name}</h2>
                <div className="infor__detail">
                    <i className='bx bxs-graduation'></i>
                    <span>Bạn đăng nhập với tư cách là {auth.user?.role}</span>
                </div>
            </div>
        </div>
        <div className="dashbroad__user-time">
            <div className='time__box'>
                <div className="time__box-text">
                    <span>{dayjs(time).format('hh:mm:ss A')}</span>
                    <span>{dayjs(time).format('DD-MM-YYYY')}</span>
                </div>
                <img src={VietNameIcon} alt="vietnam-icon" />
            </div>

        </div>
    </div>;
};

export default DashBroadUser;
