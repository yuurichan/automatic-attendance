import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import './AttendanceDetailRow.scss'
import { Attendance, RollCallSession, InputChange, FormSubmit, RootStore } from '../../utils/interface';
import { useSelector, useDispatch } from 'react-redux'
import { updateAttendanceDetail } from '../../store/actions/rollCallSession'
import { ALERT } from '../../store/types/alertTypes'
import { putAPI } from '../../utils/fetchApi';
// MUI
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button'
import PrimaryToolTip from '../globals/tool-tip/Tooltip'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

interface AttendanceDetailRowProps {
    detailRollCallSession: RollCallSession
    attendance: Attendance
}

const useStyles = makeStyles({
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

const AttendanceDetailRow: React.FC<AttendanceDetailRowProps> = ({ attendance, detailRollCallSession }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { detailRollCallSession: detailRollCallSessionStore, auth, lessonDetail } = useSelector((state: RootStore) => state)
    const [note, setNote] = useState<string>('');
    const [loadingAttendace, setLoadingAttendace] = useState<boolean>(false);
    const [loadingNote, setLoadingNote] = useState<boolean>(false);
    

    // Diem danh sinh vien
    const handleAttendance = async (e: InputChange, attendance: Attendance) => {

        if (loadingAttendace) return;

        setLoadingAttendace(true);
        try {
            const data = {
                absent: !attendance.absent
            }

            await putAPI(`attendance_detail/${attendance._id}`, data, auth.access_token)
            dispatch({ type: ALERT, payload: { success: "Điểm danh thành công" } })
            setLoadingAttendace(false)

            const newAttendanceDetails = detailRollCallSession.attendanceDetails?.map((_attendanceDetail) => {
                return _attendanceDetail._id === attendance._id ? { ...attendance, absent: !attendance.absent } : _attendanceDetail
            })

            dispatch(updateAttendanceDetail({ ...detailRollCallSession, attendanceDetails: newAttendanceDetails }, auth, detailRollCallSessionStore, lessonDetail))

        } catch (error: any) {
            setLoadingAttendace(false)
            dispatch({ type: ALERT, payload: { error: error.response.dât.msg } })
        }
    }

    const handleSubmitNote = async (e: FormSubmit) => {
        e.preventDefault();
        if (note === "") return;
        setLoadingNote(true);
        try {

            const data = {
                note
            }

            await putAPI(`attendance_detail/${attendance._id}`, data, auth.access_token)
            setLoadingNote(false);
            dispatch({ type: ALERT, payload: { success: "Lưu thành công" } })


            const newAttendanceDetails = detailRollCallSession.attendanceDetails?.map((_attendanceDetail) => {
                return _attendanceDetail._id === attendance._id ? { ...attendance, note } : _attendanceDetail
            })

            dispatch(updateAttendanceDetail({ ...detailRollCallSession, attendanceDetails: newAttendanceDetails }, auth, detailRollCallSessionStore, lessonDetail))
        } catch (error: any) {
            setLoadingNote(false);
            dispatch({ type: ALERT, payload: { error: error.response.dât.msg } })
        }

    }


    useEffect(() => {
        if (attendance.note) {
            setNote(attendance.note)
        }
    }, [attendance])

    return <TableRow
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
                    attendance.student?._id && <FormControlLabel control={!loadingAttendace ? <Checkbox disabled={detailRollCallSession.end ? true : false} checked={attendance.absent ? false : true} onChange={(e) => handleAttendance(e, attendance)} color='primary' sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }} /> : <CircularProgress />} label="Có mặt" />
                }
            </FormGroup>
        </TableCell>
        <TableCell className={classes.TableCellBody} align="left">
            <form className="detail__row-note" onSubmit={handleSubmitNote}>
                <div className='note__group'>
                    <textarea disabled={detailRollCallSession.end ? true : false} value={note} rows={3} cols={20} onChange={(e: InputChange) => setNote(e.target.value)}>
                    </textarea>
                    <PrimaryToolTip title="Lưu ghi chú">
                        <Button disabled={detailRollCallSession.end ? true : false} type='submit' color='primary' variant='contained'>
                            {/* {
                                loadingNote && <Loading type='small'>
                                </Loading>
                            } */}
                            <p style={{ textTransform: "capitalize", fontSize: "1.4rem" }}>
                                {
                                    loadingNote ? "Đang luư..." : "Lưu"
                                }
                            </p>
                        </Button>
                    </PrimaryToolTip>
                </div>
            </form>
        </TableCell>

    </TableRow>

}

export default AttendanceDetailRow