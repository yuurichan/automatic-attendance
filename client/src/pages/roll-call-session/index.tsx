import React from 'react'
import { RootStore } from '../../utils/interface'
import { useSelector } from 'react-redux'
import DashBroadUser from '../../components/dashbroad/DashBroadUser'
import RollCallSessionBody from '../../components/roll-call-session/RollCallSessionBody'

const RollCallSession = () => {

    const { auth } = useSelector((state: RootStore) => state)

    return (
        <div>
            <DashBroadUser auth={auth} />
            <RollCallSessionBody />
        </div>
    )
}

export default RollCallSession