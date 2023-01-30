import { User, Course, SearchingCourse } from '../../utils/interface'
export const GET_USER_COURSE = 'GET_USER_COURSE'
export const LOADING_USER_COURSE = 'LOADING_USER_COURSE'
export const UPDATE_USER_COURSE = 'UPDATE_USER_COURSE'
export const EDIT_USER_COURSE = 'EDIT_USER_COURSE'
export const DELETE_USER_COURSE = 'DELETE_USER_COURSE'
export const CREATE_USER_COURSE = 'CREATE_USER_COURSE'
export const SEARCH_BY_USER_COURSE_NAME = "SEARCH_BY_USER_COURSE_NAME"
export const SEARCH_BY_USER_COURSE_CODE = "SEARCH_BY_USER_COURSE_CODE"

export interface ProfilePayload {
    userInfor?: User
    userCourse?: Course[]
    userCourseSearch?: Course[]
    totalCourse?: number
    page?: number
    limit?: 4,
    loading?: boolean
    result?: number
    stopLoadMore?: boolean,
    searching?: SearchingCourse
}

export interface GetUserCourse {
    type: typeof GET_USER_COURSE
    payload: {
        courses: Course[]
        result: number
        total: number
    }
}

export interface LoadingUserCourse {
    type: typeof LOADING_USER_COURSE
    payload: {
        loading: boolean
    }
}

export interface UpdateUserCourse {
    type: typeof UPDATE_USER_COURSE,
    payload: {
        newCourse: Course[]
        result: number
        page: number
        stopLoadMore: boolean
    }
}

export interface EditUserCourse {
    type: typeof EDIT_USER_COURSE,
    payload: {
        course: Course
    }
}

export interface DeleteUserCourse {
    type: typeof DELETE_USER_COURSE,
    payload: {
        courses: Course[]
        result: number
        total: number
    }
}

export interface CreateUserCourse {
    type: typeof CREATE_USER_COURSE,
    payload: {
        courses: Course[]
        result: number
        total: number
    }
}

export interface SearchByCourseName {
    type: typeof SEARCH_BY_USER_COURSE_NAME,
    payload: {
        search: string
    }
}

export interface SearchByCourseCode {
    type: typeof SEARCH_BY_USER_COURSE_CODE,
    payload: {
        search: string
    }
}

export type ProfileType =
    GetUserCourse | LoadingUserCourse | UpdateUserCourse |
    EditUserCourse | DeleteUserCourse | CreateUserCourse |
    SearchByCourseName | SearchByCourseCode