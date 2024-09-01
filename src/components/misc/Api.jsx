import axios from 'axios'
import config from '../../Constants'

const instance = axios.create({
    baseURL: config.API_BASE_URL
})

function authenticate(email, password) {
    return instance.post('auth/login', { email, password }, {
      headers: { 'Content-type': 'application/json' }
    })
}

function signUp(user){
    return instance.post('auth/signup',user,{
        headers: { 'Content-Type': 'application/json' }
    })
}
export const calendarizeApi = {
    authenticate,
    signUp
}