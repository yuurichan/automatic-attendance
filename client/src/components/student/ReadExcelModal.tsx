import React, { useState, useRef } from 'react'
import { modelStyle } from '../../utils/model-style'
import "./ReadExcelModal.scss"
import * as XLSX from 'xlsx'
import { Course, Student } from '../../utils/interface'
import nonAccentVietnamese from '../../utils/non-vietnamese'
// MUI 
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles'
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import { IconButton } from '@mui/material';

const useStyles = makeStyles({
    Modal: {
        width: "600px !important"
    },
    Button: {
        fontSize: "1.3rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",


    },
});

interface ReadExcelModalProps {
    handleSetStudent?: React.Dispatch<React.SetStateAction<Student[]>>
    onEdit?: Course | null
    setOnEdit?: React.Dispatch<React.SetStateAction<Course | null>>
}

const ReadExcelModal: React.FC<ReadExcelModalProps> = ({ handleSetStudent }) => {

    const classes = useStyles()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [students, setStudents] = useState<Student[]>([])
    const [file, setFile] = useState<File>();
    const refInput = useRef() as React.MutableRefObject<HTMLInputElement>;

    // Dong form va reset lai file
    const handleClose = () => {
        setOpen(false)
        if (refInput.current) {
            refInput.current.value = "";
        }
    };

    // Doc file 
    const handleChaneFile = (e: any) => {
        try {
            const file = e.target.files[0]
            setFile(file)
            // Bắt đầu đọc nội dung của blobOrFile, một khi hoàn thành,
            // fileReader.result sẽ là một đối tượng ArrayBuffer.
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file)

            fileReader.onload = async (e) => {

                if (e.target) {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: 'buffer' })

                    // console.log(wb)

                    // Lấy SheetNames đầu tiên
                    const wsname = wb.SheetNames[0]

                    const ws = wb.Sheets[wsname]

                    // Chuyển thành array để xử lý
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

                    // Tim STT
                    let stt_top = 0;
                    let index_student_code = -1;
                    let index_student_name = -1;
                    let index_student_gender = -1;

                    data.forEach((item: any, i) => {
                        let index_stt = -1;
                        console.log('Item length: ', item.length)

                        if (item.length !== 0) {

                            index_stt = item.findIndex((_item: any) => {
                                if (typeof _item === 'string')
                                    return _item.toLowerCase() === "stt" || _item.toLowerCase() === "so thu tu"
                            })
                            console.log('Index STT: ', index_stt)


                            if (index_stt !== -1) {
                                if (index_student_code === -1) {
                                    index_student_code = item.findIndex((_item: any) => {
                                        if (typeof _item === 'string') {
                                            return _item.toLowerCase() === "ma sinh vien"
                                                || _item.toLowerCase() === "mssv"
                                                || _item.toLowerCase() === "ma so sinh vien"
                                                || nonAccentVietnamese(_item.toLowerCase()) === "ma sv"
                                        }
                                    })
                                }
                                console.log('Index MSSV: ', index_student_code)


                                if (index_student_name === -1) {
                                    index_student_name = item.findIndex((_item: any) => {
                                        if (typeof _item === 'string') {
                                            return _item.toLowerCase() === "ho va ten"
                                                || _item.toLowerCase() === 'hovaten'
                                                || nonAccentVietnamese(_item.toLowerCase()) === 'ten sinh vien'
                                        }
                                    })
                                }
                                console.log('Index Name: ', index_student_name)

                                if (index_student_gender === -1) {
                                    index_student_gender = item.findIndex((_item: any) => {
                                        if (typeof _item === 'string') {
                                            return nonAccentVietnamese(_item.toLowerCase()) === "phai"
                                        }
                                    })
                                }
                                console.log('Index Gender: ', index_student_gender)
                            }
                        }

                        if (index_stt !== -1) {
                            stt_top = i
                            console.log("STT_TOP: ", stt_top)
                        }
                    })

                    if (data) {
                        if (index_student_code !== -1 && index_student_gender !== -1 && index_student_name !== -1) {
                            const newData: Student[] = [];
                            data.slice(stt_top + 1,).forEach((item: any) => {
                                if (item.length !== 0) {
                                    const student = {
                                        studentCode: item[index_student_code] ? item[index_student_code].trim() : "",
                                        name: item[index_student_name] ? item[+ index_student_name].trim() : '',
                                        gender: item[index_student_gender] ? item[index_student_gender] : 'male'
                                    }
                                    newData.push(student)
                                }
                            })
                            setStudents(newData)
                        }
                    }
                }
            }

        } catch (error: any) {
            console.log(error)
        }
    }

    const hanldeAddStudent = () => {
        if (!file) {
            alert("Vui lòng chọn file excel")
            return;
        }
        if (typeof handleSetStudent === "function") {
            handleSetStudent(students)
            handleClose()
        }
    }

    return (
        <div className='student'>
            <Box mr={1}>
                <PrimaryTooltip title="Thêm sinh viên">
                    <Button onClick={handleOpen} color="info" variant='contained' className={classes.Button}><p style={{ textTransform: "initial" }}>Thêm sinh viên</p></Button>
                </PrimaryTooltip>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                keepMounted={true}

            >
                <Box sx={modelStyle} className={classes.Modal}>
                    <Box display='flex' justifyContent="space-between">
                        <h2 className="modal__heading">Tạo khoá học</h2>
                        <Box>
                            <PrimaryTooltip title='Đóng hộp thoại'>
                                <IconButton size="medium" onClick={handleClose}>
                                    <i className='bx bx-x' style={{ color: "#473fce", fontSize: "2.6rem" }}></i>
                                </IconButton>
                            </PrimaryTooltip>
                        </Box>
                    </Box>
                    <div className="student__file">
                        <input ref={refInput} type="file" accept=".xlsx, .xls, .csv" onChange={handleChaneFile} />
                    </div>
                    <div className='modal__control'>
                        <div>
                        </div>
                        <Box display="flex" justifyContent="flex-end">
                            <Box>
                                <PrimaryTooltip title="Tạo khoá học">
                                    <Button type="submit" variant='contained' onClick={hanldeAddStudent} className={classes.Button}><p style={{ textTransform: "capitalize" }}>Thêm</p></Button>
                                </PrimaryTooltip>
                            </Box>
                        </Box>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}


export default ReadExcelModal