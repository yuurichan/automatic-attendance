import * as types from "../types/detailCourseTypes"
import { DetailCoursePayload, DetailCourseType } from "../types/detailCourseTypes"

const initialState: DetailCoursePayload = {
    courses: []
}

const detailCourseReducer = (state = initialState, action: DetailCourseType): DetailCoursePayload => {
    switch (action.type) {
        case types.GET_DETAIL_COURSE: return { ...state, courses: [...state.courses, action.payload.course] }
        case types.UPDATE_DETAIL_COURSE: {
            return {
                ...state,
                courses: state.courses.map(course => {
                    return course._id === action.payload.course._id ? action.payload.course : course
                })
            }
        }
        default:
            return { ...state }
    }
}

export default detailCourseReducer