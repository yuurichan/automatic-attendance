import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRollCallSessionUser } from '../../store/actions/rollCallSession'
import { RootStore } from '../../utils/interface'

const RollCallSessionBody = () => {

    const dispatch = useDispatch()
    const { auth } = useSelector((state: RootStore) => state);

    useEffect(() => {
        if(auth){
            dispatch(getRollCallSessionUser(auth))
        }
    }, [auth])

    return (
        <div className="dashbroad__body rollcallsession__body">

        </div>
    )
}

export default RollCallSessionBody