import { Dispatch } from 'react'
import * as types from '../types/lessontypes'
import { LessonPayload, LessonTypes } from '../types/lessontypes'
import { LessonDetailPayload, LessonDetailTypes, GET_LESSON_DETAIL, LOADING_LESSION_DETAIL, UPDATE_LESSON_DETAIL } from "../types/lessonDetailTypes"
import { AlertType, ALERT } from '../types/alertTypes'
import { AuthPayload } from '../types/authTypes'
import { deleteAPI, getAPI, postAPI, putAPI } from '../../utils/fetchApi'
import { Lesson } from '../../utils/interface'
import { RollCallSessionDetailPayload, RollCallSessionDetailType, UPDATE_ROLL_CALL_SESSION_DETAIL } from '../types/rollCallSessionDetailTypes'

// Lay buoi hoc
export const getLessons = (auth: AuthPayload) =>
    async (dispatch: Dispatch<LessonTypes | AlertType>) => {
        if (!auth.user && !auth.access_token) return;

        try {
            dispatch({ type: types.LOADING_LESSON, payload: true })
            const res = await getAPI('lesson', auth.access_token);
            dispatch({ type: types.GET_LESSONS, payload: { lessons: res.data.lessons } })
            dispatch({ type: types.LOADING_LESSON, payload: false })
        } catch (error: any) {
            return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }

// Them buoi hoc
export const createLesson = (lesson: Lesson, auth: AuthPayload) =>
    async (dispatch: Dispatch<LessonTypes | AlertType | LessonDetailTypes>) => {
        if (!auth.user && !auth.access_token && !lesson) return;
        try {

            const res = await postAPI('lesson', { ...lesson, course_id: lesson.course?._id }, auth.access_token);
            console.log(res)
            dispatch({ type: types.CREATE_LESSON, payload: { newLesson: { ...res.data.newLesson, course: { ...lesson.course }, teacher: auth.user } } })
            dispatch({ type: ALERT, payload: { success: res.data.msg } })
        } catch (error: any) {
            return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }

// Chinh sua buoi hoc
export const updateLesson = (lesson: Lesson, auth: AuthPayload, lessonDetail: LessonDetailPayload, rollCallSessionDetail: RollCallSessionDetailPayload) =>
    async (dispatch: Dispatch<LessonTypes | AlertType | LessonDetailTypes | RollCallSessionDetailType>) => {
        if (!auth.access_token && !auth.user) return;
        try {

            const res = await putAPI(`lesson/${lesson._id}`, { ...lesson, course_id: lesson.course?._id }, auth.access_token)

            const newLesson = { ...lesson, teacher: auth.user }
            dispatch({ type: types.UPDATE_LESSON, payload: { newLesson } })
            dispatch({ type: ALERT, payload: { success: res.data.msg } })

            // Cap nhat lai lession detail
            lessonDetail.lessons?.forEach((lessonDetail) => {
                if (lessonDetail.lesson?._id === lesson._id) {
                    dispatch({
                        type: UPDATE_LESSON_DETAIL, payload: {
                            lessonDetail: { ...lessonDetail, lesson: newLesson }
                        }
                    })
                }
            })

            // Cap nhat lai Roll call session detail
            rollCallSessionDetail.rollCallSessions?.forEach((_rollCallSession) => {
                if (_rollCallSession.lesson?._id === lesson._id) {
                    dispatch({
                        type: UPDATE_ROLL_CALL_SESSION_DETAIL,
                        payload: {
                            rollCallSession: { ..._rollCallSession, lesson: newLesson }
                        }
                    })
                }
            })

        } catch (error: any) {
            return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }

// Xoa buoi hoc
export const deleteLesson = (lesson_id: string, auth: AuthPayload) =>
    async (dispatch: Dispatch<LessonTypes | AlertType>) => {
        if (!auth.access_token && !auth.user) return;
        try {
            const res = await deleteAPI(`lesson/${lesson_id}`, auth.access_token)
            dispatch({ type: types.DELETE_LESSON, payload: { lesson_id } })
            dispatch({ type: ALERT, payload: { success: res.data.msg } })
        } catch (error: any) {
            return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }

export const searchLesson = (search: string) => (dispatch: Dispatch<LessonTypes | AlertType>) => {
    dispatch({ type: types.SEARCH_LESSON, payload: { search } })
}

// Lay chi tiet buoi hoc
export const getDetailLesson = (id: string, lessonDetail: LessonDetailPayload, auth: AuthPayload) =>
    async (dispatch: Dispatch<AlertType | LessonDetailTypes>) => {
        if (!auth.access_token || !auth.user) return;

        const isExits = lessonDetail.lessons?.every((lessonDetail) => {
            return lessonDetail.lesson?._id !== id
        });

        if (isExits) {
            try {
                dispatch({ type: LOADING_LESSION_DETAIL, payload: { loading: true } })
                const res = await getAPI(`lesson/${id}`, auth.access_token);

                dispatch({
                    type: GET_LESSON_DETAIL, payload: {
                        lessonDetail: {
                            lesson: res.data.lesson,
                            rollCallSessions: res.data.rollCallSessions
                        }
                    }
                })
                dispatch({ type: LOADING_LESSION_DETAIL, payload: { loading: false } })
            } catch (error: any) {
                return dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
            }
        }
    }