import * as types from '../types/lessontypes'
import { LessonPayload, LessonTypes } from '../types/lessontypes'
import { Lesson } from '../../utils/interface'
import nonAccentVietnamese from '../../utils/non-vietnamese'
const initialState: LessonPayload = {
    lessons: [],
    myLesson: { // Mon hoc trong ngay
        list: [],
        toggle: ""
    },
    searching: {
        lessonSearch: [],
        onSearch: false,
        search: ""
    }
}

const lessonReducer = (state: LessonPayload = initialState, action: LessonTypes): LessonPayload => {
    switch (action.type) {
        case types.GET_LESSONS:
            return {
                ...state,
                lessons: [...action.payload.lessons]
            }
        case types.CREATE_LESSON: {
            return {
                ...state,
                lessons: state.lessons ? [action.payload.newLesson, ...state.lessons] : [action.payload.newLesson],
                myLesson: {
                    toggle: state.myLesson?.toggle as string,
                    list: [action.payload.newLesson, ...state.lessons?.map((lesson) => {
                        return lesson.weekday === state.myLesson?.toggle
                    }) as Lesson[]]
                }
            }
        }
        case types.LOADING_LESSON: {
            return {
                ...state,
                loading: action.payload
            }
        }
        case types.UPDATE_LESSON: {
            return {
                ...state,
                lessons: state.lessons ?
                    state.lessons.map(lesson => lesson._id === action.payload.newLesson._id ?
                        action.payload.newLesson : lesson) : [],
                myLesson: {
                    toggle: state.myLesson?.toggle as string,
                    list: state.myLesson?.list ?
                        state.myLesson?.list.map(lesson => lesson._id === action.payload.newLesson._id ?
                            action.payload.newLesson : lesson) : [],
                }
            }
        }
        case types.DELETE_LESSON: {
            return {
                ...state,
                lessons: state.lessons ? state.lessons.filter(lesson => {
                    return lesson._id !== action.payload.lesson_id
                }) : [],
                myLesson: {
                    toggle: state.myLesson?.toggle as string,
                    list: state.myLesson?.list ? state.myLesson?.list.filter(lesson => {
                        return lesson._id !== action.payload.lesson_id
                    }) : [],
                }
            }
        }
        case types.TOGGLE_MY_LESSON: {

            console.log(action)

            return {
                ...state,
                myLesson: {
                    toggle: action.payload.toggle,
                    list: state.lessons?.filter(lesson => {
                        console.log(lesson.weekday)
                        return lesson.weekday === action.payload.toggle
                    }) as Lesson[]
                }
            }
        }
        case types.SEARCH_LESSON: {
            if (action.payload.search === '') {
                return {
                    ...state,
                    searching: {
                        ...state.searching,
                        onSearch: false,
                        lessonSearch: [],
                        search: action.payload.search
                    }
                }
            }

            let searching = {
                ...state.searching,
                onSearch: true,
                lessonSearch: state.myLesson?.toggle ? state.myLesson.list.filter((lesson) => {
                    if (typeof lesson.course !== 'undefined') {
                        return lesson.course.name && nonAccentVietnamese(lesson.course.name.toLowerCase()).includes(nonAccentVietnamese(action.payload.search.toLowerCase()))
                    }
                }) : state.lessons && state.lessons.filter(lesson => {

                    if (typeof lesson.course !== 'undefined') {
                        return lesson.course.name && nonAccentVietnamese(lesson.course.name.toLowerCase()).includes(nonAccentVietnamese(action.payload.search.toLowerCase()))
                    }
                }),
                search: action.payload.search
            }
            return {
                ...state,
                searching
            }
        }
        default:
            return { ...state }
    }
}

export default lessonReducer;