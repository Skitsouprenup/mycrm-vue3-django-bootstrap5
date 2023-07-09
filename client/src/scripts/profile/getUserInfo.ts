import { Ref } from 'vue'
import { unknownObjectType } from '../utilities/ObjectProperty'
import axios from 'axios'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const getUserInfo = (
    id: string, 
    userInfo: Ref<unknownObjectType>,
    message: Ref<string>) => {
    
    const connect = async () => {
        axios.get(`/api/v1/teams/member/${id}/`)
        .then((response) => {
            message.value = ''
            userInfo.value = response.data
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                message.value = "Can't Fetch Data!"
                console.error(e)
            }
        })
    }
    connect()
}

export default getUserInfo