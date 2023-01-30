import * as types from '../types/rollCallSessionTypes'
import { RollCallSessionType, RollCallSessionPayload } from '../types/rollCallSessionTypes'

const initialState: RollCallSessionPayload = {
    rollCallSessions: []
}

const rollCallSessionReducer = (state: RollCallSessionPayload = initialState, action: RollCallSessionType): RollCallSessionPayload => {
    switch (action.type) {
        case types.CREATE_ROLL_CALL_SESSION: {
            return {
                ...state,
                rollCallSessions: state.rollCallSessions ? [{ ...action.payload.rollCallSession }, ...state.rollCallSessions] : []
            }
        }
        case types.GET_ROLL_CALL_SESSION_USER: {
            return {
                ...state,
            }
        }
    
        default:
            return {
                ...state
            }
    }
}

export default rollCallSessionReducer;
