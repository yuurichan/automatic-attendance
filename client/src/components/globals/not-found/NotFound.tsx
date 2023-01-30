import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.scss'
const NotFound = () => {
    return (
        <div className='notfound'>
            <img className="notfound__image" src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1643876876/nienluannganh/404_uz4lp1.png" alt="not found">
            </img>
            <h3 className="notfound__heading">Ooops... 404!</h3>
            <p className="notfound__detail">
                Trang bạn yêu cầu không thể được tìm thấy
            </p>
            <Link className="notfound__link" to="/">Quay lại</Link>
        </div>
    )
}

export default NotFound
