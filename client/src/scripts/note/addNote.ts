import axios from 'axios'
import { Ref } from 'vue'
import { Router } from 'vue-router'
import formError from '../forms/formError'
import { unknownObjectType } from '../utilities/ObjectProperty'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const addNote = (
    formData: unknownObjectType,
    emit: Function,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router,
    clientID: string,
) => {
    isLoading.value = true
    formData.client_id = clientID

    const connect = async () => {
        axios.post('/api/v1/notes/', formData)
        .then((response) => {
            isLoading.value = false

            if(response.status === 201) {
                router.push(`/dashboard/clients/${clientID}`)
                emit('set-app-modal-msg', 'Note Added!', 
                    'Note has been added successfully!')
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

export default addNote