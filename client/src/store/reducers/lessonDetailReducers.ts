import * as types from "../types/lessonDetailTypes"
import { LessonDetailPayload, LessonDetailTypes } from '../types/lessonDetailTypes'

const initialState: LessonDetailPayload = {
    lessons: [],
    loading: false
}

const lessonDetailReducers = (state: LessonDetailPayload = initialState, action: LessonDetailTypes): LessonDetailPayload => {
    switch (action.type) {
        case types.GET_LESSON_DETAIL: {
            return {
                ...state,
                lessons: state.lessons ? [action.payload.lessonDetail, ...state.lessons] : [action.payload.lessonDetail]
            }
        }
        case types.LOADING_LESSION_DETAIL: {
            return {
                ...state,
                loading: action.payload.loading
            }
        }
        case types.UPDATE_LESSON_DETAIL: {
            return {
                ...state,
                lessons: state.lessons ? state.lessons.map(lessionDetail => {
                    return lessionDetail.lesson?._id === action.payload.lessonDetail.lesson?._id
                        ? { ...action.payload.lessonDetail } : { ...lessionDetail }
                }) : []
            }
        }
        
        default: {
            return {
                ...state,
            }
        }

    }
}

export default lessonDetailReducers;