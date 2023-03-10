import React, { useState, useEffect } from 'react'
import "./CourseBody.scss"
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InputChange, RootStore, Course } from '../../utils/interface'
import dayjs from 'dayjs'
import PaginationComponent from '../globals/pagination/Pagination'
import { getCourses ,changePageCourse, deleteCourse, sortByCourseName, sortByDate, searchByCourseName, searchByCourseCode, searchByCourseTeacher } from '../../store/actions/courseActions'
import Loading from '../globals/loading/Loading'
// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import CourseFormModal from './CourseFormModal'
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { CoursePayload } from '../../store/types/courseTypes'
import { get } from 'http'

const useStyles = makeStyles({
    TableContainer: {
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important"
    },
    TableCellHead: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "600 !important"
    },
    TableCellBody: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "500 !important",
    },

    TableCellBodyId: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "500 !important",
        "maxWidth": "150px",
        "WebkitLineClamp": "1",
        "WebkitBoxOrient": "vertical",
        "overflow": "hidden",
        "textOverflow": "ellipsis",
    },
    Button: {
        fontSize: "1rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "4px !important",
    },
    ButtonInfor: {
        padding: "0px !important",
        "& > a": {
            display: 'flex',
            alignItems: "center",
            justifyContent: "center"
        }
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
    },
    Tooltip: {
        fontSize: "2rem !important",
    },
    Pagination: {
        "& button": { fontSize: "1.3rem" }
    }
});

