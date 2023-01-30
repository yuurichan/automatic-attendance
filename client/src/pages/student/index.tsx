import React from 'react'
import { useSelector } from 'react-redux'
import DashBroadUser from '../../components/dashbroad/DashBroadUser'
import { RootStore } from "../../utils/interface"
import StudentBody from '../../components/student/StudentBody'

const Student = () => {

    const { auth } = useSelector((state: RootStore) => state)

    return (
        <div className='student'>
            <DashBroadUser auth={auth} />        
            <StudentBody />    
        </div>
    )
}

export default Student