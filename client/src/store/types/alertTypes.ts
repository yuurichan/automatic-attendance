export const ALERT = "ALERT"

export interface AlertPayload {
    loading?: boolean
    success?: string | string[]
    error?: string | string[]
}

export interface AlertType {
    type: typeof ALERT,
    payload: AlertPayload
}