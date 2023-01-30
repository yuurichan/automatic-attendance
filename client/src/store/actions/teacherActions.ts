import { Dispatch } from 'react'
import { GET_TEACHERS, TEACHER_LOADING, CONFIRM_TEACHER, TeacherType } from '../types/teacherTypes'
import { ALERT, AlertType } from '../types/alertTypes'
import { getAPI, putAPI } from '../../utils/fetchApi'


export const getTeachers = (token: string) => async (dispatch: Dispatch<TeacherType | AlertType>) => {
    try {
        dispatch({ type: TEACHER_LOADING, payload: { loading: true } })

        const res = await getAPI('/teachers', token)

        dispatch({ type: GET_TEACHERS, payload: { teachers: res.data.teachers } })
        dispatch({ type: TEACHER_LOADING, payload: { loading: false } })


    } catch (error: any) {
        dispatch({ type: TEACHER_LOADING, payload: { loading: false } })
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}

export const confirmTeacher = (id: string, token: string) => async (dispatch: Dispatch<TeacherType | AlertType>) => {
    try {
        const res = await putAPI(`confirm/${id}`, {}, token)
        dispatch({ type: ALERT, payload: { success: res.data.msg } })
        dispatch({ type: CONFIRM_TEACHER, payload: { id } })
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
    }
}
