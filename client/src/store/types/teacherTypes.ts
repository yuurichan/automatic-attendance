import { User } from '../../utils/interface'
export const GET_TEACHERS = "GET_TEACHERS"
export const TEACHER_LOADING = "TEACHER_LOADING"
export const CONFIRM_TEACHER = "CONFIRM_TEACHER"

export interface TeacherPayload {
    loading?: boolean
    teachers?: User[]
}

export interface TeacherLoading {
    type: typeof TEACHER_LOADING,
    payload: {
        loading: boolean
    }
}

export interface GetTeacher {
    type: typeof GET_TEACHERS,
    payload: {
        teachers: User[]
    }
}

export interface ConfirmTeacher {
    type: typeof CONFIRM_TEACHER
    payload: {
        id: string
    }
}

export type TeacherType = GetTeacher | TeacherLoading | ConfirmTeacher

