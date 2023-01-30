import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../../utils/interface'
import { toast } from 'react-toastify'
import { ALERT } from '../../../store/types/alertTypes'
import GlobalLoading from '../global-loading/GlobalLoading'
const Alert = () => {
    const dispatch = useDispatch()
    const { alert } = useSelector((state: RootStore) => state)

    const hanldeCloseToast = () => {
        dispatch({ type: ALERT, payload: { ...alert, success: "", error: "" } })
    }

    const handleShowToastSuccess = (msg: string) => {
        toast.success(msg, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onClose: hanldeCloseToast
        })
    }

    const handleShowToastError = (msg: string) => {
        toast.error(msg, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onClose: hanldeCloseToast
        })
    }

    useEffect(() => {
        if (typeof alert.success === "string") {
            alert.success && handleShowToastSuccess(alert.success as string)
        } else {
            alert.success?.map(msg => {
                return handleShowToastSuccess(msg)
            })
        }
    }, [alert.success])

    useEffect(() => {
        if (typeof alert.error === "string") {
            alert.error && handleShowToastError(alert.error as string)
        } else {
            alert.error?.map(msg => {
                return handleShowToastError(msg)
            })
        }
    }, [alert.error])

    return <>
        {alert.loading && <GlobalLoading />}
    </>

}

export default Alert;
