import { Dispatch } from 'react'
import * as types from '../types/rollCallSessionTypes'
import { RollCallSessionType } from '../types/rollCallSessionTypes'
import {
    GET_ROLL_CALL_SESSION_DETAIL, UPDATE_ROLL_CALL_SESSION_DETAIL,
    RollCallSessionDetailType, RollCallSessionDetailPayload, LOADING_ROLL_CALL_SESSION_DETAIL
} from '../types/rollCallSessionDetailTypes'
import { LessonDetailPayload, LessonDetailTypes, UPDATE_LESSON_DETAIL } from '../types/lessonDetailTypes'
import { AuthPayload } from '../../store/types/authTypes'
import { ALERT, AlertType } from '../../store/types/alertTypes'
import { RollCallSession, Lesson } from '../../utils/interface'
import { getAPI, postAPI, putAPI } from '../../utils/fetchApi'

export const createRollCallSession = (data: any, auth: AuthPayload, history: any, lessonDetail: LessonDetailPayload, lesson: Lesson) =>
    async (dispatch: Dispatch<RollCallSessionType | AlertType | LessonDetailTypes>) => {
        if (!auth.access_token && !auth.user) return;
        try {


            const res = await postAPI('roll_call_session', data, auth.access_token);
            dispatch({ type: ALERT, payload: { success: res.data.msg } })
            dispatch({ type: types.CREATE_ROLL_CALL_SESSION, payload: { rollCallSession: res.data.newRollCallSession } })


            const attendanceDetails = lesson.course && lesson.course?.students?.map((student) => {
                return {
                    student: student._id,
                    note: "",
                    isAttendance: false,
                    absent: true
                }
            })

            lessonDetail.lessons?.forEach((_lesson) => {
                if (_lesson.lesson?._id === lesson._id) {
                    dispatch({
                        type: UPDATE_LESSON_DETAIL, payload: {
                            lessonDetail: {
                                ..._lesson,
                                rollCallSessions: _lesson.rollCallSessions && [..._lesson.rollCallSessions, { ...res.data.newRollCallSession, attendanceDetails }]
                            }
                        }
                    })
                }
            })

            history.push(`/roll-call-session/${res.data.newRollCallSession._id}`)
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }

export const getDetailRollCallSession =
    (rollCallSessionDetail: RollCallSessionDetailPayload, rollCallSession_ID: string, auth: AuthPayload) =>
        async (dispatch: Dispatch<RollCallSessionDetailType | AlertType>) => {
            if (!auth.access_token) return;
            if (rollCallSessionDetail.rollCallSessions?.every((item: RollCallSession) =>
                item._id !== rollCallSession_ID
            )) {
                try {
                    dispatch({ type: LOADING_ROLL_CALL_SESSION_DETAIL, payload: { loading: true } })
                    const res = await getAPI(`roll_call_session/${rollCallSession_ID}`, auth.access_token)
                    dispatch({
                        type: GET_ROLL_CALL_SESSION_DETAIL, payload: {
                            rollCallSession: { ...res.data.rollCallSession }
                        }
                    })
                    dispatch({ type: LOADING_ROLL_CALL_SESSION_DETAIL, payload: { loading: false } })
                } catch (error: any) {
                    dispatch({ type: LOADING_ROLL_CALL_SESSION_DETAIL, payload: { loading: false } })
                    dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
                }
            }
        }

export const updateDetailRollCallSession =
    (rollCallSessionDetail: RollCallSession, auth: AuthPayload, RollCallSessionDetailPayload: RollCallSessionDetailPayload, lessonDetail: LessonDetailPayload) =>
        async (dispatch: Dispatch<RollCallSessionDetailType | AlertType | LessonDetailTypes>) => {
            if (!auth.access_token) return;
            try {
                const res = await putAPI(`roll_call_session/${rollCallSessionDetail._id}`, rollCallSessionDetail, auth.access_token);
                dispatch({ type: ALERT, payload: { success: "Cập nhật thành công" } });

                // Udpate roll call session detail
                RollCallSessionDetailPayload.rollCallSessions?.forEach((_rollCallSession) => {
                    if (_rollCallSession._id === res.data.rollCallSession._id) {
                        dispatch({ type: UPDATE_ROLL_CALL_SESSION_DETAIL, payload: { rollCallSession: rollCallSessionDetail } })
                    }
                })

                // update lesson detail
                lessonDetail.lessons?.forEach(_lesson => {
                    if (_lesson.lesson?._id === rollCallSessionDetail.lesson?._id) {
                        const newRollCallSessions = _lesson.rollCallSessions?.map((_rollCallSession) => {
                            return _rollCallSession._id === rollCallSessionDetail._id ? rollCallSessionDetail : _rollCallSession
                        })
                        dispatch({
                            type: UPDATE_LESSON_DETAIL, payload: {
                                lessonDetail: { ..._lesson, rollCallSessions: newRollCallSessions }
                            }
                        })
                    }
                })
            } catch (error: any) {
                dispatch({ type: LOADING_ROLL_CALL_SESSION_DETAIL, payload: { loading: false } })
                dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
            }
        }

export const updateAttendanceDetail =
    (rollCallSessionDetail: RollCallSession, auth: AuthPayload, RollCallSessionDetailPayload: RollCallSessionDetailPayload, lessonDetailPayload: LessonDetailPayload) =>
        async (dispatch: Dispatch<RollCallSessionDetailType | AlertType | LessonDetailTypes>) => {
            if (!auth.access_token) return;
            try {
                // Cap nhat lai lession detail         
                lessonDetailPayload.lessons?.forEach(_lessionDetail => {
                    _lessionDetail.rollCallSessions?.forEach((_rollCallSesson) => {
                        if (_rollCallSesson._id === rollCallSessionDetail._id) {
                            const newrollCallSessions = _lessionDetail.rollCallSessions?.map((item) => {
                                return item._id === rollCallSessionDetail._id ? rollCallSessionDetail : item
                            })
                            dispatch({
                                type: UPDATE_LESSON_DETAIL, payload: {
                                    lessonDetail: { ..._lessionDetail, rollCallSessions: newrollCallSessions }
                                }
                            })
                        }
                    })
                });

                RollCallSessionDetailPayload.rollCallSessions?.forEach((_rollCallSession) => {
                    if (_rollCallSession._id === rollCallSessionDetail._id) {
                        dispatch({ type: UPDATE_ROLL_CALL_SESSION_DETAIL, payload: { rollCallSession: rollCallSessionDetail } })
                    }
                })
            } catch (error: any) {
                dispatch({ type: LOADING_ROLL_CALL_SESSION_DETAIL, payload: { loading: false } })
                dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
            }
        }

export const getRollCallSessionUser = (auth: AuthPayload) =>
    async (dispatch: Dispatch<RollCallSessionType | AlertType>) => {
        if (!auth.access_token && !auth.user) return;
        try {
            const res = await getAPI(`roll_call_session_user/${auth.user?._id}`, auth.access_token);
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { error: error.response.data.msg } })
        }
    }