import { LessonDetail, Lesson } from '../../utils/interface'

export const GET_LESSON_DETAIL = "GET_LESSON_DETAIL"
export const UPDATE_LESSON_DETAIL = "UPDATE_LESSON_DETAIL"
export const LOADING_LESSION_DETAIL = "LOADING_LESSION_DETAIL"

export interface LessonDetailPayload {
    lessons?: LessonDetail[]
    loading?: boolean
}

export interface GetLessonDetail {
    type: typeof GET_LESSON_DETAIL,
    payload: {
        lessonDetail: LessonDetail

    }
}

export interface LoadingLessionDetail {
    type: typeof LOADING_LESSION_DETAIL,
    payload: {
        loading: boolean
    }
}

export interface UpdateLessionDetail {
    type: typeof UPDATE_LESSON_DETAIL,
    payload: {
        lessonDetail: LessonDetail
    }
}


export type LessonDetailTypes = GetLessonDetail | LoadingLessionDetail | UpdateLessionDetail



