import React, { useState } from 'react'
import "./auth.scss"
import { InputChange, FormSubmit, UserLogin, UserAuthErrors } from '../../utils/interface'
import { validLogin } from '../../utils/valid'
import Loading from '../globals/loading/Loading'
import { postAPI } from '../../utils/fetchApi'
import { useDispatch } from 'react-redux'
import { ALERT } from '../../store/types/alertTypes'
import { login } from '../../store/actions/authActions'
const SignInForm = () => {

    const dispatch = useDispatch()

    const initalState: UserLogin = {
        account: "",
        password: "",
    }

    const initalStateErores: UserAuthErrors = {
        errorAccount: "",
        errorPassword: "",
    }

    const [user, setUser] = useState<UserLogin>(initalState)
    const [errors, setErrors] = useState<UserAuthErrors>(initalStateErores)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const { account, password } = user;

    const handleChange = (e: InputChange) => {
        const target = e.target;
        const name = target.name;
        const value = target.value

        setUser({
            ...user,
            [name]: value
        })
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
    }

    const handeSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        const errors = validLogin(user)
        setErrors(errors)
        // If no error -> Pass validation
        if (Object.keys(errors).length === 0) {
            try {
                setLoading(true)
                const res = await postAPI('login', user);
                dispatch({ type: ALERT, payload: { success: res.data.msg } })
                dispatch(login(res.data))
                setLoading(false)
            } catch (error: any) {
                dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
                setLoading(false)
            }
        }
    }

    return (
        <form onSubmit={handeSubmit}>
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
            <button className="btn-primary">{
                loading ? <Loading type='small' /> : "Đăng nhập"
            }</button>
        </form>
    )
}

export default SignInForm
