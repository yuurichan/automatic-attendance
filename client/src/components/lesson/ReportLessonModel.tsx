import React from 'react'
import { Attendance, LessonDetail as ILessonDetail, LessonDetail, RootStore } from '../../utils/interface'
import "./ReportLessonModel.scss"
import { Link } from 'react-router-dom'
import { countAbsent } from '../../utils/student'
import ReportLessonModelDetails from './ReportLessonModelDetail'
import ExportReportLessonButton from './ExportReportLessonButton'
import { useSelector } from 'react-redux'

// Chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { modelStyleWidth800 } from '../../utils/model-style'
import { IconButton } from '@mui/material';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",
    },
});

interface ReportLessonModelProps {
    lessonDetail: ILessonDetail
}

// Char JS
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportLessonModel: React.FC<ReportLessonModelProps> = ({ lessonDetail }) => {

    const classes = useStyles();
    const { auth } = useSelector((state: RootStore) => state);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const countTotalAbsent = (lessonDetail: LessonDetail, isAbsent: boolean) => {
        let total = 0;
        lessonDetail.rollCallSessions?.forEach((_rollCallSession) => {
            total += countAbsent(_rollCallSession.attendanceDetails as Attendance[], isAbsent)
        })
        return total
    }

    const data = {
        labels: [` ${countTotalAbsent(lessonDetail, false)} Có mặt`, `${countTotalAbsent(lessonDetail, true)} Vắng`],
        datasets: [
            {
                label: '# of Votes',
                data: [countTotalAbsent(lessonDetail, false), countTotalAbsent(lessonDetail, true)],
                backgroundColor: [
                    'rgba(77, 63, 206, 1)',
                    'rgba(217, 76, 76, .9)',
                ],
            },
        ],
    };

    return (
        <div className="lesson-report">
            <div className="lesson-report__button">
                <PrimaryTooltip title="Tạo khoá học">
                    <Button onClick={handleOpen} variant='contained' className={classes.Button}>
                        <i style={{ fontSize: "1.8rem", marginRight: "5px", marginTop: "-2px" }} className='bx bxs-report'></i>Thống kê theo lớp
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
                        lessonDetail.rollCallSessions && lessonDetail.rollCallSessions?.length > 0 ? <>
                            <p style={{ fontSize: "1.8rem", fontWeight: "600", textAlign: "center", color: "#473fce" }}>
                                Buổi điểm danh: {lessonDetail?.rollCallSessions?.length} buổi
                            </p>
                            <div className="lesson-report__body">
                                <Box height={'300px'} width={'300px'} margin={"20px auto"}>
                                    <Doughnut data={data} />
                                </Box>
                            </div>
                        </> : <Box display={'flex'} alignItems={"center"} justifyContent={'center'} flexDirection={'column'} >
                            <img className="lesson-report__empty-img" src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1649922972/nienluannganh/roll-call-session-empty_n6bbwp.png" alt='empty-rcs'></img>
                            <h3 className="lesson-report__empty-title">Chưa có buổi điểm danh nào được tạo</h3>
                        </Box>
                    }
                    {
                        lessonDetail.rollCallSessions && lessonDetail.rollCallSessions?.length > 0 ? <Box display={'flex'}>
                            <ReportLessonModelDetails lessonDetail={lessonDetail} />

                            {
                                auth.user?._id === lessonDetail.lesson?.teacher?._id && <div style={{ marginLeft: "10px" }}>
                                    <ExportReportLessonButton lessonDetail={lessonDetail} />
                                </div>
                            }

                        </Box> : <Box display={'flex'} justifyContent={"flex-end"}>
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

export default ReportLessonModel