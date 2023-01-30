import { RollCallSession } from '../../utils/interface'

export const CREATE_ROLL_CALL_SESSION = "CREATE_ROLL_CALL_SESSION"
export const GET_ROLL_CALL_SESSION_USER = "GET_ROLL_CALL_SESSION_USER"


export interface RollCallSessionPayload {
    rollCallSessions?: RollCallSession[]
}

interface CreateRollCallSession {
    type: typeof CREATE_ROLL_CALL_SESSION,
    payload: {
        rollCallSession: RollCallSession
    }
}

interface getRollCallSessionUser{
    type: typeof GET_ROLL_CALL_SESSION_USER,
    payload: {
        rollCallSessions: RollCallSession[]
    }
}

export type RollCallSessionType = CreateRollCallSession | getRollCallSessionUser