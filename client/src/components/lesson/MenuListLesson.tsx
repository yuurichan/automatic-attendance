import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Lesson } from '../../utils/interface'
import { deleteLesson } from '../../store/actions/lessonActions'
import { AuthPayload } from '../../store/types/authTypes'

// MUI
import { Button } from '@mui/material'
import Menu from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Loading from '../globals/loading/Loading'
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../globals/tool-tip/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import LessonFormModal from './LessonFormModal';

const useStyle = makeStyles({
    Menu: {
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px - 1px rgb(0 0 0 / 0.1) !important",
    },
    MenuItem: {
        fontSize: "1.4rem !important",
        fontFamily: "Inter !important",
        fontWeight: "500 !important",
        color: "#1e293b",
        height: "40px !important",
        transition: "all 0.1s ease-in-out",
        "&:hover": {
            backgroundColor: "#473fce !important",
            color: "#fff !important",
            "& svg": {
                fill: "#fff !important",
            }
        }
    },
    MenuItemDelete: {
        // color: "crimson !important"
    },
    MenuIcon: {
        color: "rgb(91, 100, 112) !important",
        marginRight: "5px !important",
    },
    MenuIconDelete: {
        color: "crimson"
    },
    Button: {
        fontSize: "1.2rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "10px !important",

    },
})

interface MenuListLessonProps {
    auth: AuthPayload,
    lesson: Lesson
}

const MenuListLesson: React.FC<MenuListLessonProps> = ({ auth, lesson }) => {

    const classes = useStyle();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = React.useState<any>({});
    const [loadingDeleteLesson, setLoadingDeleteLesson] = useState<boolean>(false);
    const openMenu = Boolean(anchorEl);

    const handleClickOpenDialog = (lesson_id: string) => {
        setOpenDialog({
            [`setOpen-${lesson_id}`]: true
        });
        handleClose();
    };

    const handleCloseDialog = (lesson_id: string) => {
        setOpenDialog({
            [`setOpen-${lesson_id}`]: false
        });;
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const hanldeClickOpenModal = () => {
        handleClose()
        setOpenModal(true)
    }

    const hanldeDeleteLesson = async (lesson_id: string) => {
        setLoadingDeleteLesson(true)
        await dispatch(deleteLesson(lesson_id, auth));
        setLoadingDeleteLesson(false)
    }

    return (
        <React.Fragment>
            <IconButton
                id="basic-button"
                aria-controls={openMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <PrimaryTooltip title="chỉnh sửa buổi học" placement="right">
                    <MenuItem className={classes.MenuItem} onClick={hanldeClickOpenModal}>
                        <EditIcon className={classes.MenuIcon} /> Chỉnh sửa
                    </MenuItem >
                </PrimaryTooltip>
                <PrimaryTooltip title="xoá buổi học" placement="right">
                    <MenuItem onClick={() => handleClickOpenDialog(lesson._id as string)} className={classes.MenuItem}>
                        <DeleteIcon className={`${classes.MenuIcon} ${classes.MenuIconDelete}`} /> Xoá
                    </MenuItem >
                </PrimaryTooltip>
                <PrimaryTooltip title="đóng" placement="right">
                    <MenuItem onClick={handleClose} className={classes.MenuItem}>
                        <CloseIcon className={`${classes.MenuIcon} ${classes.MenuIconDelete}`} /> Đóng
                    </MenuItem >
                </PrimaryTooltip>
            </Menu>
            <LessonFormModal open={openModal} setOpen={setOpenModal} onEdit={lesson} />
            {/* Dialog confirm delete lesson */}
            <Dialog
                open={openDialog ? openDialog[`setOpen-${lesson._id as string}`] ? openDialog[`setOpen-${lesson._id as string}`] : false : false}
                onClose={() => handleCloseDialog(lesson._id as string)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                keepMounted
            >
                <h3 className='modal__heading' style={{ margin: "16px" }}>
                    Bạn có chắc muốn xoá buổi học này!
                </h3>
                <DialogActions>
                    <Button variant='contained' onClick={() => handleCloseDialog(lesson._id as string)} color='error'>
                        <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                            Huỷ xoá
                        </p>
                    </Button>
                    <Button variant='contained' onClick={() => hanldeDeleteLesson(lesson._id as string)} className={classes.Button}>
                        {
                            loadingDeleteLesson ? <><Loading type='small' /> <p style={{ textTransform: "initial", marginLeft: "10px" }}>Đang xoá...</p></> :
                                <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                    Đồng ý
                                </p>
                        }

                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default MenuListLesson