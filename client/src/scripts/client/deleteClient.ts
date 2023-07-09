import axios from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import { showToast } from '../appToast'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const deleteClient = (
    clientId: string,
    isLoading: Ref<boolean>,
    router: Router,
) => {
    isLoading.value = true
    
    const connect = async () => {
        axios.delete(`/api/v1/clients/delete/${clientId}`)
        .then((response) => {
            if(response.status === 200) {
                showToast('Client Deleted', 'Client has been successfully deleted!')
                router.push('/dashboard/clients')
            }
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
            
        })
    }
    connect()
}

export default deleteClient