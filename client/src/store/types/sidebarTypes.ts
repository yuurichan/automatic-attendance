
export const TOGGLE = 'TOGGLE'

export interface SideBarPayload {
    open?: boolean
}

export interface SideBarType {
    type: typeof TOGGLE
    payload: SideBarPayload
}