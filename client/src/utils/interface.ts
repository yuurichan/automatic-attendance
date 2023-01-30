import { ChangeEvent } from 'react'
import rootReducer from '../store/reducers/index'

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
export type FormSubmit = ChangeEvent<HTMLFormElement>

export type RootStore = ReturnType<typeof rootReducer>;

export interface Params {
    page: string
    slug: string
}

export interface UserLogin {
    account: string;
    password: string;
}
export interface UserRegister extends UserLogin {
    name?: string;
    cfPassword?: string
}

export interface User extends UserRegister {
    _id: string;
    avatar: string;
    role: string;
    confirm: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserAuthErrors {
    errorName?: string
    errorAccount: string
    errorPassword: string
    errorCfPassword?: string
    errorPasswordMatch?: string
}

export interface UserProfile {
    name?: string
    account?: string
    password?: string
    cfPassword?: string
    avatar?: string | Blob
}

export interface Course {
    courseCode?: string
    createdAt?: Date
    credit?: number
    name?: string
    semester?: string
    teacher?: User
    updatedAt?: Date
    yearEnd?: string
    yearStart?: string
    students?: any[]
    description?: string
    __v?: number
    _id?: string
}

export interface ErrorCourse {
    errorName?: string
    errorCourseCode?: string
    errorCredit?: string
    errorDescription?: string
}

export interface SortingCourse {
    onSort: 'course_name' | 'course_date',
    sortBy: "name" | "courseCode" | "credit" | "yearStart" | "yearEnd" | "semester" | "date",
    sort: "asc" | "desc"
}

export interface SearchingCourse {
    searchByCourseName?: string
    searchByCourseCode?: string
    searchByCourseTeacher?: string
    onSearch?: true | false
}

export interface Student {
    _id?: string
    name?: string
    studentCode?: string
    gender?: string
    phone?: string
    course?: string
}

export interface ErrorStudent {
    errorName?: string
    errorStudentCode?: string
    errorGender?: string
    errorPhone?: string
}

export interface Lesson {
    _id?: string
    course?: Course
    timeStart?: string
    timeEnd?: string
    desc?: string
    weekday?: string
    teacher?: User
    createdAt?: string
}



export interface LessonError {
    errorCourse?: string
    errorTimeStart?: string
    errorTimeEnd?: string
    errorTime?: string // start > end
}

export interface Attendance {
    _id?: string
    student?: Student
    note?: string
    date?: string,
    absent?: boolean
}

export interface RollCallSession {
    _id?: string
    course?: Course
    lesson?: Lesson
    comment?: string
    attendanceDetails?: Attendance[]
    teacher?: User
    end?: boolean
    createdAt?: string
}

export interface LessonDetail {
    lesson?: Lesson
    rollCallSessions?: RollCallSession[]
}

export interface StudentReport {
    absent: number
    isStudy: number
    student: Student
}