import { ProfilePayload, ProfileType, UPDATE_USER_COURSE } from '../types/profileTypes'
import * as types from '../types/profileTypes'
import { Course, SearchingCourse } from '../../utils/interface'
import { arraySearch } from './courseReducers'

const initalState: ProfilePayload = {
    userCourse: [],
    totalCourse: 0,
    page: 1,
    limit: 4,
    loading: false,
    result: 0,
    searching: {
        searchByCourseCode: "",
        searchByCourseName: "",
        onSearch: false
    },
    stopLoadMore: false
}

const profileReducer = (state: ProfilePayload = initalState, action: ProfileType): ProfilePayload => {
    switch (action.type) {

        // Lay cac mon hoc cua user
        case types.GET_USER_COURSE: {
            return {
                ...state,
                userCourse: [...action.payload.courses],
                result: action.payload.result,
                totalCourse: action.payload.total,
                stopLoadMore: action.payload.result === action.payload.total ? true : false
            }
        }

        case types.LOADING_USER_COURSE: {
            return {
                ...state,
                loading: action.payload.loading
            }
        }

        case types.UPDATE_USER_COURSE: {
            return {
                ...state,
                userCourse: [...action.payload.newCourse],
                page: action.payload.page,
                totalCourse: action.payload.newCourse.length,
                result: state.result && action.payload.result + state.result as number,
                stopLoadMore: action.payload.stopLoadMore
            }
        }

        case types.EDIT_USER_COURSE: {
            return {
                ...state,
                userCourse: state.userCourse && state.userCourse.map((course: Course) => {
                    return course._id === action.payload.course._id ? action.payload.course : course
                })
            }
        }

        case types.DELETE_USER_COURSE: {
            return {
                ...state,
                userCourse: [...action.payload.courses],
                result: action.payload.result,
                totalCourse: action.payload.total,
                stopLoadMore: action.payload.result === action.payload.total ? true : false
            }
        }

        case types.CREATE_USER_COURSE: {
            return {
                ...state,
                userCourse: [...action.payload.courses],
                result: action.payload.result,
                totalCourse: action.payload.total,
                stopLoadMore: action.payload.result === action.payload.total ? true : false
            }
        }

        case types.SEARCH_BY_USER_COURSE_NAME: {

            const { searchByCourseCode } = state.searching as SearchingCourse

            let searching: SearchingCourse = {
                ...state.searching,
                onSearch:
                    false
            }
            if (action.payload.search === "" && searchByCourseCode === "") {
                return {
                    ...state,
                    searching: {
                        ...searching,
                        searchByCourseName: "",
                        onSearch: false
                    },
                    userCourseSearch: [],
                }
            } else {
                searching = {
                    ...state.searching,
                    onSearch: true,
                }
                const newCourse = arraySearch(searching, state?.userCourse as Course[])

                return {
                    ...state,
                    searching,
                    userCourseSearch: newCourse,
                }
            }

        }

        case types.SEARCH_BY_USER_COURSE_CODE: {

            const { searchByCourseName } = state.searching as SearchingCourse

            let searching: SearchingCourse = {
                ...state.searching,
                onSearch: false
            }

            if (action.payload.search === "" && searchByCourseName === "") {
                return {
                    ...state,
                    searching: {
                        ...searching,
                        searchByCourseCode: "",
                        onSearch: false
                    },
                    userCourseSearch: [],
                }
            } else {

                searching = {
                    ...state.searching,
                    onSearch: true,
                    searchByCourseCode: action.payload.search,
                }
                const newCourse = arraySearch(searching, state?.userCourse as Course[])

                return {
                    ...state,
                    searching,
                    userCourseSearch: newCourse,
                }
            }
        }

        default:
            return state;
    }
}

export default profileReducer;