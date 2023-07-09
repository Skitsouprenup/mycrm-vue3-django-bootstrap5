import { Ref } from 'vue'
import axios from 'axios'
import { Router } from 'vue-router'
import { showToast } from '../appToast'
import formError from '../forms/formError'
import { profileFormData } from './profileInput'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

const editUserInfo = (
    id: string,
    userInfo: profileFormData,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router) => {

    isLoading.value = true
    const connect = async () => {
        axios.put(`/api/v1/teams/member/${id}/`, userInfo)
        .then(() => {
            isLoading.value = false
            showToast('Profile Edited', 'Your profile has been successfully edited!')
            router.push(`/`)
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

export default editUserInfo