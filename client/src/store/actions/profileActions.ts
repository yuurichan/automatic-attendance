import { Dispatch } from "react";
import { ALERT, AlertType } from '../types/alertTypes'
import { AUTH, AuthPayload, AuthType } from '../types/authTypes'
import {
    EDIT_USER_COURSE,
    GET_USER_COURSE,
    LOADING_USER_COURSE,
    SEARCH_BY_USER_COURSE_NAME,
    SEARCH_BY_USER_COURSE_CODE,
    ProfileType
} from '../types/profileTypes'
import { checkImageUpload, uploadImage } from '../../utils/imageHelper'
import { Course } from '../../utils/interface'
import { putAPI, getAPI } from "../../utils/fetchApi";
// import { Course } from "../../utils/interface";


export const updateProfile = (name: string, file: File, auth: AuthPayload) => async (dispatch: Dispatch<AlertType | AuthType>) => {
    if (!auth.access_token || !auth.user) return
    // Check image
    if (file) {
        let errors: string[] = []
        errors = checkImageUpload(file);
        if (errors.length !== 0) {
            return dispatch({ type: ALERT, payload: { error: errors } })
        }
    }

    // Update profile
    try {
        // Upload image to cloud
        let avatar: string = ""
        if (file) {
            const photo = await uploadImage(file);
            avatar = photo.url;
        }

        const res = await putAPI('update_user', {
            name: name ? name : auth.user.name,
            avatar: avatar ? avatar : auth.user.avatar
        }, auth.access_token)
        dispatch({ type: ALERT, payload: { success: res.data.msg } })
        dispatch({
            type: AUTH, payload: {
                ...auth,
                user: {
                    ...auth.user,
                    name: name ? name : auth.user.name,
                    avatar: avatar ? avatar : auth.user.avatar
                }
            }
        })

    } catch (error: any) {
        return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }

}

export const resetPassword = (password: string, auth: AuthPayload) => async (dispatch: Dispatch<AlertType>) => {
    if (!auth.access_token || !auth.user) return
    try {

        const res = await putAPI("reset_password", { password }, auth.access_token)
        dispatch({ type: ALERT, payload: { success: res.data.msg } })

    } catch (error: any) {
        console.log(error.response);
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}

export const getUserCourse = (token: string, userId: string) => async (dispatch: Dispatch<ProfileType | AlertType>) => {
    if (!token) return
    try {
        dispatch({ type: LOADING_USER_COURSE, payload: { loading: true } })
        const res = await getAPI(`user_course/${userId}`, token)

        const { courses, total, result } = res.data

        dispatch({ type: GET_USER_COURSE, payload: { courses, total, result } })
        dispatch({ type: LOADING_USER_COURSE, payload: { loading: false } })

    } catch (error: any) {
        dispatch({ type: LOADING_USER_COURSE, payload: { loading: false } })
        return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}

export const editUserCourse = (course: any) => async (dispatch: Dispatch<ProfileType | AlertType>) => {
    dispatch({ type: EDIT_USER_COURSE, payload: { course } })
}

export const searchByCourseName = (search: string) => (dispatch: Dispatch<ProfileType>) => {
    dispatch({ type: SEARCH_BY_USER_COURSE_NAME, payload: { search } })
}

export const searchByCourseCode = (search: string) => (dispatch: Dispatch<ProfileType>) => {
    dispatch({ type: SEARCH_BY_USER_COURSE_CODE, payload: { search } })
}