import { Ref } from "vue"
import { leadFormData } from "./leadInput"
import axios from "axios"
import { Router } from "vue-router"
import formError from "../forms/formError"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

export const patchLeadById = (
    id: string, 
    isLoading: Ref<boolean>,
    lead: Ref<leadFormData | null>,
    errors: Ref<string[]>,
    router: Router,
    emit: Function,
) => {
    isLoading.value = true
    
    const connect = async () => {
        axios.patch(`/api/v1/leads/${id}/`, lead.value)
        .then(() => {
            isLoading.value = false
            router.push(`/dashboard/leads/${id}`)
            emit('set-app-modal-msg', 'Lead Edit Success!', 
                'Lead has been edited successfully!')
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                formError(e, errors)
            }
        })
    }
    connect()
}