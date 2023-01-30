import { GET_TEACHERS, TEACHER_LOADING, TeacherPayload, TeacherType, CONFIRM_TEACHER } from '../types/teacherTypes'

const sidebarReducer = (state: TeacherPayload = {}, action: TeacherType): TeacherPayload => {
    switch (action.type) {
        case GET_TEACHERS:
            return {
                ...state,
                teachers: action.payload.teachers
            }
        case TEACHER_LOADING:
            return {
                ...state,
                loading: action.payload.loading
            }
        case CONFIRM_TEACHER: {
            return {
                ...state,
                teachers: state.teachers?.filter((teacher => {
                    return teacher._id !== action.payload.id
                }))
            }
        }
        default: return state;
    }
}

export default sidebarReducer