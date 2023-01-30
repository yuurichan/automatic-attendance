import React, { useEffect, useState } from 'react'
import { FormSubmit, InputChange, Lesson, LessonError, RootStore, Course } from '../../utils/interface'
import Loading from '../globals/loading/Loading';
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs';
import "./LessonFormModal.scss"
import { createLesson, updateLesson } from '../../store/actions/lessonActions'

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles'
import { modelStyleWidth800 } from '../../utils/model-style'
import PrimaryTooltip from '../globals/tool-tip/Tooltip';
import TimePicker from '@mui/lab/TimePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';

interface LessonFormModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onEdit?: Lesson | null
}

const useStyles = makeStyles({
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",

    },
    Select: {
        "width": "100%",
        "minHeight": "48px !important",
        "borderRadius": "6px !important",
        "padding": "0 16px !important",
        "border": "1px solid $border-color",
        "fontSize": "1.6rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        "& > div": {
            padding: "0px !important"
        }
    },
    MenuItem: {
        fontSize: "1.6rem !important"
    },
});

const LessonFormModal: React.FC<LessonFormModalProps> = ({ open, setOpen, onEdit }) => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const { auth, course: coursesStore, lessonDetail, detailRollCallSession } = useSelector((state: RootStore) => state);

    const initialLessonError: LessonError = {
        errorCourse: "",
        errorTimeEnd: "",
        errorTimeStart: "",
        errorTime: ""
    }

    const initialLesson: Lesson = {
        timeStart: new Date().toISOString(),
        timeEnd: new Date().toISOString(),
        desc: "",
        course: {},
        weekday: "Thứ 2"

    }


    const [lesson, setLesson] = useState<Lesson>(initialLesson);
    const [lessonError, setLessonError] = useState<LessonError>(initialLessonError);
    const { timeStart, timeEnd, course, desc, weekday } = lesson;
    const [loading, setLoading] = useState<boolean>(false);
    const [userCourse, setUserCourse] = useState<Course[]>([]);


    const handleCloseModal = () => {
        setOpen(false);
        if (onEdit) {
            setLesson(onEdit)
        } else {
            setLesson(initialLesson)
        }
    }

    // Use Effect
    // When open is true, set lesson to onEdit
    useEffect(() => {
        if (onEdit) {
            setLesson(onEdit);
        } else {
            setLesson(initialLesson)
        }
    }, [onEdit])


    useEffect(() => {
        if (coursesStore.courses) {
            let userCourse: Course[] = [];
            if (auth.user?.role !== 'admin') {
                userCourse = coursesStore.courses.filter((course: Course) => {
                    if (course.teacher && auth.user) {
                        return course.teacher._id === auth.user._id
                    }
                });
                setUserCourse(userCourse)
            } else {
                setUserCourse(coursesStore.courses)
            }

        }
        return () => {
            setUserCourse([])
        }
    }, [coursesStore.courses, auth.user])

    // Form
    const handleChange = (e: InputChange | SelectChangeEvent) => {
        setLesson({ ...lesson, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault();

        if (timeEnd && timeStart) {
            if (new Date(timeEnd) < new Date(timeStart)) {
                setLessonError({ ...lessonError, errorTimeEnd: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu" })
                return;
            }
        }
        if (lesson.course)
            if (Object.keys(lesson.course).length === 0) {
                setLessonError({ ...lessonError, errorCourse: "Bạn chưa chọn khóa học" })
                return;
            }

        const isEmpty = Object.values(lessonError).every(x => (x === null || x === ''));


        if (isEmpty) {
            setLoading(true);
            if (onEdit) {
                // Cap nhat
                await dispatch(updateLesson(lesson, auth, lessonDetail, detailRollCallSession));
                setLoading(false);
                handleCloseModal();
            } else {
                // Them moi
                await dispatch(createLesson(lesson, auth))
                setLoading(false);
                handleCloseModal();
            }
        }

    }

    // Form time
    const handleChangeTimeStart = (newValue: Date | null) => {
        try {
            setLesson({ ...lesson, timeStart: newValue?.toISOString() })
            setLessonError({ ...lessonError, errorTimeStart: "" })
        } catch (error) {
            setLessonError({ ...lessonError, errorTimeStart: "Thời gian bắt đầu không hợp lệ hh:mm (a|p)m" })
        }
    }

    const handleChangeTimeEnd = (newValue: Date | null) => {
        try {
            setLessonError({ ...lessonError, errorTimeEnd: "" })
            setLesson({ ...lesson, timeEnd: newValue?.toISOString() })
            if (newValue && timeStart) {
                if (newValue <= new Date(timeStart)) {
                    setLessonError({ ...lessonError, errorTimeEnd: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu" })
                }
            }
        } catch (error) {
            setLessonError({ ...lessonError, errorTimeEnd: "Thời gian kết thúc không hợp lệ hh:mm (a|p)m" })
        }
    }

    const handleAddCourse = (course: Course) => {
        setLesson({ ...lesson, course })
        setLessonError({ ...lessonError, errorCourse: "" })
    }

    const activeCourse = (course: Course) => {
        if (typeof lesson.course === "object") {
            if (lesson.course._id === course._id) {
                return "active"
            }
            return ""
        }
    }

    return <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modelStyleWidth800}>
            <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                <h2 className="modal__heading">Tạo buổi học</h2>
                <Box>
                    <PrimaryTooltip title='Đóng hộp thoại'>
                        <IconButton size="medium" onClick={handleCloseModal}>
                            <i className='bx bx-x' style={{ color: "#473fce", fontSize: "2.6rem" }}></i>
                        </IconButton>
                    </PrimaryTooltip>
                </Box>
            </Box>
            <form className="lesson__form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseCode">Thời gian bắt đầu</label>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <TimePicker
                            // label="Thời gian"
                            value={timeStart}
                            onChange={handleChangeTimeStart}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    {
                        lessonError?.errorTimeStart && <small className="text-error">{lessonError?.errorTimeStart}</small>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="courseCode">Thời gian kết thúc</label>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <TimePicker
                            // label="Thời gian"
                            value={timeEnd}
                            onChange={handleChangeTimeEnd}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    {
                        lessonError?.errorTimeEnd && <small className="text-error">{lessonError?.errorTimeEnd}</small>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="name">Chọn môn học *
                        {
                            onEdit && (<span style={{ color: "crimson", marginLeft: "5px" }}>Không thể chọn môn học</span>)
                        }
                    </label>
                    {
                        coursesStore.loading && <div>
                            <CircularProgress />
                            đang tải môn học...
                        </div>
                    }
                    {
                        onEdit ? <></> :
                            (coursesStore.courses && coursesStore.loading === false && userCourse.length === 0)
                                ? <p className="loading-text">Bạn chưa có môn học nào!</p>
                                : <div className='form-group__course'>
                                    <div className='form-group__course-row' >
                                        {
                                            userCourse.map((course: Course) => {
                                                return <div onClick={() => handleAddCourse(course)} className={`row__item ${activeCourse(course)}`} key={course._id}>
                                                    <div className="row__item-student">
                                                        {course.students?.length}
                                                    </div>
                                                    <div className="row__item-course">
                                                        <h2 className="course__name">
                                                            {course.name}
                                                        </h2>
                                                        <p className="course__code">
                                                            {course.courseCode}
                                                        </p>
                                                        <span className="course__createAt">Ngày tạo: {dayjs(course.yearStart).format("DD - MM - YYYY")}</span>
                                                    </div>
                                                    <div className="row__item-use">
                                                        <CheckCircleOutlineIcon style={{ color: "#fff", marginTop: "-4px" }} />
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                    }
                    {
                        lessonError?.errorCourse && <small className="text-error">{lessonError?.errorCourse}</small>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="name">Thứ *</label>
                    <Select
                        name='weekday'
                        className={classes.Select}
                        value={weekday}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value={"Thứ 2"} className={classes.MenuItem}>Thứ 2</MenuItem>
                        <MenuItem value={"Thứ 3"} className={classes.MenuItem}>Thứ 3</MenuItem>
                        <MenuItem value={"Thứ 4"} className={classes.MenuItem}>Thứ 4</MenuItem>
                        <MenuItem value={"Thứ 5"} className={classes.MenuItem}>Thứ 5</MenuItem>
                        <MenuItem value={"Thứ 6"} className={classes.MenuItem}>Thứ 6</MenuItem>
                        <MenuItem value={"Thứ 7"} className={classes.MenuItem}>Thứ 7</MenuItem>
                        <MenuItem value={"Chủ nhật"} className={classes.MenuItem}>Chủ nhật</MenuItem>
                    </Select>
                </div>
                <div className='form-group'>
                    <label htmlFor="desc">Mô tả buổi học</label>
                    <textarea id="desc" name="desc" rows={3} cols={10} onChange={handleChange} value={desc}>   </textarea>
                </div>
                <div className='modal__control'>
                    <div>
                        {
                            !onEdit && <Box mr={1}>
                                <PrimaryTooltip title='Làm mới'>
                                    <Button variant='contained' onClick={() => setLesson(initialLesson)} color='success' className={classes.Button}><p style={{ textTransform: "capitalize" }}>Làm mới</p></Button>
                                </PrimaryTooltip>
                            </Box>
                        }
                    </div>
                    <Box display="flex">
                        <Box>
                            <PrimaryTooltip title="Tạo khoá học">
                                <Button type="submit" variant='contained' className={classes.Button}>
                                    {loading ? <><Loading type='small' /> <p style={{ textTransform: "initial", marginLeft: "10px" }}>{onEdit ? "Đang cập nhật..." : "Đang tạo..."}</p></> :
                                        <p style={{ textTransform: "capitalize" }}>{onEdit ? "Cập nhật" : "Tạo buổi học"}</p>}</Button>
                            </PrimaryTooltip>
                        </Box>
                    </Box>
                </div>
            </form>
        </Box>
    </Modal >
}

export default LessonFormModal