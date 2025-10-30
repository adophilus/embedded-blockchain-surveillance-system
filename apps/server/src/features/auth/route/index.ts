import { Hono } from 'hono'
import GetUserProfileRoute from './profile'
import SignInRoute from './sign-in'
import SignUpRoute from './sign-up'
import LogoutRoute from './logout'

const AuthRouter = new Hono()
  .route('/sign-in', SignInRoute)
  .route('/sign-up', SignUpRoute)
  .route('/profile', GetUserProfileRoute)
  .route('/logout', LogoutRoute)

export default AuthRouter
