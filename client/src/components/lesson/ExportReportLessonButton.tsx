import React from 'react'
import { LessonDetail, Attendance } from '../../utils/interface'
import { CSVLink } from "react-csv";
import dayjs from 'dayjs'
import { countAbsent } from '../../utils/student'
// MUI
import { Button } from '@mui/material'
import PrimaryTooltip from '../globals/tool-tip/Tooltip';
import { makeStyles } from '@mui/styles';

interface ExportReportLessonButtonProps {
    lessonDetail: LessonDetail
}

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

// Dem tong so cacs sinh vien vang hoc hoac co hoc
const countTotalAbsent = (lessonDetail: LessonDetail, isAbsent: boolean) => {
    let total = 0;
    lessonDetail.rollCallSessions?.forEach((_rollCallSession) => {
        total += countAbsent(_rollCallSession.attendanceDetails as Attendance[], isAbsent)
    })
    return total
}

const transformDataToCsv = (lessonDetail: LessonDetail) => {


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

    const line8 = ['Tổng: ', countTotalAbsent(lessonDetail, true) + countTotalAbsent(lessonDetail, false)]
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

    data.push(['------------ CHI TIẾT CÁC BUỔI ĐIỂM DANH ------------'])
    lessonDetail?.rollCallSessions?.forEach((_rollCallSession, index) => {
        data.push([`------------ Buổi ${++index} ------------`])
        data.push([`${_rollCallSession.end ? "Đã kết thúc" : "Chưa kết thúc"}`])
        data.push(['Ngày', `${dayjs(_rollCallSession?.createdAt).format('DD/MM/YYYY')}`])
        data.push(['Mô tả', _rollCallSession?.comment as string])

        data.push(['Mã số sinh viên', 'Họ và tên', 'Giới tính', 'Vắng', 'Có mặt', 'Ghi chú', 'Số điện thoại'])
        _rollCallSession.attendanceDetails?.forEach((_attendanceDetail) => {
            data.push([`${_attendanceDetail.student?.studentCode}`, `${_attendanceDetail.student?.name}`, `${_attendanceDetail.student?.gender}`,
            `${_attendanceDetail.absent ? 'x' : ""}`, `${_attendanceDetail.absent ? '' : "x"}`, `${_attendanceDetail.note}`, `${_attendanceDetail.student?.phone ? _attendanceDetail.student?.phone : ""}`])
        })

        // Ngat 2 dong
        data.push([''])
        data.push([''])

    })

    return data;
}

const ExportReportLessonButton: React.FC<ExportReportLessonButtonProps> = ({ lessonDetail }) => {

    const classes = useStyles();

    const data = transformDataToCsv(lessonDetail)

    return <PrimaryTooltip title="Tạo khoá học">
        <Button type="submit" variant='contained' className={classes.Button}>
            <CSVLink target="_blank" data={data} download={`lesson_${lessonDetail.lesson?.course?.name}_${lessonDetail.lesson?.course?.courseCode}_${dayjs(lessonDetail.lesson?.createdAt).format("DD-MM-YYYY")}.csv`}>
                <i style={{ fontSize: "1.8rem", marginRight: "5px", marginTop: "2px" }} className='bx bxs-file-export'></i>Xuất File
            </CSVLink>
        </Button>
    </PrimaryTooltip>
}

export default ExportReportLessonButton