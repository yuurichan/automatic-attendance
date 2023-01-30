import { Course, SortingCourse, SearchingCourse } from '../../utils/interface'
import nonAccentVietnamese from '../../utils/non-vietnamese'
import {
    GET_COURSES,
    CoursePayload,
    CourseType,
    LOADING_COURSE,
    CREATE_COURSE,
    CHANGE_PAGE,
    DELETE_COURSE,
    SORT_BY_DATE,
    SORT_BY_COURSE_NAME,
    SEARCH_BY_COURSE_NAME,
    SEARCH_BY_COURSE_CODE,
    SEARCH_BY_COURSE_TEACHER,
    UPDATE_COURSE,
} from '../types/courseTypes'

const initialState: CoursePayload = {
    courses: [],
    coursesSearch: [],
    coursesLength: 0,
    loading: false,
    page: 1,
    result: [],
    limit: 5,
    sorting: {
        onSort: "course_date",
        sortBy: 'date',
        sort: 'desc'
    },
    searching: {
        searchByCourseName: "",
        searchByCourseCode: "",
        searchByCourseTeacher: "",
        onSearch: false,
    }
}

const sortBy = (sortting: SortingCourse, array: Course[]) => {
    return array.sort((a, b) => {
        if (sortting.sortBy === "name") {
            if (a.name && b.name) {
                if (nonAccentVietnamese(a.name?.toLocaleLowerCase()) < nonAccentVietnamese(b.name?.toLocaleLowerCase()))
                    return sortting.sort === "asc" ? -1 : 1
                else if (nonAccentVietnamese(a.name?.toLocaleLowerCase()) > nonAccentVietnamese(b.name?.toLocaleLowerCase())) {
                    return sortting.sort === "asc" ? 1 : -1
                }
            }
        }

        if (sortting.sortBy === "date") {
            if (a.createdAt && b.createdAt) {
                if (a.createdAt < b.createdAt)
                    return sortting.sort === "asc" ? -1 : 1
                else if (a.createdAt > b.createdAt) {
                    return sortting.sort === "asc" ? 1 : -1
                }
            }
        }

        return 0;
    })
}

const arraySlice = (page: number, limit: number, array: Course[]) => {
    return array.slice((page - 1) * limit, page * limit)
}

const arrayFilter = (id: string, array: Course[]): Course[] => {
    const newArray: Course[] = array.filter(course => {
        return course._id !== id
    })
    return newArray
}

export const arraySearch = (searching: SearchingCourse, array: Course[]): Course[] => {
    const newArray: Course[] = array.filter(course => {
        if (searching.searchByCourseName !== "" && typeof searching.searchByCourseName === "string") {
            if (nonAccentVietnamese(course.name?.toLocaleLowerCase() as string).includes(nonAccentVietnamese(searching.searchByCourseName.toLocaleLowerCase()))) {
                return course
            }
        } else {
            return course
        }
    }).filter(course => {
        if (searching.searchByCourseCode !== "" && typeof searching.searchByCourseCode === "string") {
            if (nonAccentVietnamese(course.courseCode?.toLocaleLowerCase() as string).includes(nonAccentVietnamese(searching.searchByCourseCode.toLocaleLowerCase()))) {
                return course
            }
        } else {
            return course
        }
    }).filter(course => {
        if (searching.searchByCourseTeacher !== "" && course.teacher?.name && typeof searching.searchByCourseTeacher === "string") {
            if (nonAccentVietnamese(course.teacher?.name.toLocaleLowerCase() as string).includes(nonAccentVietnamese(searching.searchByCourseTeacher.toLocaleLowerCase()))) {
                return course
            }
        } else {
            return course
        }
    })

    return newArray
}

const arrayUpdate = (course: Course, array: Course[]): Course[] => {
    const newArray: Course[] = array.map(item => {
        if (item._id === course._id) {
            return course
        }
        return item
    })
    return newArray
}

