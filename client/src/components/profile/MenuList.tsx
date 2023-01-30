import React, { useState, SetStateAction, Dispatch } from 'react'
import { Course, RootStore } from '../../utils/interface';
import { deleteCourse } from '../../store/actions/courseActions';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
// MUI
import Menu from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Loading from '../globals/loading/Loading'
import { Button } from '@mui/material'
interface MenuProps {
    classes?: any,
    handleEditCourse: (course: Course) => void,
    course?: any
}

const MenuList: React.FC<MenuProps> = ({ classes, handleEditCourse, course }) => {


    const dispatch = useDispatch()
    const { auth, profile } = useSelector((state: RootStore) => state)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState<any>({});
    const [loadingDeleteCourse, setLoadingDeleteCourse] = useState<string>('');

    const editCourse = () => {
        handleEditCourse(course)
        setAnchorEl(null);
    }

    const hanldeDeleteCourse = async (course_id: string) => {
        setLoadingDeleteCourse(course_id);
        await dispatch(deleteCourse(course_id, auth, profile))
        setLoadingDeleteCourse("")
    }

    const handleClickOpenDialog = (course_id: string) => {
        setAnchorEl(null);
        setOpenDialog({
            [`setOpen-${course_id}`]: true
        });
    };

    const handleCloseDialog = (course_id: string) => {
        setOpenDialog({
            [`setOpen-${course_id}`]: false
        });
    };

    return (
        <React.Fragment>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                className={classes.Menu}
            >
                <Link to={`/course/${course._id}`} style={{ textDecoration: 'none', color: 'currentcolor' }}>
                    <MenuItem className={classes.MenuItem} onClick={() => setAnchorEl(null)}>
                        <InfoIcon className={classes.MenuIcon} /> Chi tiết
                    </MenuItem>
                </Link>
                <MenuItem onClick={() => editCourse()} className={classes.MenuItem}>
                    <EditIcon className={classes.MenuIcon} /> Chỉnh sửa
                </MenuItem >
                <MenuItem className={`${classes.MenuItem} ${classes.MenuItemDelete}`} onClick={() => handleClickOpenDialog(course._id as string)}>
                    <DeleteIcon className={`${classes.MenuIcon} ${classes.MenuIconDelete}`} /> Xoá
                </MenuItem>
            </Menu>
            <Dialog
                open={openDialog ? openDialog[`setOpen-${course._id as string}`] ? openDialog[`setOpen-${course._id as string}`] : false : false}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <h3 className='modal__heading' style={{ margin: "16px" }}>
                    Bạn có chắc muốn xoá môn học này!
                </h3>
                <DialogActions>
                    <Button variant='contained' onClick={() => handleCloseDialog(course._id as string)} color='error'>
                        <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                            Huỷ xoá
                        </p>
                    </Button>
                    <Button variant='contained' onClick={() => hanldeDeleteCourse(course._id as string)} className={classes.Button}>
                        {
                            loadingDeleteCourse === course._id ?
                                <>
                                    <Loading type='small' />
                                    <span style={{ marginLeft: "2px", textTransform: 'capitalize', display: 'block' }}>đang xoá...</span>
                                </> :
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

export default MenuList