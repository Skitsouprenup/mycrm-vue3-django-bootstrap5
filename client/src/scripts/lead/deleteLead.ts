import axios from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import { showToast } from '../appToast'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const deleteLead = (
    leadId: string,
    isLoading: Ref<boolean>,
    router: Router,
) => {
    isLoading.value = true
    const connect = async () => {
        axios.delete(`/api/v1/leads/delete/${leadId}`)
        .then((response) => {
            if(response.status === 200) {
                showToast('Lead Deleted', 'Lead has been successfully deleted!')
                router.push('/dashboard/leads')
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

export default deleteLead