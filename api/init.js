import axios from 'axios'
import cookies from 'js-cookie'
axios.defaults.baseURL = process.env.API_URL

import { setAuthToken, resetAuthToken } from '~/utils/auth'
const token = cookies.get('x-access-token')

if (token) setAuthToken(token)
else resetAuthToken()
