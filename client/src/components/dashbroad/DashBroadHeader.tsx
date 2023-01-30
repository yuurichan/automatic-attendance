import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { SideBarType, TOGGLE } from '../../store/types/sidebarTypes'
import { RootStore } from '../../utils/interface';

const DashBroadHeader = () => {

    const { sidebar } = useSelector((state: RootStore) => state);
    const dispatch: Dispatch<SideBarType> = useDispatch();

    const handleToggleSideBar = () => {
        dispatch({ type: TOGGLE, payload: { open: sidebar.open ? false : true } })
    }

    return <div className="dashbroad__header">
        <i className='bx bx-menu btn-circle' onClick={handleToggleSideBar}></i>
    </div>;
};

export default DashBroadHeader;
