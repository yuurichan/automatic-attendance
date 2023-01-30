import { ALERT, AlertPayload, AlertType } from '../types/alertTypes'

const alertReducer = (state: AlertPayload = {}, action: AlertType): AlertPayload => {
    switch (action.type) {
        case ALERT: return action.payload;
        default: return state
    }
}
export default alertReducer