const CourseBody = () => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const { course: courses, auth, profile } = useSelector((state: RootStore) => state)
    const [searchByName, setSearchByName] = useState<string>('')
    const [searchByCode, setSearchByCode] = useState<string>('')
    const [searchByNameTeacher, setCourseByNameTeacher] = useState<string>('');
    const [loadingDeleteCourse, setLoadingDeleteCourse] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<any>({});
    const [sordByDate, setSortByDate] = useState<"asc" | "desc">("desc");
    const [sordByCourseName, setSortByCourseName] = useState<"asc" | "desc">("asc");
    const [onEdit, setOnEdit] = useState<Course | null>({});

    //
    const [userCourse, setUserCourse] = useState<Course[]>(courses.courses || []);
    //console.log('userCourse State', userCourse);
        // l???c m??n theo gv ???????c nh??ng s??? l??m r???i logic c???a pagination
    // will be used for displaying 0 courses
    // useEffect(() => {
    //     if (courses.courses) {
    //         let userCourse: Course[] = [];
    //         if (auth.user?.role !== 'admin' && auth.user?.role !== 'manager') {
    //             userCourse = courses.courses.filter((course: Course) => {
    //                 if (course.teacher && auth.user) {
    //                     return course.teacher._id === auth.user._id
    //                 }
    //             });
    //             setUserCourse(userCourse)
    //         } 
    //     }
    //     // return () => {
    //     //     setUserCourse([])
    //     // }
    // }, [])
    // userCourse.forEach((course) => {
    //     console.log(course);
    // })
    console.log('course state: ', courses);

    const [curCourses, setCurCourses] = useState<CoursePayload>(courses);
    const arraySlice = (page: number, limit: number, array: Course[]) => {
        return array.slice((page - 1) * limit, page * limit)
    }
    
    //let tempCourses: Course[] = courses.courses ? courses.courses : [];
    // D??ng cho vi???c hi???n th??? m??n theo ng?????i d??ng - ko hi???n c???a ng?????i kh??c
    useEffect (() => {
        console.log('Is filter called?');
        if (auth.user?.role !== 'admin' && auth.user?.role !== 'manager') {
            console.log('Yes - filter is called.')
            let tempCourses: Course[] = [];
            if (courses.courses) {
                //let tempCourses: Course[] = [];
                if (auth.user?.role !== 'admin' && auth.user?.role !== 'manager') {
                    // Hi???n th??? theo ng?????i d??ng
                    tempCourses = courses.courses.filter((course: Course) => {
                        if (course.teacher && auth.user) {
                            return course.teacher._id === auth.user._id
                        }
                    });

                    // Hi???n th??? theo ng?????i d??ng khi search (v?? c??i n??y thu???c 1 lu???ng dispatch kh??c)
                    if (courses.searching?.onSearch === true) {
                        console.log('Search filter is also called!');
                        
                        // Khi search courses.coursesSearch c?? m??n
                        if (courses.coursesSearch?.length !== 0) {
                            tempCourses = (courses.coursesSearch || []).filter((course: Course) => {
                                if (course.teacher && auth.user) {
                                    return course.teacher._id === auth.user._id
                                }
                            });
                            console.log('After search tempC: ', tempCourses);
                        }
                        // Khi search courses.coursesSearch kh??ng c?? m??n h???p l???
                        else {
                            console.log('No courses are found apparently');
                            tempCourses = [];
                        }
                    }
                    //setUserCourse(tempCourses)
                } 
                // set l???i courses, length v?? result (result l?? c??i s??? hi???n th??? tr??n m??n h??nh ng?????i d??ng)
                setCurCourses({...courses,
                    courses: tempCourses,
                    coursesLength: tempCourses.length,
                    result: arraySlice(courses.page || 1, courses.limit || 5, tempCourses)
                })
                setUserCourse(tempCourses)
            }
            //dispatch(searchByCourseTeacher((auth.user?.name || '') as string))
        }
        else {
            console.log('No - Everything is kept as is');
            setCurCourses(courses);
        }
        //console.log(curCourses);
    }, [courses])
    console.log('curCourses: ', curCourses)

    const handleClickOpen = (course: Course | null) => {
        setOnEdit(course)
        setOpen(true);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(changePageCourse(page))
    };

    const hanldeDeleteCourse = async (course_id: string) => {
        setLoadingDeleteCourse(course_id);
        await dispatch(deleteCourse(course_id, auth, profile))
        setLoadingDeleteCourse("")
    }

    const handleClickOpenDialog = (course_id: string) => {
        setOpenDialog({
            [`setOpen-${course_id}`]: true
        });

    };

    const handleCloseDialog = (course_id: string) => {
        setOpenDialog({
            [`setOpen-${course_id}`]: false
        });
    };

    const handleSortByCourseName = (sort: 'asc' | 'desc') => {
        setSortByCourseName(sort);
        dispatch(sortByCourseName(sort));
    }

    const hanldeSortByDate = (sort: 'asc' | 'desc') => {
        setSortByDate(sort);
        dispatch(sortByDate(sort));
    }

    const handleSearchByCourseName = (e: InputChange) => {
        setSearchByName(e.target.value)
        dispatch(searchByCourseName(e.target.value as string))
    }

    const handleSearchByCourseCode = (e: InputChange) => {
        setSearchByCode(e.target.value)
        dispatch(searchByCourseCode(e.target.value as string))
    }

    const handleSearchByCourseTeacher = (e: InputChange) => {
        setCourseByNameTeacher(e.target.value)
        dispatch(searchByCourseTeacher(e.target.value as string))
    }

    // ch??? cho ph??p admin/l??nh ?????o khoa xem h???t c??c l???p; c??n l???i t??i kho???n n??o ch??? xem l???p c???a t??i kho???n n???y
    // (admin/manager ph???i t??? search l???p)
    const initSearchByCourseTeacher = () => {
        const teacherName = auth.user?.name ? auth.user.name : '';
        //setCourseByNameTeacher(teacherName)
        // t???t c??i n??y ????? m???i th??? render theo gi??o vi??n hi???n t???i nh??ng ko ??i???n value v??o ?? t??m ki???m
        dispatch(searchByCourseTeacher(teacherName as string))
    }

    // is called once upon rendering, reloading doesn't affect
    // n???u b??? [] th?? m???i l???n rerender n?? v???n s??? gi??? nguy??n dsach c??c m??n c???a gv hi???n t???i
    // nh??ng pagination v?? 2 thanh search c??n l???i s??? ko sd ??c
    // useEffect(() => {
    //     if (auth.user?.role !== 'admin' && auth.user?.role !== 'manager') {
    //         initSearchByCourseTeacher();
    //         dispatch(searchByCourseName(''));
    //         dispatch(searchByCourseCode(''));
    //         console.log(courses.courses);
    //         //dispatch(searchByCourseTeacher(''));
    //     }
    // }, [searchByName, searchByCode])
    // useEffect(() => {
    //     if (auth.user?.role !== 'admin' && auth.user?.role !== 'manager') {
    //         initSearchByCourseTeacher();
    //         dispatch(searchByCourseName(''));
    //         dispatch(searchByCourseCode(''));
    //         //dispatch(searchByCourseTeacher(''));
    //     }
    // }, [])

    return (
        <div className="dashbroad__body course__body">
            <div className="course__control">
                <form>
                    <div className="form-group">
                        <input placeholder="T??m ki???m theo t??n m??n h???c..." type="text" onChange={handleSearchByCourseName} value={searchByName} />
                        <i className='bx bx-search'></i>
                    </div>
                    <div className="form-group">
                        <input placeholder="T??m ki???m theo m?? h???c ph???n..." type="text" onChange={handleSearchByCourseCode} value={searchByCode} />
                        <i className='bx bx-search'></i>
                    </div>
                    {/* Can be removed from rendering with same logic */}
                    {<div className="form-group">
                        <input placeholder="T??m ki???m theo gi??o vi??n..." disabled={!(auth.user?.role === 'admin' || auth.user?.role === 'manager')} type="text" onChange={handleSearchByCourseTeacher} value={searchByNameTeacher} />
                        <i className='bx bx-search'></i>
                    </div>}
                </form>
                <div className="course__control-right">
                    <PrimaryTooltip title="Th??m m??n h???c">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button color="primary" className={classes.ButtonAdd} onClick={() => handleClickOpen(null)}>
                                <i className='bx bx-plus'></i>
                                Th??m m??n h???c
                            </Button>
                        </ButtonGroup>
                    </PrimaryTooltip>
                </div>
            </div>
            <TableContainer component={Paper} className={classes.TableContainer}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {/* Table Head */}
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.TableCellHead}>STT</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>
                                <p style={{ display: "flex", alignItems: 'center' }}>
                                    {
                                        sordByCourseName === "asc" ? <i
                                            onClick={() => handleSortByCourseName("desc")}
                                            style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            className='bx bx-sort-a-z'></i>
                                            :
                                            <i
                                                onClick={() => handleSortByCourseName("asc")}
                                                className='bx bx-sort-z-a'
                                                style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            ></i>
                                    }
                                    T??n kho?? h???c
                                </p>
                            </TableCell>
                            <TableCell align="center" className={classes.TableCellHead}>M?? h???c ph???n</TableCell>
                            <TableCell align="center" className={classes.TableCellHead}>T??n ch???</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>Gi??o vi??n</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>H???c k??</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>N??m h???c</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>Sinh vi??n</TableCell>
                            {/* <TableCell align="left" className={classes.TableCellHead} style={{ minWidth: "120px" }}>
                                <p style={{ display: "flex", alignItems: 'center' }}>
                                    {
                                        sordByDate === "desc" ? <i
                                            onClick={() => hanldeSortByDate("asc")}
                                            style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            className='bx bx-sort-down'></i>
                                            :
                                            <i
                                                onClick={() => hanldeSortByDate("desc")}
                                                className='bx bx-sort-up'
                                                style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            ></i>
                                    }
                                    Ng??y t???o
                                </p>
                            </TableCell> */}
                            <TableCell align="left" className={classes.TableCellHead}>H??nh ?????ng</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {/* Loading */}
                        <TableRow>
                            {
                                curCourses.loading && <TableCell> <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Loading...</h3></TableCell>
                            }
                        </TableRow>
                        <TableRow>
                            {
                                ((curCourses.coursesLength === 0) && curCourses.loading !== true && curCourses.searching?.onSearch === false)
                                && <TableCell scope="row">
                                    <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Ch??a c?? m??n h???c n??o ???????c th??m</h3>
                                </TableCell>

                            }
                        </TableRow>
                        <TableRow>
                            {
                                (
                                    (curCourses?.coursesSearch && curCourses.coursesSearch.length === 0 && curCourses.loading !== true && curCourses.searching?.onSearch === true) ||
                                    ((auth.user?.role !== 'admin' && auth.user?.role !== 'manager') && curCourses.coursesLength === 0 && curCourses?.coursesSearch && curCourses.coursesSearch.length !== 0 && curCourses.loading !== true && curCourses.searching?.onSearch === true)
                                )
                                && <TableCell scope="row">
                                    <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Kh??ng t??m th???y m??n h???c h???p l???</h3>
                                </TableCell>
                            }
                        </TableRow>
                        {
                            curCourses.result?.map((course, index) => {
                                return <TableRow
                                    key={course._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell className={classes.TableCellBody} align='center' component="th" scope="row">{(curCourses.page && curCourses.limit) && ((curCourses.page - 1) * curCourses.limit) + index + 1}</TableCell>
                                    <TableCell className={`${classes.TableCellBody} course-name`} align="left">{course.name}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center" style={{ textTransform: "uppercase" }}>{course.courseCode}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">{course.credit}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="left"><h3 style={{ fontSize: "1.4rem", fontWeight: "600" }}>{course.teacher?.name}</h3> ({course.teacher?.account})</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">{course.semester}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="left">
                                        {dayjs(course.yearStart).format("YYYY")} - {dayjs(course.yearEnd).format("YYYY")}
                                    </TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">
                                        {
                                            course.students?.length
                                        }
                                    </TableCell>
                                    {/* <TableCell className={classes.TableCellBody} align="left">{dayjs(course.createdAt).format("DD/MM/YYYY")}</TableCell> */}
                                    <TableCell className={classes.TableCellBody} align="left">
                                        <div>
                                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                {
                                                (auth.user?.role === 'admin' || auth.user?.role === 'manager' || auth.user?._id === course.teacher?._id) && <PrimaryTooltip title="Chi ti???t  m??n h???c" className={classes.Tooltip}>
                                                    <Button className={`${classes.Button} ${classes.ButtonInfor}`} color="primary" >
                                                        <Link to={`/course/${course._id}`} style={{ textDecoration: "none", color: '#fff', width: "100%", height: "100%" }}>
                                                            <i style={{ fontSize: "2rem" }}
                                                                className='bx bx-expand-vertical' >
                                                            </i>
                                                        </Link>
                                                    </Button>
                                                </PrimaryTooltip>
                                                }
                                                {
                                                    // admin hoac teacher tao thi moi co the chinh sua hoac xoa
                                                    (auth.user?.role === 'admin' || auth.user?._id === course.teacher?._id) && <React.Fragment>
                                                        <PrimaryTooltip title="Ch???nh s???a">
                                                            <Button color="primary" onClick={() => handleClickOpen(course)} className={classes.Button} ><i className='bx bxs-edit-alt' style={{ fontSize: "2rem" }}></i></Button>
                                                        </PrimaryTooltip>
                                                        <PrimaryTooltip title="Xo??">
                                                            <Button onClick={() => handleClickOpenDialog(course?._id as string)} className={classes.Button} color="error">  <i style={{ fontSize: "2rem" }} className='bx bx-x'></i></Button>
                                                        </PrimaryTooltip>
                                                        {/* Dialog confirm delete course */}
                                                        <Dialog
                                                            open={openDialog ? openDialog[`setOpen-${course._id as string}`] ? openDialog[`setOpen-${course._id as string}`] : false : false}
                                                            onClose={handleCloseDialog}
                                                            aria-labelledby="alert-dialog-title"
                                                            aria-describedby="alert-dialog-description"
                                                        >
                                                            <h3 className='modal__heading' style={{ margin: "16px" }}>
                                                                B???n c?? ch???c mu???n xo?? m??n h???c n??y!
                                                            </h3>
                                                            <DialogActions>
                                                                <Button onClick={() => handleCloseDialog(course._id as string)} color='error'>
                                                                    <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                                                        Hu??? xo??
                                                                    </p>
                                                                </Button>
                                                                <Button onClick={() => hanldeDeleteCourse(course._id as string)} className={classes.Button}>
                                                                    {loadingDeleteCourse === course._id ? <><Loading type='small' /> <p style={{ textTransform: "initial", marginLeft: "10px" }}>??ang xo??...</p></> :
                                                                        <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                                                            ?????ng ??
                                                                        </p>}

                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </React.Fragment>
                                                }
                                            </ButtonGroup>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                curCourses.coursesLength !== 0 && <Box display='flex' justifyContent="flex-end" bgcolor="#fff" padding="16px">
                    <PaginationComponent page={curCourses.page as number} variant='outlined' shape='rounded' onChange={handleChangePage} className={classes.Pagination} total={curCourses.coursesLength ? curCourses.coursesLength : 0}></PaginationComponent>
                </Box>
            }
            {/* Dialog create course */}
            <CourseFormModal open={open} hanldeSetOpen={setOpen} onEdit={onEdit} setOnEdit={setOnEdit} />
        </div >
    )
}

export default CourseBody