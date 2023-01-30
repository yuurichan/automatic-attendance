import React from 'react'
import { StudentReport, LessonDetail, Attendance } from '../../utils/interface'
import { Button } from '@mui/material'
import PrimaryTooltip from '../globals/tool-tip/Tooltip';
import { makeStyles } from '@mui/styles';
import { CSVLink } from "react-csv";
import dayjs from 'dayjs'
import { countAbsent } from "../../utils/student"

const useStyles = makeStyles({
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        "& a": {
            // textDecoration: 'none',
            color: "inherit",
            textDecoration: "none",
            marginTop: "2px"

        }
    },
});
interface ExportReportStudentProps {
    studentReport: StudentReport[]
    lessonDetail: LessonDetail
}

// Dem tong so cacs sinh vien vang hoc hoac co hoc
const countTotalAbsent = (lessonDetail: LessonDetail, isAbsent: boolean) => {
    let total = 0;
    lessonDetail.rollCallSessions?.forEach((_rollCallSession) => {
        total += countAbsent(_rollCallSession.attendanceDetails as Attendance[], isAbsent)
    })
    return total
}

const transfromData = (studentReport: StudentReport[], lessonDetail: LessonDetail) => {
    const line1 = [
        "Môn học",
        `${lessonDetail?.lesson?.course?.name?.toUpperCase()}`,
    ];

    const line2 = [
        "Mã học phần",
        `${lessonDetail?.lesson?.course?.courseCode?.toUpperCase()}`,
    ];

    const line3 = [
        "Giáo viên",
        `${lessonDetail?.lesson?.teacher?.name} (${lessonDetail?.lesson?.teacher?.account})`,
    ];

    const line4 = [
        `${lessonDetail?.lesson?.weekday}`,
    ];

    const line5 = [
        "Giờ bắt đầu",
        `${dayjs(lessonDetail.lesson?.timeStart).format("hh:mm a")}`,
    ];

    const line6 = [
        "Giờ kết thúc",
        `${dayjs(lessonDetail.lesson?.timeEnd).format("hh:mm a")}`,
    ];

    const line7 = [
        "Mô tả",
        `${lessonDetail.lesson?.desc ? lessonDetail.lesson?.desc : "Buổi học không có nhận xét"}`,
    ];

    const line8 = ['Tổng số lần điểm danh: ', countTotalAbsent(lessonDetail, true) + countTotalAbsent(lessonDetail, false)]
    const line9 = ['Vắng học: ', `${countTotalAbsent(lessonDetail, true)} sinh viên`]

    const line10 = ['Có mặt: ', `${countTotalAbsent(lessonDetail, false)} sinh viên`]

    // Push to data
    const data = [
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
        line10
    ];

    // Ngat 2 dong
    data.push([''])
    data.push([''])
    data.push(['------- Thống kê điểm danh sinh viên -------'])

    data.push(['MSSV', 'Họ và tên', 'Tổng các buổi học (buổi)', 'Có mặt (buổi)', 'vắng (buổi)', 'Tỉ lệ vắng (%)'])
    studentReport.forEach((_report) => {
        data.push([`${_report.student.studentCode}`, `${_report.student.name}`, `${_report.absent + _report.isStudy}`, `${_report.isStudy}`, `${_report.isStudy}`, `${(_report.absent / (_report.absent + _report.isStudy)) * 100}%`])
    })

    return data;
}

const ExportReportStudent: React.FC<ExportReportStudentProps> = ({ studentReport, lessonDetail }) => {
    const classes = useStyles();

    const data = transfromData(studentReport, lessonDetail);

    return <PrimaryTooltip title="Tạo khoá học">
        <Button type="submit" variant='contained' className={classes.Button}>
            <CSVLink target="_blank" data={data} download={`${lessonDetail.lesson?.course?.name}_${lessonDetail.lesson?.course?.courseCode}_${dayjs(lessonDetail.lesson?.createdAt).format("DD-MM-YYYY")}.csv`}>
                <i style={{ fontSize: "1.8rem", marginRight: "5px", marginTop: "2px" }} className='bx bxs-file-export'></i>Xuất File
            </CSVLink>
        </Button>
    </PrimaryTooltip>
}

export default ExportReportStudent