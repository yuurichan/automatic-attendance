import React from 'react'
import { useSelector } from 'react-redux'
import CourseBody from '../../components/course/CourseBody'
import DashBroadUser from '../../components/dashbroad/DashBroadUser'
import { RootStore } from "../../utils/interface"

const Course = () => {

    const { auth } = useSelector((state: RootStore) => state)


    return (
        <div className='course'>
            <DashBroadUser auth={auth} />
            <CourseBody />
        </div>
    )
}

export default Course