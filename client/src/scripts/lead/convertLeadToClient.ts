import axios from 'axios'
import { Router } from 'vue-router'
import { showToast } from '../appToast'
import { Ref } from 'vue'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const convertLeadToClient = (
    leadId: string, 
    leadName: string, 
    router: Router,
    isLoading: Ref<boolean>) => {
    const data = {
        lead_id: leadId
    }

    isLoading.value = true
    const connect = async () => {
        axios.post('/api/v1/convert_lead_to_client/', data)
        .then(() => {
            isLoading.value = false
            showToast('Conversion Success', 
                    `${leadName} has been successfully converteted to client!`)
            router.push('/dashboard/clients')
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

export default convertLeadToClient