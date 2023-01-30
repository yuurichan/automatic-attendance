import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Course, Params, RootStore } from "../../utils/interface"
import { useParams, useHistory } from 'react-router-dom'
import CourseCard from '../../components/course/CourseCard'
import { getAPI } from '../../utils/fetchApi'
import { ALERT } from '../../store/types/alertTypes'
import { deleteCourse, getDetailCourse } from '../../store/actions/courseActions'
import "./Course.scss"
import CourseFormModal from '../../components/course/CourseFormModal'
import Loading from '../../components/globals/loading/Loading'

// MUI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material'
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

const useStyles = makeStyles({
    Button: {
        fontSize: "1rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "4px !important",

    },
})

const CourseDetal = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const { slug }: Params = useParams()
    const { auth, profile, detailCourse } = useSelector((state: RootStore) => state)
    const [course, setCourse] = useState<Course>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [onEdit, setOnEdit] = useState<Course | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [loadingDeleteCourse, setLoadingDeleteCourse] = useState<boolean>(false)

    useEffect(() => {

        const getCourseDetail = async () => {
            setLoading(true)
            await dispatch(getDetailCourse(detailCourse, slug, auth))
            setLoading(false)
        }

        getCourseDetail()
        
        detailCourse.courses.forEach(course => {
            if (course._id === slug) {
                setCourse(course)
            }
        })

        // Unmounted
        return () => {
            setCourse({})
            setOnEdit(null)
            setOpen(false)
        }
    }, [slug, detailCourse, auth, dispatch])

    const handleClickOpen = (course: Course | null) => {
        setOnEdit(course)
        setOpen(true);
    };

    const hanldeDeleteCourse = async (id: string) => {
        setLoadingDeleteCourse(true);
        await dispatch(deleteCourse(id, auth, profile))
        setLoadingDeleteCourse(false);
        return history.push('/')
    }

    if (!auth.user || !auth.access_token) return "";

    return (
        <div className='course-detail'>
            <div className="dashbroad__body dashbroad__body--xl">
                <div className="course-detail__body">
                    <div className="body__control">
                        <h2>
                            Chi tiết môn học
                        </h2>
                        {
                            course.teacher && course.teacher._id === auth.user._id && <div style={{ display: "flex" }}>
                                <div className="course__control-remove" style={{ marginRight: "10px" }}>
                                    <PrimaryTooltip title="Xoá môn học">
                                        <Button variant='contained' color="error" onClick={() => setOpenDialog(true)}>
                                            <DeleteIcon style={{ marginRight: "5px" }} /> <span className="mui-text-btn">Xoá</span>
                                        </Button>
                                    </PrimaryTooltip>
                                </div>
                                <div className="course__control-add">
                                    <PrimaryTooltip title="Chỉnh sửa môn học">
                                        <Button variant='contained' onClick={() => handleClickOpen(course)}>
                                            <EditIcon style={{ marginRight: "5px" }} /> <span className="mui-text-btn">Chỉnh sửa</span>
                                        </Button>
                                    </PrimaryTooltip>
                                </div>
                            </div>
                        }
                    </div>
                    <CourseFormModal open={open} hanldeSetOpen={setOpen} onEdit={onEdit} setOnEdit={setOnEdit} />
                    {/* Dialog confirm delete course */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <h3 className='modal__heading' style={{ margin: "16px" }}>
                            Bạn có chắc muốn xoá môn học này!
                        </h3>
                        <DialogActions>
                            <Button variant='contained' onClick={() => setOpenDialog(false)} color='error'>
                                <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                    Huỷ xoá
                                </p>
                            </Button>
                            <Button variant='contained' onClick={() => hanldeDeleteCourse(course._id as string)} className={classes.Button}>
                                {loadingDeleteCourse ? <Loading type='small' /> :
                                    <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                        Đồng ý
                                    </p>}

                            </Button>
                        </DialogActions>
                    </Dialog>
                    <div className='course-detail__container'>
                        <CourseCard course={course} auth={auth} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetal

