import axios from '@/utiles/myaxios.js'

export const login = (data) => {
    return axios({
        method: 'post',
        url: '/login',
        data
    })
}