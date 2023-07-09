import axios from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import formError from '../forms/formError'
import { clientFormData } from './clientInput'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const addClient = (
    formData: clientFormData,
    emit: Function,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router
) => {
    isLoading.value = true

    const connect = async () => {
        axios.post('/api/v1/clients/', formData)
        .then(async (response) => {

            if(response.status === 201) {
                isLoading.value = false
                router.push('/dashboard/clients')
                emit('set-app-modal-msg', 'Client Added!', 
                        'Client has been added successfully!')
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

export default addClient