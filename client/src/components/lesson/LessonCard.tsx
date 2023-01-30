import React, { useState } from 'react'
import { FormSubmit, InputChange, Lesson, RootStore } from '../../utils/interface'
import "./LessonCard.scss"
import MenuListLesson from './MenuListLesson'
import dayjs from 'dayjs'
import { AuthPayload } from '../../store/types/authTypes'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'


// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { modelStyle } from '../../utils/model-style'
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { createRollCallSession } from '../../store/actions/rollCallSession'
import Loading from '../globals/loading/Loading'

interface LessonCardProps {
  auth: AuthPayload
  addStudentClass: (student: number) => string,
  lesson: Lesson
}

const useStyles = makeStyles({
  Button: {
    fontSize: "1.3rem !important",
    fontWeight: "600 !important",
    height: "36px",
    padding: "10px !important",
  },
});


const LessonCard: React.FC<LessonCardProps> = ({ auth, lesson, addStudentClass }) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const { lessonDetail } = useSelector((state: RootStore) => state);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    const data = {
      lesson: lesson,
      comment,
    }
    setLoading(true);
    await dispatch(createRollCallSession(data, auth, history, lessonDetail, lesson))
    handleClose()
    setComment("")
    setLoading(false);

  }

  return (
    <div className='lesson-card'>
      <div className="lesson-card__heading">
        <span className={addStudentClass(lesson.course?.students?.length as number)}>
          {lesson.course?.students?.length} sinh viên
        </span>
        {
          (auth.user?.role === 'admin' || auth.user?._id === lesson.course?.teacher || auth.user?._id === lesson.course?.teacher?._id) &&
          <MenuListLesson auth={auth} lesson={lesson} />
        }
      </div>
      <div className="lesson-card__infor">
        <p className="lesson-card__infor-name">
          <span>({lesson.course?.courseCode})</span>
          {lesson.course?.name}
        </p>
        <span className="lesson-card__infor-credit">Tín chỉ: {lesson.course?.credit}</span>
        <span className="lesson-card__infor-semester">học kì: {lesson.course?.semester}</span>
      </div>
      <div className="lesson-card__indicator"></div>
      <div className="lesson-card__bottom">
        <div>
          <i className='bx bxs-calendar-week' ></i>
          <span>{lesson.weekday}</span>
        </div>
        <div>
          <i className='bx bxs-time'></i>
          <span>Thời gian bắt đầu: {dayjs(lesson.timeStart).format("hh:mm a")}</span>
        </div>
        <div>
          <i className='bx bxs-time-five'></i>
          <span>Thời gian kết thúc: {dayjs(lesson.timeEnd).format("hh:mm a")}</span>
        </div>
        <div>
          <i className='bx bxs-graduation'></i>
          {
            lesson.teacher && <span>{lesson.teacher?.name} ({lesson.teacher?.account})</span>
          }
        </div>
      </div>
      <div className="lesson-card__line">
      </div>
      <div className="lesson-card__button">
        <Link to={`/lesson/${lesson._id}`} className='btn-primary'>
          Chi tiết
        </Link>
        <button
          onClick={handleOpen}
          type='submit'
          disabled={(auth.user?.role === 'admin' || auth.user?._id === lesson.course?.teacher || auth.user?._id === lesson.course?.teacher?._id) ? false : true}
          className={`btn-primary 
          ${(auth.user?.role === 'admin' || auth.user?._id === lesson.course?.teacher || auth.user?._id === lesson.course?.teacher?._id) ?
              "" : "btn-primary--disable"}`}>
          Điểm danh <i style={{ marginTop: '-1px' }} className='bx bx-right-arrow-alt'>
          </i>
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="lesson-card__modal"
      >
        <Box sx={modelStyle}>
          <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
            <h2 className="modal__heading">Điểm danh sinh viên</h2>
            <Box>
              <PrimaryTooltip title='Đóng hộp thoại'>
                <IconButton size="medium" onClick={handleClose}>
                  <i className='bx bx-x' style={{ color: "#473fce", fontSize: "2.6rem" }}></i>
                </IconButton>
              </PrimaryTooltip>
            </Box>
          </Box>
          <form onSubmit={handleSubmit} className="rollcalsession__form">
            <Box>
              <label htmlFor="comment">Mô tả buổi điểm danh </label>
              <textarea rows={4} cols={3}
                id="comment"
                name="comment"
                value={comment}
                onChange={(e: InputChange) => setComment(e.target.value)}>
              </textarea>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mr={1}>
                <PrimaryTooltip title='Làm mới'>
                  <Button onClick={handleClose} variant='contained' color='success' className={classes.Button}><p style={{ textTransform: "capitalize" }}>Đóng</p></Button>
                </PrimaryTooltip>
              </Box>
              <PrimaryTooltip title="Tạo khoá học">
                <Button type="submit" variant='contained' className={classes.Button}>
                  {
                    loading ? <>
                      <Loading type='small' />
                      <p style={{ textTransform: "capitalize", marginLeft: "5px" }}>
                        Đang tạo buổi điểm danh <i style={{ fontSize: '2rem', marginLeft: '5px' }} className='bx bx-right-arrow-alt'></i>
                      </p>
                    </> : <p style={{ textTransform: "capitalize", display: 'flex', alignItems: "center" }}>
                      Bắt đầu điểm danh <i style={{ fontSize: '2rem', marginLeft: '5px' }} className='bx bx-right-arrow-alt'></i>
                    </p>
                  }
                </Button>
              </PrimaryTooltip>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default LessonCard