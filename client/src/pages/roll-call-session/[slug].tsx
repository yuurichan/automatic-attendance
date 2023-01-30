import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { FormSubmit, InputChange, Params } from '../../utils/interface'
import { RootStore, RollCallSession, Attendance } from '../../utils/interface'
import { useDispatch, useSelector } from 'react-redux'
import { getDetailRollCallSession, updateDetailRollCallSession, updateAttendanceDetail } from '../../store/actions/rollCallSession'
import dayjs from 'dayjs'
import "./RollCallSessionDetail.scss"
import Loading from '../../components/globals/loading/Loading'
import Logo from '../../images/logo.png';
import { ALERT } from '../../store/types/alertTypes'
import { countAbsent } from '../../utils/student'
import { postAPI, putAPI } from '../../utils/fetchApi'

// Face Api
import * as faceapi from 'face-api.js';

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceDetailRow from '../../components/roll-call-session/AttendanceDetailRow'
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';


const useStyles = makeStyles({
    TableContainer: {
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important",
        borderRadius: "5px !important",
    },
    TableCellHead: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "600 !important",
        height: "60px !important",
    },
    SekeletonRadius: {
        borderRadius: "5px"
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
    TableCellBodyDate: {
        width: "100px !important"
    }
});

const RollCallSessionDetail = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { slug }: Params = useParams();
    const { detailRollCallSession: detailRollCallSessionStore, auth, lessonDetail } = useSelector((state: RootStore) => state)

    // State
    const [detailRollCallSession, setDetailRollCallSession] = useState<RollCallSession>({})
    const [comment, setComment] = useState<string>();
    const [loadingComment, setLoadingCommnet] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openControlAttendace, setOpenControlAttendance] = useState<boolean>(true);
    const [handmade, setHandmade] = useState<number>(0)
    const [loadingAttendace, setLoadingAttendace] = useState<boolean>(false)
    const [tracks, setTracks] = useState<any>()
    const [playing, setPlaying] = useState<boolean>(false)
    const [loadingModel, setLoadingModel] = useState<boolean>(false)
    const [loadingDescriptors, setLoadingDescriptors] = useState<boolean>(false)
    const [isEmptyDescriptors, setIsEmptyDescriptors] = useState<boolean>(false)
    const [faceMatcher, setFaceMatcher] = useState<any>()

    const [timers, setTimers] = useState<any>()
    const [studentCodeList, setStudentCodeList] = useState<any[]>()
    //const [isSessionEnd, setSessionEnd] = useState<boolean>(false)

    //test (this is used for the sake of re-rendering the attendance list)
    const [rerender, setRender] = useState<Number>(0);
    const forceUpdateRe = React.useReducer(() => ({}), {})[1] as () => void

    // Ref
    const refCamera = useRef<any>(null);
    const refCanvas = useRef<any>(null);

    console.log('detailRollCallSession: ', detailRollCallSession);
    // this might be used to refresh and/or re-render components but it doesn't seem to work
    useEffect(() => {
        console.log('This is triggered');
        if (slug) {
            const handleGetDetailRollCallSession = async () => {
                dispatch(getDetailRollCallSession(detailRollCallSessionStore, slug, auth))
            }
            handleGetDetailRollCallSession()
            console.log('Get Detail');
        }
        

        detailRollCallSessionStore.rollCallSessions?.filter(rollCallSession => {
            if (rollCallSession._id === slug) {
                setDetailRollCallSession({...rollCallSession})
                setComment(rollCallSession.comment)
            }
            console.log('Get Session');
        })

    }, [slug, auth, detailRollCallSessionStore.rollCallSessions, rerender])

    // Load models
    useEffect(() => {
        if (handmade === 2) {
            const loadModels = async () => {
                const MODEL_URI = process.env.PUBLIC_URL + '/models'
                Promise.all(
                    [
                        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URI), // Pre-trained model dùng để phát hiện gương mặt.
                        // faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
                        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI), // FaceLandmark68Net Model: Pre-trained model dùng để xác định được các điểm xung quanh mặt.
                        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI) // Pre-trained model dùng để nhận dạng gương mặt.
                    ]
                )

                // Tai cac model nhan dien khuon mat thanh cong
                setLoadingModel(true);
                dispatch({ type: ALERT, payload: { success: "Tải các Pre-trained model thành công" } })
            }
            loadModels()
        }
    }, [handmade])

    // Get Descriptor from server
    useEffect(() => {
        if (handmade === 2) {
            const getDescriptors = async () => {
                let studentCodeList: any[] = [];
                detailRollCallSession?.attendanceDetails?.forEach((attendanceDetail) => {
                    studentCodeList.push(attendanceDetail?.student?.studentCode)
                })
                setStudentCodeList(studentCodeList)

                const res = await postAPI('face_api_descriptors', { studentCodeList }, auth.access_token)

                console.log('Response: ', res)

                const faceDescriptors: any[] = [];


                if (res.data.descriptors.length !== 0) {
                    res.data.descriptors.forEach((_descriptors: any) => {
                        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(_descriptors.label, [new Float32Array(_descriptors.descriptors[0],_descriptors.descriptors[1],_descriptors.descriptors[2])]))

                    })

                    console.log(faceDescriptors)

                    const faceMatcher = new faceapi.FaceMatcher(faceDescriptors, 0.6)
                    setFaceMatcher(faceMatcher)
                    setLoadingDescriptors(true)
                    dispatch({ type: ALERT, payload: { success: res.data.msg } })
                    setIsEmptyDescriptors(false)
                } else {
                    setIsEmptyDescriptors(true)
                    dispatch({ type: ALERT, payload: { error: "Trong lớp học chưa có sinh viên nào được nhận diện khuôn mặt từ trước" } })

                }
            }
            getDescriptors()
        }
    }, [handmade])

    useEffect(() => {
        if (isEmptyDescriptors) {
            hanldeCloseCamera();
        }
    }, [isEmptyDescriptors])

    //  Luu nhan xet
    const handleSubmit = async (e: FormSubmit) => {
        e.preventDefault()
        setLoadingCommnet(true)
        await dispatch(updateDetailRollCallSession({ ...detailRollCallSession, comment }, auth, detailRollCallSessionStore, lessonDetail))
        setLoadingCommnet(false)
    }

    // Ket thuc buoi diem danh
    const handleEndRollCallSession = async (detailRollCallSession: RollCallSession) => {
        try {
            dispatch({ type: ALERT, payload: { loading: true } })
            await dispatch(updateDetailRollCallSession({ ...detailRollCallSession, end: true }, auth, detailRollCallSessionStore, lessonDetail))
            handleCloseDialog()
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { loading: false } })
            dispatch({ type: ALERT, payload: { error: error.response.dât.msg } })
        }
    }

    const handleCloseDialog = () => {
        setOpen(false)
    }

    const handleCloseDialogControlAttendance = (isClose: boolean) => {

        if (isEmptyDescriptors) {
            setHandmade(1);
            return;
        }

        if (isClose) setHandmade(1)
        setOpenControlAttendance(false)
    }

    useEffect(() => {
        forceUpdateRe();
        console.log('rerender: ', rerender);        
    }, [rerender])

    // useEffect(() => {
    //     return () => {
    //         if (playing === true && tracks && timers) {
    //             //console.log(playing, tracks, timers, '+++ UseEff is triggered')
    //             hanldeCloseCamera()
    //             setIsEmptyDescriptors(false)
    //             clearInterval(timers)
    //             console.log('Camera closed since there is a change in either playing/tracks/timers')
    //             console.log(playing, tracks, timers)
    //         }
    //     }
    // }, [playing, tracks, timers])
    useEffect(() => {
        return () => {
            if (playing === true && timers && tracks) {
                console.log(playing, tracks, timers, '+++ UseEff is triggered')
                setPlaying(false)
                setTracks(null)
                setTimers(0)
                tracks && tracks.forEach((track: any) => { track.stop(); })
                refCamera.current?.srcObject?.getTracks()[0].stop();
                setIsEmptyDescriptors(false);
                clearInterval(timers);
                console.log('Camera closed since there is a change in either playing/tracks/timers')
                //console.log(playing, tracks, timers)
            }
        }
    }, [playing, timers, tracks]) // useEff dc goi khi mot trong cac gtri thay doi
    // EDIT: it's finally fixed! literally an hour before New Years Eve
    // chủ yếu được dùng khi camera còn mở và người dùng chuyển qua trang khác bất ngờ => tự động tắt cam

    // Open camera
    const handleOpenCamera = () => {
        if (navigator.mediaDevices) {
            setPlaying(true)
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(stream => {
                let video = refCamera.current
                if (video) {
                    video.srcObject = stream
                    const track = stream.getTracks()
                    setTracks(track)
                    console.log('Camera Opened');
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    // Close camera
    const hanldeCloseCamera = () => {
        if (tracks) {
            setPlaying(false)
            tracks && tracks.forEach((track: any) => { track.stop(); })
            refCamera.current?.srcObject?.getTracks()[0].stop();
            clearInterval(timers)
            console.log('Camera Close Handler: ', playing, tracks, timers)
        }
    }

    // Play camera
    const hanldeCameraPlay = () => {
        if (loadingModel && loadingDescriptors && !isEmptyDescriptors) {
            const timer = setInterval(async () => {
                console.log('playing')

                // Tao canvas de ve 
                refCanvas.current.innerHTML = faceapi.createCanvasFromMedia(refCamera.current)
                const displaySize = {
                    width: 640, height: 480
                }

                faceapi.matchDimensions(refCanvas.current, displaySize)

                // Computing Face Descriptors
                // Tính toán các gốc cạnh trên khuôn mặt
                const detection = await faceapi.detectSingleFace(refCamera.current, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor()

                if (detection) {
                    const fullFaceDescriptions = faceapi.resizeResults(detection, displaySize)
                    // // Xoa cac canvas truoc
                    if (refCanvas.current) {
                        refCanvas.current.getContext('2d').clearRect(0, 0, 640, 480)
                    }

                    // Lấy các điểm trong khuôn mặt, sau đó vẽ lên canvas
                    const box = fullFaceDescriptions?.detection?.box
                    const drawBox = new faceapi.draw.DrawBox(box as any, {
                        label: faceMatcher.findBestMatch(detection.descriptor)
                    })
                    drawBox.draw(refCanvas.current)

                    const face = faceMatcher.findBestMatch(detection.descriptor)

                    //let attendance: any;
                    let attendance : Attendance = {} as Attendance;
                    detailRollCallSession.attendanceDetails?.forEach(_attendance => {
                        if (_attendance.student?.studentCode === face.label) {
                            attendance = _attendance;
                        }
                    })
                    // This one takes singular values, so it only updates for one student at a time?

                    // Is it singular or multiples because there's some sort of a visual error with this one as far as I'm concerned
                    // It affects the checkmark and the counts as well, visually speaking
                    // It updates every 200ms, the data is saved but the checkmarks aren't displaying correctly (as in it only renders the current student being checked?)
                    // Only after refreshing the page do the checkmarks work correctly
                    console.log(attendance)
                    if (attendance) {
                        if (attendance.absent === true) {
                            const data = {
                                absent: false
                            }

                            await putAPI(`attendance_detail/${attendance._id}`, data, auth.access_token)
                            dispatch({ type: ALERT, payload: { success: "Điểm danh thành công" } })

                            const newAttendanceDetails = detailRollCallSession.attendanceDetails?.map((_attendanceDetail) => {
                                //console.log('_attendanceDetail: ', _attendanceDetail);
                                return _attendanceDetail._id === attendance._id ? { ...attendance, absent: !attendance.absent } : _attendanceDetail
                            })

                            console.log('newAttendanceDetails: ', newAttendanceDetails);
                            dispatch(updateAttendanceDetail({ ...detailRollCallSession, attendanceDetails: newAttendanceDetails }, auth, detailRollCallSessionStore, lessonDetail))
                            setDetailRollCallSession({
                                ...detailRollCallSession,
                                attendanceDetails : newAttendanceDetails
                            })
                            
                            rerender === 0 ? setRender(1) : setRender(0)
                        } else {
                            return;
                        }
                        // attendance obj needs to be flushed and made anew?
                        // if (slug) {
                        //     const handleGetDetailRollCallSession = async () => {
                        //         dispatch(getDetailRollCallSession(detailRollCallSessionStore, slug, auth))
                        //     }
                        //     handleGetDetailRollCallSession()
                        //     console.log('Get Detail 2');
                        // }
                        // detailRollCallSessionStore?.rollCallSessions?.filter(rollCallSession => {
                        //     if (rollCallSession._id === slug) {
                        //         setDetailRollCallSession({...rollCallSession})
                        //         setComment(rollCallSession.comment)
                        //     }
                        //     console.log('Get Session 2');
                        // })
                    }

                }
            }, 200)
            console.log({ timer })
            setTimers(timer)
        }
        console.log('Camera Recog. stopped since models aren\'t loaded')
    }



    return (
        <div className='dashbroad__body dashbroad__body--xl'>
            <div className='rollcallsession-detail'>
                {/* Header */}
                <div className="rollcallsession-detail__header">
                    <div className="header__left">
                        <h2>
                            {
                                detailRollCallSession.lesson?.course?.name
                            }
                            {
                                detailRollCallSessionStore.loading && <Box display={'flex'} marginLeft={"-10px"}>
                                    <Skeleton width={300} height={40} variant='text'></Skeleton>
                                    <Box>
                                        <Skeleton width={50} height={40} variant='text'></Skeleton>
                                    </Box>
                                </Box>
                            }

                            {
                                !detailRollCallSessionStore.loading && <span>
                                    #{
                                        detailRollCallSession.lesson?.course?.courseCode
                                    }
                                </span>
                            }
                        </h2>
                        <div className="header__left-comment">
                            {
                                detailRollCallSessionStore.loading && <Box display={'flex'}>
                                    <Skeleton width={300} height={25} variant='text'></Skeleton>
                                </Box>
                            }
                            {

                                !detailRollCallSessionStore.loading && (detailRollCallSession.comment ? detailRollCallSession.comment : "Chưa có nhận xết về buổi học")

                            }
                        </div>

                    </div>
                    <div className="header__right">
                        {
                            detailRollCallSession.end && <h2><i className='bx bxs-alarm-exclamation' ></i>Buổi học đã kết thúc</h2>
                        }
                        <div className="header__btn-end">
                            {
                                detailRollCallSessionStore.loading && <Box display={'flex'}>
                                    <Skeleton className={classes.SekeletonRadius} width={100} height={40} variant='rectangular'></Skeleton>
                                </Box>
                            }
                            {
                                (!detailRollCallSession.end && detailRollCallSessionStore.loading === false) && <PrimaryTooltip title="Kết thúc buổi điểm danh" color='error'>
                                    <Button onClick={() => setOpen(true)} variant='contained'>
                                        <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-stopwatch'></i>  <p className="button-text">Kết Thúc</p>
                                    </Button>
                                </PrimaryTooltip>
                            }
                            {/* Dialog Confirm End Roll Call Session */}
                            <Dialog
                                open={open}
                                onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <Box padding={2}>
                                    <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                                        <h2 className="modal__heading" style={{ color: "crimson" }}>Kết thúc buổi điểm danh</h2>
                                        <Box>
                                            <PrimaryTooltip title='Đóng hộp thoại'>
                                                <IconButton size="medium" onClick={handleCloseDialog}>
                                                    <i className='bx bx-x' style={{ color: "#473fce", fontSize: "2.6rem" }}></i>
                                                </IconButton>
                                            </PrimaryTooltip>
                                        </Box>
                                    </Box>
                                    <div style={{ marginBottom: "20px" }}>
                                        <p style={{ fontSize: "1.4rem" }}>
                                            Bạn có chắc muốn kết thúc buổi điểm danh, mọi hành động điểm danh sẽ không còn được thực hiện nữa !!!
                                        </p>
                                    </div>
                                    <DialogActions>
                                        <PrimaryTooltip title="Kết thúc buổi điểm danh">
                                            <Button color="success" onClick={handleCloseDialog} variant='contained'>
                                                <p className="button-text">Đóng</p>
                                            </Button>
                                        </PrimaryTooltip>
                                        <PrimaryTooltip title="Kết thúc buổi điểm danh" >
                                            <Button color="error" onClick={(() => {handleEndRollCallSession(detailRollCallSession); hanldeCloseCamera();})} variant='contained'>
                                                <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-exit'></i>  <p className="button-text">Kết Thúc</p>
                                            </Button>
                                        </PrimaryTooltip>
                                    </DialogActions>
                                </Box>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Control */}
                <div className="rollcallsession-detail__control">
                    {/* Detail Roll Call Session Card */}
                    <div className='rollcallsession-detail__control-detail'>
                        <div className="detail__infor">
                            <div className="detail__infor-header">
                                <img src={Logo} alt="logo" />
                                <div className="header__right">
                                    <span className="header__right-badge">
                                        Có mặt: {countAbsent(detailRollCallSession.attendanceDetails ? detailRollCallSession.attendanceDetails : [], false)}
                                    </span>
                                    <span className="header__right-badge header__right-badge--absent">
                                        Vắng: {countAbsent(detailRollCallSession.attendanceDetails ? detailRollCallSession.attendanceDetails : [], true)}
                                    </span>
                                </div>
                            </div>
                            <div className="detail__infor-group">
                                {
                                    detailRollCallSessionStore.loading ? <Skeleton height={22} variant="text" width={50} />
                                        : <>
                                            <i className='bx bxs-calendar-week' ></i>
                                            <span>{detailRollCallSession.lesson?.weekday}</span>
                                        </>
                                }
                            </div>
                            <div className="detail__infor-group">
                                {
                                    detailRollCallSessionStore.loading ? <Skeleton height={22} variant="text" width={200} />
                                        : <>
                                            <i className='bx bxs-time'></i>
                                            <span>Thời gian bắt đầu: {dayjs(detailRollCallSession.lesson?.timeStart).format("hh:mm a")}</span>
                                        </>
                                }
                            </div>
                            <div className="detail__infor-group">
                                {
                                    detailRollCallSessionStore.loading ? <Skeleton height={22} variant="text" width={200} />
                                        : <>
                                            <i className='bx bxs-time-five'></i>
                                            <span>Thời gian kết thúc: {dayjs(detailRollCallSession.lesson?.timeEnd).format("hh:mm a")}</span>
                                        </>
                                }
                            </div>
                            <div className="detail__infor-group">
                                {
                                    detailRollCallSessionStore.loading ? <Skeleton height={22} variant="text" width={220} />
                                        : <>
                                            <i className='bx bxs-graduation'></i>
                                            {
                                                <span>{detailRollCallSession.teacher?.name} ({detailRollCallSession.teacher?.account})</span>
                                            }
                                        </>
                                }

                            </div>

                        </div>

                        {/* Comment */}
                        <div className="detail__comment">
                            <form onSubmit={handleSubmit}>
                                <div className="form__group">
                                    <label htmlFor="comment">Nhận xét buổi học</label>
                                    <textarea
                                        cols={20}
                                        rows={5}
                                        value={comment ? comment : ""}
                                        name='commnet'
                                        id='comment'
                                        onChange={(e: InputChange) => setComment(e.target.value)} />
                                </div>
                                <div className="form__button">
                                    <PrimaryTooltip title="Lưu nhận xét">
                                        <Button variant='contained' type='submit'>
                                            {
                                                loadingComment ?
                                                    <><Loading type='small'></Loading><p style={{ textTransform: "initial", fontSize: "1.3rem", marginLeft: "15px" }}>Đang lưu...</p></>
                                                    : <p style={{ textTransform: "initial", fontSize: "1.3rem" }}>Lưu</p>
                                            }
                                        </Button>
                                    </PrimaryTooltip>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

                {/* Tabel */}
                <div className='rollcallsession-detail__table'>

                    {handmade === 1 || (handmade === 2 && isEmptyDescriptors === true) ? <TableContainer className={classes.TableContainer} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.TableCellHead} align="left">Họ và tên</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">MSSV</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">Giới tính</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">Ngày</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">Học phần</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">Điểm danh</TableCell>
                                    <TableCell className={classes.TableCellHead} align="left">Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    detailRollCallSession.attendanceDetails?.map((attendance) => {
                                        return <AttendanceDetailRow key={attendance._id} attendance={attendance} detailRollCallSession={detailRollCallSession} />
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer> : handmade === 2 ? <div className="rollcallsession-detail__camera">
                        {/* <p> Hiện chức năng đang phát triển!</p> */}
                        {/* Everything works data-wise, couldn't fix the visual part though */}
                        {
                            !playing ? <Button variant='contained' onClick={handleOpenCamera}>
                                <p className="button-text">Mở camera</p>
                            </Button> :
                                <Button variant='contained' onClick={hanldeCloseCamera}>
                                    <p className="button-text">Đóng camera</p>
                                </Button>
                        }
                        {
                            playing && <div className="rollcallsession-detail__camera-wrapper">
                                <video onPlay={hanldeCameraPlay} ref={refCamera} autoPlay muted></video>
                                <canvas ref={refCanvas}></canvas>
                            </div>
                        }
                        <TableContainer className={classes.TableContainer} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.TableCellHead} align="left">Họ và tên</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">MSSV</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Giới tính</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Ngày</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Học phần</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Điểm danh</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        detailRollCallSession.attendanceDetails?.map((attendance) => {
                                            return <TableRow
                                                key={attendance._id}
                                                className="detail__row"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        !attendance.student?._id && <p style={{ color: "crimson" }}>Sinh viên này đã bị xoá khỏi lớp học</p>
                                                    }
                                                    {
                                                        attendance.student?.name
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        attendance.student?.studentCode
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        attendance.student?.gender
                                                    }
                                                </TableCell>
                                                <TableCell className={`${classes.TableCellBody} ${classes.TableCellBodyDate}`} align="left">
                                                    <p style={{ width: "100px" }}>
                                                        {
                                                            dayjs(attendance?.date).format("DD-MM-YYYY")
                                                        }
                                                    </p>
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        detailRollCallSession.lesson?.course?.courseCode
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    <FormGroup>
                                                        {
                                                            attendance.student?._id && <FormControlLabel control={!loadingAttendace ? <Checkbox disabled={true} checked={attendance.absent ? false : true} color='secondary' sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} /> : <CircularProgress />} label="Có mặt" />
                                                        }
                                                    </FormGroup>
                                                </TableCell>

                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div> : <TableContainer className={classes.TableContainer} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.TableCellHead} align="left">Họ và tên</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">MSSV</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Giới tính</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Ngày</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Học phần</TableCell>
                                        <TableCell className={classes.TableCellHead} align="left">Điểm danh</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        detailRollCallSession.attendanceDetails?.map((attendance) => {
                                            return <TableRow
                                                key={attendance._id}
                                                className="detail__row"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        !attendance.student?._id && <p style={{ color: "crimson" }}>Sinh viên này đã bị xoá khỏi lớp học</p>
                                                    }
                                                    {
                                                        attendance.student?.name
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        attendance.student?.studentCode
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        attendance.student?.gender
                                                    }
                                                </TableCell>
                                                <TableCell className={`${classes.TableCellBody} ${classes.TableCellBodyDate}`} align="left">
                                                    <p style={{ width: "100px" }}>
                                                        {
                                                            dayjs(attendance?.date).format("DD-MM-YYYY")
                                                        }
                                                    </p>
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    {
                                                        detailRollCallSession.lesson?.course?.courseCode
                                                    }
                                                </TableCell>
                                                <TableCell className={classes.TableCellBody} align="left">
                                                    <FormGroup>
                                                        {
                                                            attendance.student?._id && <FormControlLabel control={!loadingAttendace ? <Checkbox disabled={true} checked={attendance.absent ? false : true} color='secondary' sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} /> : <CircularProgress />} label="Có mặt" />
                                                        }
                                                    </FormGroup>
                                                </TableCell>

                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </div>

                {/* Dialog Controll Attendance */}
                {
                    !detailRollCallSession.end ? <Dialog
                        open={openControlAttendace}
                        onClose={handleCloseDialogControlAttendance}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Box padding={2}>
                            <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                                <h2 className="modal__heading">Chọn cách thức điêm danh</h2>
                            </Box>
                            <DialogActions>
                                <PrimaryTooltip title="Điểm danh thủ công bằng tay">
                                    <Button color="success" variant='contained' onClick={() => { setHandmade(1); handleCloseDialogControlAttendance(false) }}>
                                        <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-table'></i>  <p className="button-text">Điểm danh thủ công</p>
                                    </Button>
                                </PrimaryTooltip>
                                <PrimaryTooltip title="Điểm danh tự động bằng khuôn mặt" >
                                    <Button color="info" variant='contained' onClick={() => { setHandmade(2); handleCloseDialogControlAttendance(false); handleOpenCamera() }}>
                                        <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-user-circle'></i>  <p className="button-text">Điểm danh tự động</p>
                                    </Button>
                                </PrimaryTooltip>
                            </DialogActions>
                        </Box>
                    </Dialog> : <></>
                }
            </div>
        </div>

    )
}

export default RollCallSessionDetail