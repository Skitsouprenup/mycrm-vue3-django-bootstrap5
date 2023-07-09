import axios from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import { leadFormData } from './leadInput'
import formError from '../forms/formError'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const addLead = (
    formData: leadFormData,
    emit: Function,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router
) => {
    isLoading.value = true

    const connect = async () => {
        axios.post('/api/v1/leads/', formData)
        .then((response) => {
            isLoading.value = false

            if(response.status === 201) {
                router.push('/dashboard/leads')
                emit('set-app-modal-msg', 'Lead Added!', 
                    'Lead has been added successfully!')
            }
            else {
                isLoading.value = false
                errors.value.push(`Status code: ${response.status}`)
            }
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

export default addLead