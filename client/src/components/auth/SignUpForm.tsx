import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import "./auth.scss"
import { InputChange, FormSubmit, UserRegister, UserAuthErrors } from '../../utils/interface'
import { validRegister } from '../../utils/valid'
import { postAPI } from '../../utils/fetchApi'
import { ALERT } from '../../store/types/alertTypes'
import Loading from '../globals/loading/Loading'
const SignUpForm = () => {

    const dispatch = useDispatch();

    const initalState: UserRegister = {
        name: "",
        account: "",
        password: "",
        cfPassword: ""
    }

    const initalStateErores: UserAuthErrors = {
        errorName: "",
        errorAccount: "",
        errorPassword: "",
        errorCfPassword: "",
        errorPasswordMatch: ""
    }

    const [user, setUser] = useState<UserRegister>(initalState)
    const [errors, setErrors] = useState<UserAuthErrors>(initalStateErores)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showCfPassword, setShowCfPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)


    const { name, account, password, cfPassword } = user;

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
        e.preventDefault()
        const errors = validRegister(user)
        setErrors(errors)
        // If no error -> Pass validation
        if (Object.keys(errors).length === 0) {
            setLoading(true)
            try {
                const res = await postAPI('register', user);
                setLoading(false)
                console.log(res)
                setUser(initalState)
                dispatch({ type: ALERT, payload: { success: res.data.msg } })
            } catch (error: any) {
                setLoading(false)
                dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
                console.log(error.response.data.msg);
            }
        }
    }

    return (
        <form onSubmit={handeSubmit}>
            <div className='form-group'>
                <label htmlFor="name">Họ và Tên *</label>
                <input className={errors.errorName && "danger"} type="text" id="name" name="name" value={name} onChange={handleChange} />
                {
                    errors.errorName && <small className="error-text">{errors.errorName}</small>
                }
            </div>
            <div className='form-group'>
                <label htmlFor="account">Email *</label>
                <input className={errors.errorAccount && "danger"} type="text" id="account" name="account" value={account} onChange={handleChange} />
                {
                    errors.errorAccount && <small className="error-text">{errors.errorAccount}</small>
                }
            </div>
            <div className='form-group'>
                <label htmlFor="password">Mật khẩu *</label>
                <div className="form-group__password">
                    <input className={errors.errorPassword && "danger"} type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={handleChange} />
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
            <div className='form-group'>
                <label htmlFor="cfPassword">Nhập lại mật khẩu *</label>
                <div className="form-group__password">
                    <input className={errors.errorCfPassword && "danger"} type={showCfPassword ? "text" : "password"} id="cfPassword" name="cfPassword" value={cfPassword} onChange={handleChange} />
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
            <button className="btn-primary">{
                loading ? <Loading type='small'/> : "Đăng kí"
            }</button>
        </form>
    )
}

export default SignUpForm
