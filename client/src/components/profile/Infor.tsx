import React, { Dispatch, useState } from 'react';
import "./Infor.scss"
import { User, UserAuthErrors, UserProfile, InputChange, FormSubmit } from "../../utils/interface"
import Loading from "../../components/globals/loading/Loading"
import { validUpdatePassword } from '../../utils/valid'
import { resetPassword, updateProfile } from '../../store/actions/profileActions'
interface InforProps {
    auth: {
        access_token?: string
        user?: User
    }
    id: string
    dispatch: Dispatch<any>
}

const Infor: React.FC<InforProps> = ({ auth, id, dispatch }) => {

    const initalState: UserProfile = {
        name: "",
        password: "",
        cfPassword: "",
        avatar: ""
    }

    const initalStateErores: UserAuthErrors = {
        errorName: "",
        errorAccount: "",
        errorPassword: "",
    }

    const [user, setUser] = useState<UserProfile>(initalState)
    const [errors, setErrors] = useState<UserAuthErrors>(initalStateErores)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showCfPassword, setShowCfPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const { name, password, cfPassword, avatar } = user;

    const handleChange = (e: InputChange) => {
        const target = e.target;
        const name = target.name;
        const value = target.value

        setUser({
            ...user,
            [name]: value
        })

        if (name === "name") {
            setErrors({
                ...errors,
                errorName: ""
            })
        }
        if (name === "account") {
            setErrors({
                ...errors,
                errorAccount: ""
            })
        }
        if (name === "password") {
            setErrors({
                ...errors,
                errorPassword: ""
            })
        }
        if (name === "cfPassword") {
            setErrors({
                ...errors,
                errorCfPassword: ""
            })
        }

    }

    const handeSubmit = async (e: FormSubmit) => {
        e.preventDefault();
        setLoading(true)
        if (name || avatar && auth.access_token) {
            await dispatch(updateProfile(name as string, avatar as File, auth))
        }

        // Cap nhat lai ma khau 
        if (password && auth.access_token) {
            const errors = validUpdatePassword(user)
            setErrors(errors)
            if (Object.keys(errors).length === 0) {
                await dispatch(resetPassword(password, auth));
                setUser(initalState)
                setErrors(initalStateErores)
            }
        }

        if ((name || avatar) && !password) {
            setUser(initalState)
        }
        
        setLoading(false)
    }

    const handleChangeFile = (e: InputChange) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files?.length !== 0 && files !== null) {
            const file = files[0]
            setUser({
                ...user,
                avatar: file
            })
        }
    }

    return <div className="profile__infor">
        <h2 className="profile__infor-heading">Cập nhật thông tin</h2>
        <form onSubmit={handeSubmit}>
            <div className="avatar">
                <div className="avatar__wrapper">
                    <img src={avatar ? URL.createObjectURL(avatar as Blob) : auth.user?.avatar} alt='avatar'>
                    </img>
                    <span>
                        <i className='bx bx-upload'></i>
                        <p>Upload</p>
                        <input onChange={handleChangeFile} type="file" id="file-up" accept='image/*' name='file-up' />
                    </span>
                </div>
            </div>

            <div className='form-group'>
                <label htmlFor="name">Họ và Tên *</label>
                <input className={errors.errorName && "danger"} type="text" id="name" name="name" value={name} onChange={handleChange} />
                {
                    errors.errorName && <small className="error-text">{errors.errorName}</small>
                }
            </div>

            <div className='form-group'>
                <label htmlFor="account">Email *</label>
                <input disabled={true} type="text" id="account" name="account" value={auth.user ? auth.user.account : ""}
                    onChange={handleChange} />
            </div>
            {/* Password */}
            <div className='form-group'>
                <label htmlFor="password">Mật khẩu *</label>
                <div className="form-group__password">
                    <input className={errors.errorPassword && "danger"} type={showPassword ? "text" : "password"}
                        id="password" name="password" value={password} onChange={handleChange} />
                    <span onClick={() => setShowPassword(!showPassword)} className="btn-circle">
                        {
                            showPassword ?
                                <i className='bx bxs-show'></i> :
                                <i className='bx bxs-low-vision'></i>
                        }
                    </span>
                </div>
                {
                    errors.errorPassword && <small className="error-text">{errors.errorPassword}</small>
                }
            </div>

            {/* Confirm password */}
            <div className='form-group'>
                <label htmlFor="cfPassword">Nhập lại mật khẩu *</label>
                <div className="form-group__password">
                    <input className={errors.errorCfPassword && "danger"} type={showCfPassword ? "text" : "password"}
                        id="cfPassword" name="cfPassword" value={cfPassword} onChange={handleChange} />
                    <span onClick={() => setShowCfPassword(!showCfPassword)} className="btn-circle">
                        {
                            showCfPassword ?
                                <i className='bx bxs-show'></i> :
                                <i className='bx bxs-low-vision'></i>
                        }
                    </span>
                </div>
                {
                    errors.errorCfPassword && <small className="error-text">{errors.errorCfPassword}</small>
                }
                {
                    (!errors.errorCfPassword && errors.errorPasswordMatch) && <small className="error-text">{errors.errorPasswordMatch}</small>
                }
            </div>
            <button className={(!password && !name && !avatar) ? "btn-primary btn-primary--disable" : "btn-primary"} disabled={(!password && !name && !avatar) ? true : false}>{
                loading ? <Loading type='small' /> : "Cập nhật"
            }</button>
        </form >
    </div >;
};

export default Infor;
