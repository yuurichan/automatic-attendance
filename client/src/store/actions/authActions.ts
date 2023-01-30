import { Dispatch } from 'react'
import { AUTH, AuthType, AuthPayload } from '../types/authTypes'
import { ALERT, AlertType } from '../types/alertTypes'

import { getAPI } from '../../utils/fetchApi'

export const login = (data: AuthPayload) => async (dispatch: Dispatch<AuthType>) => {
    dispatch({ type: AUTH, payload: data })
    localStorage.setItem("first-login", 'first-login')
}

export const refreshToken = () => async (dispatch: Dispatch<AuthType | AlertType>) => {

    const firstLogin = localStorage.getItem("first-login")
    if (!firstLogin) return;
    try {
        dispatch({ type: ALERT, payload: { loading: true } })    
        const res = await getAPI("refresh_token")
        dispatch({ type: AUTH, payload: res.data })
        dispatch({ type: ALERT, payload: { loading: false } })

    } catch (error: any) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}

export const logout = () => async (dispatch: Dispatch<AuthType | AlertType>) => {
    try {

        dispatch({ type: ALERT, payload: { loading: true } })

        localStorage.removeItem("first-login")
        await getAPI('logout');

        dispatch({ type: ALERT, payload: { loading: false } })
        window.location.href = "/sign-in"
      
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}