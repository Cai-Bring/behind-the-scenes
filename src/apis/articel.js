import axios from '@/utiles/myaxios.js'

export const getarticle = (params) => {
    return axios({
        url: '/post',
        params
    })
}

// 获取栏目
export const getCateList = () => {
    return axios({
        url: '/category'
    })
}

// 文章发布
export const publishPost = (data) => {
    return axios({
        method: 'post',
        url: '/post',
        data
    })
}