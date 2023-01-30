import React, { useEffect, useState } from 'react'
import { LessonDetail as ILessonDetail, StudentReport, RootStore } from '../../utils/interface'
import "./ReportLessonModel.scss"
import { Link } from 'react-router-dom'
import "./ReportStudentModel.scss"
import { useSelector } from 'react-redux'


// Chart


// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { modelStyleWidth800 } from '../../utils/model-style'
import { IconButton } from '@mui/material';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ExportReportStudent from './ExportReportStudent'

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
        fontSize: "1.5rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "500 !important",
    },
    TableCellBodyAbsent: {
        color: "crimson !important",

    },
    TableCellBodyIsStudy: {
        color: "#473fce !important"
    },
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",
    },
});

interface ReportStudentModelProps {
    lessonDetail: ILessonDetail
}
const ReportStudentModel: React.FC<ReportStudentModelProps> = ({ lessonDetail }) => {

    const classes = useStyles();
    const { auth } = useSelector((state: RootStore) => state)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [studentsReport, setStudentsReport] = useState<StudentReport[]>([]);

    useEffect(() => {

        const studentsArray: StudentReport[] = [];

        lessonDetail.lesson?.course?.students?.forEach((student) => {
            let absent = 0;
            let isStudy = 0;

            lessonDetail.rollCallSessions?.forEach((rollCallSession) => {
                rollCallSession.attendanceDetails?.forEach((attendanceDetail) => {
                    if ((student._id === attendanceDetail.student?._id || student._id === attendanceDetail.student) && attendanceDetail.absent === true) {
                        absent += 1;
                    }
                    if ((student._id === attendanceDetail.student?._id || student._id === attendanceDetail.student) && attendanceDetail.absent === false) {
                        isStudy += 1;
                    }
                })
            })

            studentsArray.push({ student, absent, isStudy })

        })
        setStudentsReport(studentsArray)


    }, [lessonDetail])


    return (
        <div className="lesson-report">
            <div className="lesson-report__button">
                <PrimaryTooltip style={{ marginLeft: "15px" }} title="Tạo khoá học">
                    <Button onClick={handleOpen} variant='contained' className={classes.Button}>
                        <i style={{ fontSize: "1.8rem", marginRight: "5px", marginTop: "-2px" }} className='bx bxs-contact'></i>Thống kê sinh viên
                    </Button>
                </PrimaryTooltip>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modelStyleWidth800}>
                    <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                        <h2 className="lesson-report__header">
                            <Link style={{ textDecoration: "none", color: "inherit" }} to={`/course/${lessonDetail?.lesson?.course?._id}`}>
                                {lessonDetail?.lesson?.course?.name} <span>#{lessonDetail?.lesson?.course?.courseCode}</span>
                            </Link>
                        </h2>
                        <Box>
                            <PrimaryTooltip title='Đóng hộp thoại'>
                                <IconButton size="medium" onClick={handleClose}>
                                    <i className='bx bx-x' style={{ color: "#473fce", fontSize: "2.6rem" }}></i>
                                </IconButton>
                            </PrimaryTooltip>
                        </Box>
                    </Box>
                    {
                        lessonDetail.rollCallSessions && lessonDetail.rollCallSessions?.length > 0 ? <div className="student-report">
                            <p style={{ fontSize: "1.8rem", fontWeight: "600", textAlign: "center", color: "#473fce" }}>
                                Tổng các buổi điểm danh: {lessonDetail?.rollCallSessions?.length} buổi
                            </p>
                            <div className='student-report__table'>
                                <TableContainer component={Paper} className={classes.TableContainer}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.TableCellHead}>MSSV</TableCell>
                                                <TableCell className={classes.TableCellHead} align="left">Họ và tên</TableCell>
                                                <TableCell className={classes.TableCellHead} align="center">
                                                    <PrimaryTooltip title="Có trong danh sách môn học (Thêm vào sau)">
                                                        <p>
                                                            Tổng các buổi học (buổi)
                                                        </p>
                                                    </PrimaryTooltip>
                                                </TableCell>
                                                <TableCell className={classes.TableCellHead} align="center">Có mặt (buổi)</TableCell>
                                                <TableCell className={classes.TableCellHead} align="center">Vắng (buổi)</TableCell>
                                                <TableCell className={classes.TableCellHead} align="center">Tỉ lệ vắng (%)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {
                                                studentsReport && studentsReport.map((_student, index) => {
                                                    return <TableRow
                                                        key={index}
                                                    >
                                                        <TableCell className={classes.TableCellBody} >
                                                            {
                                                                _student.student.studentCode
                                                            }
                                                        </TableCell>
                                                        <TableCell className={classes.TableCellBody} align="left">
                                                            {
                                                                _student.student.name
                                                            }
                                                        </TableCell>
                                                        <TableCell className={classes.TableCellBody} align="center">
                                                            {
                                                                _student.absent + _student.isStudy
                                                            }
                                                        </TableCell>
                                                        <TableCell className={`${classes.TableCellBody} ${classes.TableCellBodyIsStudy}`} align="center">
                                                            Có mặt: {_student.isStudy}
                                                        </TableCell>
                                                        <TableCell className={`${classes.TableCellBody} ${classes.TableCellBodyAbsent}`} align="center">
                                                            Vắng: {_student.absent}
                                                        </TableCell>
                                                        <TableCell className={`${classes.TableCellBody} ${classes.TableCellBodyAbsent}`} align="center">
                                                            {(_student.absent !== 0) ? Math.round((_student.absent / (_student.absent + _student.isStudy)) * 100) : 0}%
                                                        </TableCell>

                                                    </TableRow>
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </div>
                        </div>
                            : <Box display={'flex'} alignItems={"center"} justifyContent={'center'} flexDirection={'column'} >
                                <img className="lesson-report__empty-img" src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1649922972/nienluannganh/roll-call-session-empty_n6bbwp.png" alt='empty-rcs'></img>
                                <h3 className="lesson-report__empty-title">Chưa có buổi điểm danh nào được tạo</h3>
                            </Box>
                    }
                    {
                        lessonDetail.rollCallSessions && lessonDetail.rollCallSessions?.length > 0 ? <>
                            {
                                lessonDetail.lesson?.teacher?._id === auth.user?._id && <ExportReportStudent studentReport={studentsReport} lessonDetail={lessonDetail} />
                            }
                        </> :
                            <Box display={'flex'} justifyContent={"flex-end"}>
                                <PrimaryTooltip title='Đóng hộp thoại'>
                                    <Button onClick={handleClose} variant='contained'>
                                        <p className='button-text'>
                                            Đóng
                                        </p>
                                    </Button>
                                </PrimaryTooltip>
                            </Box>
                    }

                </Box>
            </Modal>
        </div>
    )
}

export default ReportStudentModel