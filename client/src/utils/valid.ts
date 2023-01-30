import { UserRegister, UserLogin, UserProfile, Course, ErrorCourse, Student, ErrorStudent } from "../utils/interface"
export const validRegister = (userRegister: UserRegister | UserProfile) => {
    const errors: any = {};

    const { name, account, password, cfPassword } = userRegister;

    if (!name) {
        errors.errorName = "Tên là bắt buộc"
    } else {
        if (name.length > 50) {
            errors.errorName = "Tên của bạn giới hạn 50 ký tự"
        }
    }

    if (!account) {
        errors.errorAccount = 'Email là bắt buộc'
    } else if (!validEmail(account)) {
        errors.errorAccount = "Email định dạng không hợp lệ"
    }

    if (!password) {
        errors.errorPassword = 'Mật khẩu là bắt buộc'
    } else {
        if (password.trim().length < 6) {
            errors.errorPassword = "Mật khẩu phải có ít nhất 6 kí tự"
        }
    }

    if (!cfPassword) {
        errors.errorCfPassword = 'Yêu cầu nhập lại mật khẩu'
    }

    if (password !== cfPassword) {
        errors.errorPasswordMatch = "Mật khẩu không trùng khớp"
    }
    return errors;
}

export const validLogin = (userLogin: UserLogin) => {
    const errors: any = {};

    const { account, password } = userLogin

    if (!account) {
        errors.errorAccount = 'Email là bắt buộc'
    } else if (!validEmail(account)) {
        errors.errorAccount = "Email định dạng không hợp lệ"
    }

    if (!password) {
        errors.errorPassword = 'Mật khẩu là bắt buộc'
    }
    return errors;
}

export const validUpdatePassword = (userUpdate: UserProfile) => {

    const errors: any = {};

    const { password, cfPassword } = userUpdate
    if (password) {
        if (password.trim().length < 6) {
            errors.errorPassword = "Mật khẩu phải có ít nhất 6 kí tự"
        }
        if (!cfPassword) {
            errors.errorPassword = 'Nhập lại mật khẩu là bắt buộc'
        } else {
            if (password !== cfPassword) {
                errors.errorPasswordMatch = "Mật khẩu không trùng khớp"
            }
        }
    }
    return errors;
}

export const validEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validCreateCourse = (course: Course) => {
    const errors: ErrorCourse = {};

    if (course.name === '') {
        errors.errorName = "Tên môn học không được để trống"
    } else {
        if (typeof course.name !== "undefined" && course.name?.length < 5) {
            errors.errorName = "Tên khoá học có ít nhất 10 ký tự"
        } else {
            if (typeof course.name !== "undefined" && course.name?.length > 200) {
                errors.errorName = "Tên môn học dài nhất 200 ký tự"
            }
        }
    }

    if (course.courseCode === '') {
        errors.errorCourseCode = "Mã học phần không được để trống"
    }

    if (course.description && course.description?.length > 500) {
        errors.errorDescription = "Mô tả môn học dài nhất 500 ký tự"
    }
    return errors;
}


export const validUpdateStudent = (student: Student) => {
    const errors: ErrorStudent = {};

    if (student.name === '') {
        errors.errorName = "Tên sinh viên không được để trống"
    } else {
        if (typeof student.name !== "undefined" && student.name?.length < 5) {
            errors.errorName = "Tên sinh viên có ít nhất 10 ký tự"
        } else {
            if (typeof student.name !== "undefined" && student.name?.length > 50) {
                errors.errorName = "Tên sinh viên dài nhất 50 ký tự"
            }
        }
    }

    if (student.studentCode === '') {
        errors.errorStudentCode = "Mã số sinh viên không được để trống"
    } else {
        if (typeof student.studentCode !== "undefined" && student.studentCode?.length < 5) {
            errors.errorStudentCode = "Mã số sinh viên có ít nhất 10 ký tự"
        } else {
            if (typeof student.studentCode !== "undefined" && student.studentCode?.length > 10) {
                errors.errorStudentCode = "Mã số viên dài nhất 10 ký tự"
            }
        }
    }

    if (student.gender === '') {
        errors.errorGender = "Mã số sinh viên không được để trống"
    }

    return errors;

}