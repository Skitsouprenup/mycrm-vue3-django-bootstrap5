import axios, { AxiosError } from 'axios'
import useAccountStore from '../../store/useAccountStore'

export const refreshToken = async (callback?: () => void) : Promise<AxiosError | null> => {
    let error = null
    const refreshToken = localStorage.getItem('refreshToken')

    if(!refreshToken) return error

    await axios.post('api/v1/jwt/refresh/', { refresh: refreshToken })
    .then((response) => {
        if(response.status === 200) {
            const accountStore = useAccountStore()
            accountStore.setAccessToken(response.data.access)
            axios.defaults.headers.common['Authorization'] = 
                'JWT ' + response.data.access
            if(callback)
                callback()
        }
    })
    .catch((e) => {
        error = e
    })

    return error
}

export const refreshTokenWithStatus = async (
    msg: string, 
    callback: () => Promise<void>
) => {
    if(msg === 'token_not_valid') {
        const error = await refreshToken()

        if(error) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('teamInfo')
            localStorage.removeItem('teamPlanInfo')
            location.reload()
        }
        else await callback()
    }
}