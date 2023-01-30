import { RollCallSession } from '../../utils/interface'
export const GET_ROLL_CALL_SESSION_DETAIL = "GET_ROLL_CALL_SESSION_DETAIL"
export const LOADING_ROLL_CALL_SESSION_DETAIL = "LOADING_ROLL_CALL_SESSION_DETAIL"
export const UPDATE_ROLL_CALL_SESSION_DETAIL = "UPDATE_ROLL_CALL_SESSION_DETAIL"

export interface RollCallSessionDetailPayload {
    rollCallSessions?: RollCallSession[]
    loading?: boolean
}

interface GetRollCallSessionDetail {
    type: typeof GET_ROLL_CALL_SESSION_DETAIL,
    payload: {
        rollCallSession: RollCallSession
    }
}

interface LoadingRollCallSessionDetail {
    type: typeof LOADING_ROLL_CALL_SESSION_DETAIL,
    payload: {
        loading: boolean
    }
}

interface UpdateRollCallSessionDetail {
    type: typeof UPDATE_ROLL_CALL_SESSION_DETAIL,
    payload: {
        rollCallSession: RollCallSession
    }
}

export type RollCallSessionDetailType = GetRollCallSessionDetail | LoadingRollCallSessionDetail | UpdateRollCallSessionDetail