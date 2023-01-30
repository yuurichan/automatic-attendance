import { Lesson } from '../../utils/interface'
import { AuthPayload } from './authTypes'
export const CREATE_LESSON = 'CREATE_LESSON'
export const GET_LESSONS = 'GET_LESSONS'
export const LOADING_LESSON = 'LOADING_LESSON'
export const UPDATE_LESSON = 'UPDATE_LESSON'
export const DELETE_LESSON = 'DELETE_LESSON'
export const TOGGLE_MY_LESSON = 'TOGGLE_MY_LESSON'
export const SEARCH_LESSON = 'SEARCH_LESSON'

export interface LessonPayload {
    lessons?: Lesson[],
    loading?: boolean,
    myLesson?: {
        list: Lesson[],
        toggle: string
    }
    searching: {
        lessonSearch?: Lesson[],
        onSearch?: boolean,
        search?: string
    }
}

export interface CreateLesson {
    type: typeof CREATE_LESSON,
    payload: {
        newLesson: Lesson
    }
}

export interface GetLessons {
    type: typeof GET_LESSONS,
    payload: {
        lessons: Lesson[]
    }
}

export interface LoadingLesson {
    type: typeof LOADING_LESSON,
    payload: boolean
}

export interface UpdateLesson {
    type: typeof UPDATE_LESSON,
    payload: {
        newLesson: Lesson
    }
}

export interface DeleteLesson {
    type: typeof DELETE_LESSON,
    payload: {
        lesson_id: string
    }
}

export interface SearchLesson {
    type: typeof SEARCH_LESSON,
    payload: {
        search: string
    }
}

export interface ToggleMyLesson {
    type: typeof TOGGLE_MY_LESSON,
    payload: {
        toggle: string,
        auth: AuthPayload
    }
}


export type LessonTypes =
    CreateLesson | GetLessons | LoadingLesson
    | UpdateLesson | DeleteLesson | ToggleMyLesson
    | SearchLesson