const courseReducer = (state: CoursePayload = initialState, action: CourseType): CoursePayload => {
    switch (action.type) {
        case GET_COURSES: {
            return {
                ...state,
                courses: action.payload.courses,
                coursesLength: action.payload.courses?.length,
                result: arraySlice(state.page as number, state.limit as number, action.payload.courses as Course[]),
            }
        }
        case LOADING_COURSE: {
            return {
                ...state,
                loading: action.payload.loading
            }
        }
        case CREATE_COURSE: {

            // Kiem tra co dang search khong
            const courses = state.searching && state.searching.onSearch ?
                state.coursesSearch as Course[] :
                state.courses as Course[]

            return {
                ...state,
                courses: state.courses ?
                    sortBy(state.sorting as SortingCourse,
                        [{ ...action.payload.course }, ...state.courses]) : [{ ...action.payload.course }],
                coursesLength: state.coursesLength ? state.coursesLength + 1 : 1,
                result: !state.courses ?
                    [{ ...action.payload.course }] :
                    arraySlice(state.page as number, state.limit as number, sortBy(state?.sorting as SortingCourse,
                        [{ ...action.payload.course }, ...courses])),
                coursesSearch: [{ ...action.payload.course }, ...courses]
            }
        }
        case CHANGE_PAGE: {
            return {
                ...state,
                page: action.payload.page,
                result: arraySlice(action.payload.page as number, state.limit as number, state.searching && state.searching.onSearch ? state.coursesSearch as Course[] : state.courses as Course[])
            }
        }
        case DELETE_COURSE: {
            return {
                ...state,
                coursesLength: state.coursesLength && state.coursesLength - 1,
                courses: state.courses?.filter(course => {
                    return course._id !== action.payload.course_id
                }),
                result: arraySlice(state.page as number, state.limit as number, arrayFilter(action.payload.course_id, state?.courses as Course[]))
            }
        }
        case SORT_BY_COURSE_NAME: {
            const sorting: SortingCourse = {
                onSort: 'course_name',
                sortBy: 'name',
                sort: action.payload.sort
            }
            return {
                ...state,
                sorting,
                courses: sortBy(sorting, state?.courses as Course[]),
                result: arraySlice(state.page as number, state.limit as number,
                    sortBy(sorting,
                        state.searching && state.searching.onSearch ?
                            state.coursesSearch as Course[] :
                            state.courses as Course[]))
            }
        }
        case SORT_BY_DATE: {
            const sorting: SortingCourse = {
                onSort: 'course_date',
                sortBy: 'date',
                sort: action.payload.sort
            }
            return {
                ...state,
                sorting,
                courses: sortBy(sorting as SortingCourse, state?.courses as Course[]),
                result: arraySlice(state.page as number, state.limit as number,
                    sortBy(sorting, state.searching && state.searching.onSearch ?
                        state.coursesSearch as Course[] :
                        state.courses as Course[]))
            }
        }
        case SEARCH_BY_COURSE_NAME: {
            if (state.searching) {
                const searching: SearchingCourse = {
                    ...state.searching,
                    onSearch: false
                }

                if (action.payload.courseName === "" &&
                    state.searching.searchByCourseCode === ""
                    && state.searching.searchByCourseTeacher === "") {
                    return {
                        ...state,
                        searching,
                        coursesLength: state.courses?.length,
                        coursesSearch: [],
                        result: arraySlice(state.page as number, state.limit as number, state.courses as Course[]),
                    }
                }
            }
            const searching: SearchingCourse = {
                ...state.searching,
                onSearch: true,
                searchByCourseName: action.payload.courseName,
            }
            const newCourse = arraySearch(searching, state?.courses as Course[])
            let coursesLength;

            if (searching.onSearch === true) {
                coursesLength = newCourse.length;
            }
            return {
                ...state,
                searching,
                coursesLength,
                coursesSearch: newCourse,
                page: initialState?.page as number,
                result: arraySlice(initialState?.page as number, state.limit as number, newCourse as Course[])
            }
        }
        case SEARCH_BY_COURSE_CODE: {

            if (state.searching) {
                const searching: SearchingCourse = {
                    ...state.searching,
                    onSearch: false
                }

                if (action.payload.courseCode === "" &&
                    state.searching.searchByCourseCode === ""
                    && state.searching.searchByCourseTeacher === "") {
                    return {
                        ...state,
                        searching,
                        coursesLength: state.courses?.length,
                        coursesSearch: [],
                        result: arraySlice(state.page as number, state.limit as number, state.courses as Course[]),
                    }
                }
            }
            const searching: SearchingCourse = {
                ...state.searching,
                onSearch: true,
                searchByCourseCode: action.payload.courseCode,
            }

            const newCourse = arraySearch(searching, state?.courses as Course[])
            let coursesLength;

            if (searching.onSearch === true) {
                coursesLength = newCourse.length;
            }
            return {
                ...state,
                searching,
                coursesLength,
                coursesSearch: newCourse,
                page: initialState?.page as number,
                result: arraySlice(initialState?.page as number, state.limit as number, newCourse as Course[])
            }
        }
        case SEARCH_BY_COURSE_TEACHER: {

            if (state.searching) {
                const searching: SearchingCourse = {
                    ...state.searching,
                    onSearch: false
                }

                if (action.payload.courseTeacher === "" &&
                    state.searching.searchByCourseCode === ""
                    && state.searching.searchByCourseName === "") {
                    return {
                        ...state,
                        searching,
                        coursesLength: state.courses?.length,
                        coursesSearch: [],
                        result: arraySlice(state.page as number, state.limit as number, state.courses as Course[]),
                    }
                }
            }

            const searching: SearchingCourse = {
                ...state.searching,
                onSearch: true,
                searchByCourseTeacher: action.payload.courseTeacher,
            }

            const newCourse = arraySearch(searching, state?.courses as Course[])
            let coursesLength;

            if (searching.onSearch === true) {
                coursesLength = newCourse.length;
            }
            return {
                ...state,
                searching,
                coursesLength,
                coursesSearch: newCourse,
                page: initialState?.page as number,
                result: arraySlice(initialState?.page as number, state.limit as number, newCourse as Course[])
            }
        }
        case UPDATE_COURSE: {

            const newCourse = arrayUpdate(action.payload.course, state.courses as Course[]);

            // Kiem tra co dang search khong
            const courses = state.searching && state.searching.onSearch ?
                arrayUpdate(action.payload.course, state.coursesSearch as Course[]) :
                newCourse as Course[]
            return {
                ...state,
                courses: state.courses && sortBy(state.sorting as SortingCourse, newCourse),
                result: arraySlice(state.page as number, state.limit as number, sortBy(state?.sorting as SortingCourse, courses)),
                coursesSearch: [...courses]
            }
        }

        default: return state;
    }
}

export default courseReducer