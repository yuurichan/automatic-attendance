
import { Route, Redirect } from 'react-router-dom'

const PrivateRouter = (props: any) => {
    const firstLogin = localStorage.getItem('first-login')
    return firstLogin ? <Route {...props} /> : <Redirect to="/" />
}

export default PrivateRouter
