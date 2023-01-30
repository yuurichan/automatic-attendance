import { TOGGLE, SideBarPayload, SideBarType } from '../types/sidebarTypes'
const sidebarReducer = (state: SideBarPayload = { open: false }, action: SideBarType): SideBarPayload => {
    switch (action.type) {
        case TOGGLE: return action.payload
        default: return state;
    }
}

export default sidebarReducer