import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootStore, Params, LessonDetail as ILessonDetail, Attendance } from '../../utils/interface'
import { useParams, Link } from 'react-router-dom'
import { getDetailLesson } from '../../store/actions/lessonActions'
import Logo from '../../images/logo.png';
import dayjs from 'dayjs'
import "./LessonDetail.scss"
import { countAbsent } from '../../utils/student'
import ReportLessonModel from '../../components/lesson/ReportLessonModel'
import ReportStudentModel from '../../components/lesson/ReportStudentModel'

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import Button from "@mui/material/Button"
import Skeleton from '@mui/material/Skeleton';

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
    "maxWidth": "70px",
    "width": "15%",
    "WebkitLineClamp": "1",
    "WebkitBoxOrient": "vertical",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
  },

  TableCellBodyDecs: {
    minWidth: "50% !important"
  },
  Button: {
    minWidth: "100px !important"
  },

  // Sekeleton
  SkeletonTop: {
    borderRadius: "5px !important",
  },
  SkeletonInline: {
    display: 'inline-block !important'
  },
  classNameInforRowLeft: {
    marginLeft: "auto"

  },
  classNameInforRowRight: {
    marginRight: "auto"
  }
});

const LessonDetail = () => {

  const classes = useStyles();
  const { slug } = useParams<Params>();
  const dispatch = useDispatch();
  const [lessonDetailState, setLessonDetailState] = useState<ILessonDetail>({});
  const { auth, lessonDetail: lessonDetailStore } = useSelector((state: RootStore) => state);

  useEffect(() => {
    if (slug) {
      const getDetailLessonFunction = async () => {
        await dispatch(getDetailLesson(slug, lessonDetailStore, auth))
      }
      getDetailLessonFunction();

      lessonDetailStore.lessons?.forEach((detailLesson) => {
        if (detailLesson.lesson?._id === slug) {
          setLessonDetailState(detailLesson)
        }
      })

    }
  }, [auth, slug, lessonDetailStore.lessons])


  return (
    <div className="lesson__detail dashbroad__body dashbroad__body--xl">
      <Box display={'flex'} >
        {/* Seleketon loading */}
        {lessonDetailStore.loading && <Box marginBottom={'20px'} display={"flex"}>
          <Box marginRight={'20px'}>
            <Skeleton className={classes.SkeletonTop} variant="rectangular" width={120} height={36} animation='wave' />
          </Box>
          <Box marginRight={'20px'}>
            <Skeleton className={classes.SkeletonTop} variant="rectangular" width={120} height={36} animation='wave' />
          </Box>
        </Box>}
        {
          !lessonDetailStore.loading && <>
            <div className="lesson__detail-report">
              {!lessonDetailStore.loading && <ReportLessonModel lessonDetail={lessonDetailState} />}
            </div>
            <div className="lesson__detail-report">
              {!lessonDetailStore.loading && <ReportStudentModel lessonDetail={lessonDetailState} />}
            </div>
          </>
        }

      </Box>
      <div className="lesson__detail-card">
        <Link to='/lesson' className="card__back"><i className='bx bxs-chevron-left'></i></Link>
        <div className="card__header">
          <div className="card__header-left">
            <img className="left__logo" alt='logo' src={Logo}>
            </img>
            <div className="left__lesson-infor">
              <div className="infor__row">
                {
                  lessonDetailStore.loading ? <Skeleton className={classes.SkeletonInline} height={22} variant="text" width={200} />
                    : <>
                      <i className='bx bxs-graduation'></i>
                      <span>
                        Gi??o vi??n: {lessonDetailState?.lesson?.teacher?.name}
                      </span>
                    </>
                }
              </div>
              <div className="infor__row">
                {
                  lessonDetailStore.loading ? <Skeleton className={classes.SkeletonInline} height={22} variant="text" width={100} />
                    : <>
                      <i className='bx bx-calendar-week'></i>
                      <span>{lessonDetailState?.lesson?.weekday}</span>
                    </>
                }

              </div>
              <div className="infor__row">
                {
                  lessonDetailStore.loading ? <Skeleton className={classes.SkeletonInline} height={22} variant="text" width={180} />
                    : <>
                      <i className='bx bxs-calendar-minus'></i>
                      <span>
                        Ng??y t???o: {dayjs(lessonDetailState?.lesson?.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </>
                }
              </div>
              <div className="infor__row">
                {
                  lessonDetailStore.loading ? <Skeleton className={classes.SkeletonInline} height={22} variant="text" width={210} />
                    : <>
                      <i className='bx bxs-time'></i>
                      <span>Th???i gian b???t ?????u: 
                        {dayjs(lessonDetailState?.lesson?.timeStart).format("hh:mm a")}
                      </span>
                    </>
                }

              </div>
              <div className="infor__row">
                {
                  lessonDetailStore.loading ? <Skeleton className={classes.SkeletonInline} height={22} variant="text" width={210} />
                    : <>
                      <i className='bx bxs-time-five'></i>
                      <span>Th???i gian k???t th??c: {dayjs(lessonDetailState?.lesson?.timeEnd).format("hh:mm a")}</span>
                    </>
                }
              </div>
            </div>
          </div>
          <div className="card__header-right">
            <div className="right__course-infor">
              <div className="infor__row">
                <h2 className="infor__row-left infor__row-name">
                  {
                    lessonDetailStore.loading ? <> <Skeleton className={classes.SkeletonTop} variant="text" width={"100%"} height={50} animation='wave' /></> :
                      <Link style={{ textDecoration: "none", color: "inherit" }} to={`/course/${lessonDetailState?.lesson?.course?._id}`}>
                        {lessonDetailState?.lesson?.course?.name}
                      </Link>
                  }
                </h2>
                <p className="infor__row-right infor__row-code">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.SkeletonTop} variant="text" width={"100%"} height={50} animation='wave' /></> :
                    <>
                      # < span > {lessonDetailState?.lesson?.course?.courseCode}</span>
                    </>
                  }
                </p>
              </div>
              <div className="infor__row">
                <span className="infor__row-left">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowLeft} variant="text" width={70} height={25} animation='wave' /></> :
                    <>
                      Ng??y t???o
                    </>
                  }
                </span>
                <span className="infor__row-right">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowRight} variant="text" width={70} height={25} animation='wave' /></> :
                    <>
                      {dayjs(lessonDetailState?.lesson?.course?.createdAt).format("DD/MM/YYYY")}
                    </>
                  }
                </span>
              </div>
              <div className="infor__row">
                <span className="infor__row-left">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowLeft} variant="text" width={90} height={25} animation='wave' /></> :
                    <>
                      S??? t??n ch???
                    </>
                  }
                </span>
                <span className="infor__row-right">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowRight} variant="text" width={10} height={25} animation='wave' /></> :
                    <>
                      {lessonDetailState?.lesson?.course?.credit}
                    </>
                  }
                </span>
              </div>
              <div className="infor__row">
                <span className="infor__row-left">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowLeft} variant="text" width={60} height={25} animation='wave' /></> :
                    <>
                      H???c k??
                    </>
                  }
                </span>
                <span className="infor__row-right">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowRight} variant="text" width={10} height={25} animation='wave' /></> :
                    <>
                      {lessonDetailState?.lesson?.course?.semester}
                    </>
                  }
                </span>
              </div>
              <div className="infor__row">

                <span className="infor__row-left">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowLeft} variant="text" width={100} height={25} animation='wave' /></> :
                    <>
                      N??m b???t ?????u
                    </>
                  }
                </span>
                <span className="infor__row-right">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowRight} variant="text" width={70} height={25} animation='wave' /></> :
                    <>
                      {dayjs(lessonDetailState?.lesson?.course?.yearStart).format('YYYY')}
                    </>
                  }
                </span>

              </div>
              <div className="infor__row">

                <span className="infor__row-left">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowLeft} variant="text" width={110} height={25} animation='wave' /></> :
                    <>
                      N??m k???t th??c
                    </>
                  }
                </span>
                <span className="infor__row-right">
                  {lessonDetailStore.loading ? <> <Skeleton className={classes.classNameInforRowRight} variant="text" width={70} height={25} animation='wave' /></> :
                    <>
                      {dayjs(lessonDetailState?.lesson?.course?.yearEnd).format('YYYY')}
                    </>
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card__desc">
          <h3>
            M?? t??? bu???i h???c
          </h3>
          <p>
            {
              lessonDetailState?.lesson?.desc ? `${lessonDetailState?.lesson?.desc}.` : <span className="loading-text">{lessonDetailStore.loading === false ? "Ch??a c?? m?? t??? bu???i h???c" : ""}</span>
            }
          </p>
        </div>
        <div className="card__rollcallsesson">
          <h3>
            Bu???i ??i???m danh
          </h3>
          <TableContainer>
            <Table className="card__rollcallsesson-table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.TableCellHead} align="left">M?? t???</TableCell>
                  <TableCell className={classes.TableCellHead} align="center">C?? m???t</TableCell>
                  <TableCell className={classes.TableCellHead} align="center">V???ng</TableCell>
                  <TableCell className={classes.TableCellHead} align="center">K???t th??c</TableCell>
                  <TableCell className={classes.TableCellHead} align="center">Chi ti???t</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  lessonDetailStore.loading === true ? <tr ><td className='loading-text' style={{ marginTop: "10px" }}>??ang t???i...</td></tr> :
                    lessonDetailState?.rollCallSessions && lessonDetailState?.rollCallSessions?.length === 0
                      ? <p className='loading-text' style={{ marginTop: "10px" }}>M??n h???c n??y ch??a c?? bu???i ??i???m danh n??o</p> :
                      lessonDetailState?.rollCallSessions?.map((rollCallsessDetail) => {
                        return <TableRow
                          key={rollCallsessDetail._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell className={`${classes.TableCellBodyDecs}`} align="left">
                            <div className="table__desc">
                              <span>
                                Ng??y t???o: {dayjs(rollCallsessDetail.createdAt).format("DD-MM-YYYY")}
                              </span>
                              <p>
                                {rollCallsessDetail.comment ? rollCallsessDetail.comment : "ch??a c?? nh???n x??t"}
                              </p>
                            </div>

                          </TableCell>
                          <TableCell align="center">
                            <span className='table__absent'>
                              {
                                countAbsent(rollCallsessDetail.attendanceDetails ? rollCallsessDetail.attendanceDetails : [], false)
                              }
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <span className="table__absent">
                              {
                                countAbsent(rollCallsessDetail.attendanceDetails ? rollCallsessDetail.attendanceDetails : [], true)
                              }
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <span className={rollCallsessDetail.end ? "table__end table__end--yes" : "table__end  table__end--no"}>
                              {
                                rollCallsessDetail.end ? "???? k???t th??c" : lessonDetailState.lesson?.teacher?._id === auth.user?._id && <PrimaryTooltip title="Ti???p t???c ??i???m danh" placement="left-start">
                                  <Link style={{ textDecoration: "none", height: "fit-content" }} to={`/roll-call-session/${rollCallsessDetail._id}`}>
                                    <Button className={classes.Button} color="primary" variant='contained'>
                                      <p style={{ fontSize: "1.3rem", textTransform: "initial" }}>Ti???p t???c ??i???m danh</p>
                                    </Button>
                                  </Link>
                                </PrimaryTooltip>
                              }
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            {
                              lessonDetailState.lesson?.teacher?._id === auth.user?._id && <PrimaryTooltip title="Xem chi ti???t" placement="right-start">
                                <Link style={{ textDecoration: "none" }} to={`/roll-call-session/${rollCallsessDetail._id}`}>
                                  <Button className={classes.Button} color="primary" variant='contained'>
                                    <p style={{ fontSize: "1.3rem", textTransform: "initial" }}>Chi ti???t</p>
                                  </Button>
                                </Link>
                              </PrimaryTooltip>
                            }
                          </TableCell>
                        </TableRow>
                      })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div >
  )
}

export default LessonDetail