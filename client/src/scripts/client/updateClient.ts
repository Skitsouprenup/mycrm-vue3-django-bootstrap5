import { Ref } from "vue"
import axios from "axios"
import { Router } from "vue-router"
import formError from "../forms/formError"
import { unknownObjectType } from "../utilities/ObjectProperty"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

export const patchClientById = (
    id: string, 
    isLoading: Ref<boolean>,
    client: Ref<unknownObjectType | null>,
    errors: Ref<string[]>,
    router: Router,
    emit: Function,
) => {
    isLoading.value = true
    
    const connect = async () => {
        axios.patch(`/api/v1/clients/${id}/`, client.value)
        .then(() => {
            isLoading.value = false
            router.push(`/dashboard/clients/${id}`)
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