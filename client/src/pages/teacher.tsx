import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import NotFound from '../components/globals/not-found/NotFound';
import { RootStore } from '../utils/interface'
import DashBroadUser from '../components/dashbroad/DashBroadUser';
import TeacherCp from '../components/teacher/teacher/Teacher';
import { getTeachers } from '../store/actions/teacherActions'

const Teacher = () => {

    const dispatch = useDispatch();
    const { auth } = useSelector((state: RootStore) => state)

    useEffect(() => {
        if (auth.access_token) {
            dispatch(getTeachers(auth.access_token))
        }
    }, [dispatch, auth.access_token])

    // Không phải admin thì không được vào router này
    if (auth.user?.role !== "admin") return <NotFound />

    return <div className="dashbroad">
        <DashBroadUser auth={auth} />
        <TeacherCp />
    </div>;
};

export default Teacher;
