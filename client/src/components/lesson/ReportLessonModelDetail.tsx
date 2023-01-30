import React from 'react'
import { Attendance, LessonDetail as ILessonDetail, LessonDetail } from '../../utils/interface'
import "./ReportLessonModel.scss"
import { Link } from 'react-router-dom'
import { countAbsent } from '../../utils/student'
import dayjs from 'dayjs'

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { modelStyleWidth1000 } from '../../utils/model-style'
import { IconButton } from '@mui/material';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import { makeStyles } from '@mui/styles'

// Chart JS
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const useStyles = makeStyles({
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",
    },
});

interface ReportLessonDetailModelProps {
    lessonDetail: ILessonDetail
}

const ReportLessonModelDetails: React.FC<ReportLessonDetailModelProps> = ({ lessonDetail }) => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Chart JS
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chi tiết các buổi điểm danh',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Sinh viên'
                },
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 1
                }
            },
        },
    };


    const labels = lessonDetail.rollCallSessions?.map((_rollCallSession) => {
        return `Ngày ${dayjs(_rollCallSession.createdAt).format("DD-MM-YYYY ")}`
    });

    const data = {
        labels,
        datasets:
            [
                {
                    label: 'Có mặt',
                    data: lessonDetail.rollCallSessions?.map(_rollCallSession => {
                        return countAbsent(_rollCallSession.attendanceDetails ? _rollCallSession.attendanceDetails : [], false)
                    }),
                    backgroundColor: 'rgba(77, 63, 206, 1)',
                    barPercentage: 0.5
                },
                {
                    label: 'Vắng',
                    data: lessonDetail.rollCallSessions?.map(_rollCallSession => {
                        return countAbsent(_rollCallSession.attendanceDetails ? _rollCallSession.attendanceDetails : [], true)
                    }),
                    backgroundColor: 'rgba(217, 76, 76, .9)',
                    barPercentage: 0.5
                },
            ],
    };

    return <div className="lesson-report__detail">
        <div className="lesson-report__button" >
            <PrimaryTooltip title="Tạo khoá học">
                <Button onClick={handleOpen} type="submit" variant='contained' className={classes.Button}>
                    <i style={{ fontSize: "1.8rem", marginRight: "5px", marginTop: "-2px" }} className='bx bx-line-chart'></i>Chi tiết
                </Button>
            </PrimaryTooltip>
        </div >
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modelStyleWidth1000}>
                <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                    <h2 className="lesson-report__header">
                        <Link style={{ textDecoration: "none", color: "inherit" }} to={`/course/${lessonDetail?.lesson?.course?._id}`}>
                            {lessonDetail?.lesson?.course?.name} <span>#{lessonDetail?.lesson?.course?.courseCode}</span>
                            <br />({lessonDetail?.rollCallSessions?.length} buổi)
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
                <div className="lesson-report__body">
                    <Box height={'400px'} width={'80%'} margin={"20px auto"}>
                        <Bar options={options} data={data} />
                    </Box>
                </div>
            </Box>
        </Modal>
    </div >
}

export default ReportLessonModelDetails