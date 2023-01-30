import { Course, Student, SortingCourse, SearchingCourse } from '../../utils/interface'
export const GET_COURSES = "GET_COURSES"
export const LOADING_COURSE = "LOADING_COURSE"
export const CREATE_COURSE = "CREATE_COURSE"
export const CHANGE_PAGE = 'CHANGE_PAGE'
export const DELETE_COURSE = "DELETE_COURSE"
export const SEARCH_BY_COURSE_NAME = "SEARCH_BY_COURSE_NAME"
export const SEARCH_BY_COURSE_CODE = "SEARCH_BY_COURSE_CODE"
export const SEARCH_BY_COURSE_TEACHER = "SEARCH_BY_COURSE_TEACHER"
export const SORT_BY_DATE = "SORT_BY_DATE"
export const SORT_BY_COURSE_NAME = "SORT_BY_COURSE_NAME"
export const UPDATE_COURSE = "UPDATE_COURSE"
// Student
export const UPDATE_COURSE_STUDENT = "UPDATE_COURSE_STUDENT"

export interface CoursePayload {
    courses?: Course[]
    coursesSearch?: Course[]
    loading?: boolean
    page?: number
    coursesLength?: number | 0
    result?: Course[]
    limit?: number,
    sorting?: SortingCourse
    searching?: SearchingCourse

}

export interface GetCourses {
    type: typeof GET_COURSES,
    payload: CoursePayload
}

export interface LoadingCourses {
    type: typeof LOADING_COURSE,
    payload: CoursePayload
}

export interface CreateCourse {
    type: typeof CREATE_COURSE,
    payload: {
        course: Course
    }
}

export interface ChangePage {
    type: typeof CHANGE_PAGE
    payload: {
        page: number
    }
}

export interface DeleteCourse {
    type: typeof DELETE_COURSE
    payload: {
        course_id: string
    }
}

export interface SorseByDate {
    type: typeof SORT_BY_DATE,
    payload: {
        sort: "asc" | "desc"
    }
}

export interface SorseByCourseName {
    type: typeof SORT_BY_COURSE_NAME,
    payload: {
        sort: "asc" | "desc"
    }
}

export interface SearchByCourseName {
    type: typeof SEARCH_BY_COURSE_NAME,
    payload: {
        courseName: string
    }
}

export interface SearchByCourseCode {
    type: typeof SEARCH_BY_COURSE_CODE,
    payload: {
        courseCode: string
    }
}

export interface SearcgByCourseTeacher {
    type: typeof SEARCH_BY_COURSE_TEACHER,
    payload: {
        courseTeacher: string
    }
}

export interface UpdateCourse {
    type: typeof UPDATE_COURSE,
    payload: {
        course: Course
    }
}


export type CourseType =
    GetCourses | LoadingCourses | CreateCourse |
    ChangePage | DeleteCourse | SorseByDate |
    SorseByCourseName | SearchByCourseName |
    SearchByCourseCode | SearcgByCourseTeacher | UpdateCourse 