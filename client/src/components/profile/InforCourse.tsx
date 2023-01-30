import React, { Dispatch, useEffect, useState } from 'react';
import "./InforCourse.scss"
import { RootStore, Course, InputChange } from '../../utils/interface'
import { useSelector } from 'react-redux'
import {
  getUserCourse,
  searchByCourseName as searchByCourseNameAction,
  searchByCourseCode as searchByCourseCodeAction
} from '../../store/actions/profileActions'
import { AuthPayload } from '../../store/types/authTypes';
import { UPDATE_USER_COURSE } from '../../store/types/profileTypes'
import CourseFormModal from '../course/CourseFormModal';
import { getAPI } from '../../utils/fetchApi'
// MUI
import { makeStyles } from '@mui/styles';
import LoadMoreButton from './LoadMoreButton';
import MenuList from './MenuList';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface InforCourseProps {
  auth: AuthPayload
  id: string
  dispatch: Dispatch<any>
}

const useStyle = makeStyles({
  Menu: {
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px - 1px rgb(0 0 0 / 0.1) !important",
  },
  MenuItem: {
    fontSize: "1.4rem !important",
    fontFamily: "Inter !important",
    fontWeight: "500 !important",
    color: "#1e293b",
    height: "40px !important",
    "&:hover": {
      backgroundColor: "#473fce !important",
      color: "#fff !important",
      "& svg": {
          fill: "#fff !important",
      }
  }
  },
  MenuItemDelete: {
    // color: "crimson !important"
  },
  MenuIcon: {
    color: "rgb(91, 100, 112) !important",
    marginRight: "5px !important",
  },
  MenuIconDelete: {
    color: "crimson"
  },
  Button: {
    fontSize: "1rem !important",
    fontWeight: "600 !important",
    height: "36px",
    padding: "4px !important",

  },
  ButtonAdd: {
    fontSize: "1.2rem !important",
    fontWeight: "600 !important",
    height: "36px",
    padding: "4px !important",
    "& i": {
      marginTop: "-2px",
      fontSize: "1.6rem"
    }
  }
})

const InforCourse: React.FC<InforCourseProps> = ({ auth, id, dispatch }) => {

  const classes = useStyle()
  const { profile } = useSelector((state: RootStore) => state)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [onEdit, setOnEdit] = useState<Course | null>({});
  const [searchByCourseName, setSearchByCourseName] = useState<string>("");
  const [searchByCourseCode, setSearchByCourseCode] = useState<string>("");

  useEffect(() => {
    if (auth.access_token && id) {
      dispatch(getUserCourse(auth.access_token, id))
    }
  }, [auth.access_token, dispatch, id])

  const handleEditCourse = (course: Course) => {
    setOpenForm(true);
    setOnEdit(course);
  }

  const handleSearchByCourseName = (e: InputChange) => {
    setSearchByCourseName(e.target.value)
    dispatch(searchByCourseNameAction(e.target.value as string))
  }

  const handleSearchByCourseCode = (e: InputChange) => {
    setSearchByCourseCode(e.target.value)
    dispatch(searchByCourseCodeAction(e.target.value as string))
  }

  const handleClickOpenFormAddCourse = (course: Course | null) => {
    setOnEdit(course)
    setOpenForm(true);
  };

  const renderCourse = (course: Course[]) => {
    return course.map((course, index) => {
      return <div className="profile__course-list-item" key={index}>
        <div className="item__heading">
          <h2 className='item__course-code'>
            {course.courseCode}
          </h2>
          <MenuList course={course} classes={classes} handleEditCourse={handleEditCourse} />
        </div>
        <div className='item__course-student'>
          <h3>
            {
              course.students ? course.students.length : 0
            }
          </h3>
          <span>
            học viên
          </span>
        </div>
        <h3 className="item__course-name">
          {
            course.name
          }
        </h3>
      </div>
    })
  }

  const handleLoadMore = async () => {
    if (auth.user && profile.limit && profile.userCourse && profile.page) {
      const res = await getAPI(`user_course/${auth.user._id}/?limit=${profile.limit}&page=${profile.page + 1}`, auth.access_token)
      const newUserCourse = {
        page: (res.data.result + profile.result) / profile.limit > profile.page ? profile.page + 1 : profile.page,
        newCourse: [...profile.userCourse, ...res.data.courses],
        result: res.data.result,
        stopLoadMore: res.data.result === 0 || res.data.result + profile.result === profile.totalCourse ? true : false
      }
      dispatch({ type: UPDATE_USER_COURSE, payload: { ...newUserCourse } })
    }
  }

  return <div className="profile__course ">
    <div className="profile__course-control">
      <div className="profile__course-control-search">
        <form>
          <div className="form-group">
            <input placeholder="Tìm kiếm theo tên môn học..." type="text" onChange={handleSearchByCourseName} value={searchByCourseName} />
            <i className='bx bx-search'></i>
          </div>
          <div className="form-group">
            <input placeholder="Tìm kiếm theo mã học phần..." type="text" onChange={handleSearchByCourseCode} value={searchByCourseCode} />
            <i className='bx bx-search'></i>
          </div>
        </form>
      </div>
      <div className="profile__course-control-add">
        <PrimaryTooltip title="Thêm môn học">
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button color="primary" className={classes.ButtonAdd} onClick={() => handleClickOpenFormAddCourse(null)}>
              <i className='bx bx-plus'></i>
              Thêm môn học
            </Button>
          </ButtonGroup>
        </PrimaryTooltip>
      </div>
    </div>

    {
      profile.loading === false && profile.result === 0 && <h2 style={{ padding: '10px 20px', fontSize: "1.4rem" }} className='loading-text'>
        Bạn chưa có khóa học nào !
      </h2>
    }
    {/* Form Course */}
    <CourseFormModal open={openForm} hanldeSetOpen={setOpenForm} setOnEdit={setOnEdit} onEdit={onEdit} />

    {
      profile.loading ? <Box display='flex' alignItems='center' paddingLeft="35px" >
        <CircularProgress size={30} /> <p className="loading-text" style={{ marginLeft: "5px" }}>Đang tải môn học...</p>
      </Box> :
        <div className="profile__course-list">
          {
            (profile.userCourse && profile.userCourseSearch && profile.searching) && profile.searching.onSearch === true ?
              renderCourse(profile.userCourseSearch) : renderCourse(profile.userCourse as Course[])
          }
        </div>
    }

    {/* Load more */}
    {
      !profile.loading && <LoadMoreButton onSearch={profile.searching ? profile.searching.onSearch as boolean : false} stopLoadMore={profile.stopLoadMore as boolean} result={profile.result ? profile.result : 0} total={profile.totalCourse ? profile.totalCourse : 0} handleLoadMore={handleLoadMore} />
    }
  </div>;
};

export default InforCourse;
