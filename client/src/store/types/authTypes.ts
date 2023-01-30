import { User } from '../../utils/interface'
export const AUTH = 'AUTH'

export interface AuthPayload {
    user?: User
    access_token?: string
}

export interface AuthType {
    type: typeof AUTH
    payload: AuthPayload
}