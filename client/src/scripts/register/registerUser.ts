import axios from 'axios'
import { Ref } from 'vue'
import toggleNavbarCollapse from '../toggleNavbarCollapse'
import { Router } from 'vue-router'
import { registerInputDataType } from './setRegisterInputValue'
import formError from '../forms/formError'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const registerUser = (
    formData: registerInputDataType,
    emit: Function,
    isLoading: Ref<boolean>,
    username: string,
    errors: Ref<string[]>,
    router: Router
    ) => {
    isLoading.value = true

    if(formData?.repeat_pass)
        delete formData.repeat_pass

    const connect = async () => {
        axios.post('/api/v1/users/', formData).
        then(response => {
            isLoading.value = false
            if(response.status === 201) {
                router.replace('/login')
                toggleNavbarCollapse()
                emit('set-app-modal-msg', 'Registration Success!', 
                        `${username} is registered successfully!`)
            }
            else {
                isLoading.value = false
                errors.value.push(`Status code: ${response.status}`)
            }
        }).
        catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                isLoading.value = false
                formError(e, errors)
            }
        })
    }
    connect()
}

export default registerUser