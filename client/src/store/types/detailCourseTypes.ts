import { Course } from '../../utils/interface'
export const GET_DETAIL_COURSE = 'GET_DETAIL_COURSE';
export const UPDATE_DETAIL_COURSE = 'UPDATE_DETAIL_COURSE';


export interface DetailCoursePayload {
    courses: Course[];
}

export interface GetDetailCourse {
    type: typeof GET_DETAIL_COURSE;
    payload: {
        course: Course;
    }
}

export interface UpdateDetailCourse {
    type: typeof UPDATE_DETAIL_COURSE;
    payload: {
        course: Course;
    }
}

export type DetailCourseType = GetDetailCourse | UpdateDetailCourse;

