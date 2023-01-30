import React, { useState } from 'react';
import { Student, RootStore, Course } from '../../utils/interface';
import Loading from '../../components/globals/loading/Loading';
import { useDispatch, useSelector } from 'react-redux'
import { deleteStudent } from '../../store/actions/courseActions'
// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StudentFormModal from './StudentFormModal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

interface StudentTableProps {
    students?: Student[]
    course?: Course
}

const useStyles = makeStyles({
    TableContainer: {
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important",
        backgroundColor: "",
        maxHeight: "500px",
    },
    TableCellHead: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "600 !important"
    },
    TableCellHeadAction: {
        width: "50px !important",
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
        maxWidth: "150px",
        WebkitLineClamp: "1",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    Button: {
        fontSize: "1rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",
        minWidth: "50px !important",

    },
});

const StudentTable: React.FC<StudentTableProps> = ({ course, students }) => {

    const dispatch = useDispatch()
    const { auth, lessonDetail, detailRollCallSession } = useSelector((state: RootStore) => state)
    const classes = useStyles()
    const [openModalForm, setOpenModalForm] = useState<boolean>(false)
    const [onEdit, setOnEdit] = useState<Student | null>({});
    const [openDialog, setOpenDialog] = useState<any>({});
    const [loadingDeleteStudent, setLoadingDeleteStudent] = useState<boolean>();

    const handleOpenModalForm = (student: Student | null) => {
        setOnEdit(student)
        setOpenModalForm(true)
    }

    const handleOpenDialogDeleteStudent = (student_id: string) => {
        setOpenDialog({
            [`setOpen-${student_id}`]: true
        });
    };

    const handleCloseDialogDeleteStudent = (student_id: string) => {
        setOpenDialog({
            [`setOpen-${student_id}`]: false
        });
    };

    // Xoa sinh vien
    const hanldeDeleteStudent = async (student_id: string) => {
        setLoadingDeleteStudent(true)
        await dispatch(deleteStudent(student_id, auth, students as Student[], course as Course, lessonDetail, detailRollCallSession))
        setLoadingDeleteStudent(false)
    }


    return <TableContainer component={Paper} className={classes.TableContainer} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell className={classes.TableCellHead}>Mã số sinh viên</TableCell>
                    <TableCell className={classes.TableCellHead} align="left">Họ và Tên</TableCell>
                    <TableCell className={classes.TableCellHead} align="left">Giới tính</TableCell>
                    <TableCell className={classes.TableCellHead} align="left">Số điện thoại</TableCell>
                    <TableCell className={`${classes.TableCellHead} ${classes.TableCellHeadAction}`} align="center">Chỉnh sửa</TableCell>
                    <TableCell className={`${classes.TableCellHead} ${classes.TableCellHeadAction}`} align="center">Xoá</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {students && students.map((student) => (
                    <TableRow
                        key={student._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="left" className={classes.TableCellBody}>{student.studentCode}</TableCell>
                        <TableCell align="left" className={classes.TableCellBody}>{student.name}</TableCell>
                        <TableCell align="left" className={classes.TableCellBody}>{student.gender}</TableCell>
                        <TableCell align="left" className={classes.TableCellBody}>{student.phone}</TableCell>

                        <TableCell align="center" className={classes.TableCellBody}>
                            {
                                auth.user?._id === course?.teacher?._id && <Button onClick={() => handleOpenModalForm(student)} className={classes.Button} variant='contained'>
                                    <EditIcon />
                                </Button>
                            }
                        </TableCell>
                        <TableCell align="center" className={classes.TableCellBody}>
                            {
                                auth.user?._id === course?.teacher?._id &&
                                <Button onClick={() => handleOpenDialogDeleteStudent(student._id as string)} className={classes.Button} variant='contained' color='error'>
                                    <DeleteIcon />
                                </Button>
                            }
                        </TableCell>
                        {/* Dialog confirm delete student */}
                        <Dialog
                            open={openDialog ? openDialog[`setOpen-${student._id as string}`] ? openDialog[`setOpen-${student._id as string}`] : false : false}
                            onClose={handleCloseDialogDeleteStudent}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <h3 className='modal__heading' style={{ margin: "16px" }}>
                                Bạn có chắc muốn xoá sinh viên: <span style={{ color: "#473fce" }}>{student.name}</span>
                            </h3>
                            <DialogActions>
                                <Button variant='contained' onClick={() => handleCloseDialogDeleteStudent(student._id as string)} color='error'>
                                    <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                        Huỷ xoá
                                    </p>
                                </Button>
                                <Button variant='contained' onClick={() => hanldeDeleteStudent(student._id as string)} className={classes.Button}>
                                    {
                                        loadingDeleteStudent ? <Loading type='small' /> :
                                            <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                                Đồng ý
                                            </p>
                                    }
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {/* Form Student */}
        <StudentFormModal course={course} open={openModalForm} hanldeSetOpen={setOpenModalForm} onEdit={onEdit} setOnEdit={setOnEdit} />
    </TableContainer>
        ;
}

export default StudentTable