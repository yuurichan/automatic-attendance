import React, { useEffect } from 'react'
import LessonBody from '../../components/lesson/LessonBody'
import DashBroadUser from '../../components/dashbroad/DashBroadUser'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/interface'
import { getLessons } from '../../store/actions/lessonActions'

const Lesson = () => {

    const dispatch = useDispatch();
    const { auth } = useSelector((state: RootStore) => state)

    useEffect(() => {
        dispatch(getLessons(auth))
    }, [dispatch, auth])

    return (
        <div className="lesson">
            <DashBroadUser auth={auth} />
            <LessonBody />
        </div>
    )
}

export default Lesson