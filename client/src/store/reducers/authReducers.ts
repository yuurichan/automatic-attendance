import { AUTH, AuthPayload, AuthType } from '../types/authTypes'
const authReducer = (state: AuthPayload = {}, action: AuthType): AuthPayload => {
    switch (action.type) {
        case AUTH: return action.payload
        default: return state;
    }
}

export default authReducer