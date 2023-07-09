import { Ref } from "vue"
import { Router } from "vue-router"
import axios from "axios"
import formError from "../forms/formError"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

const addTeamMember = (
    formData: { [index: string] : string | number },
    emit: Function,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router,
) => {
    const connect = async () => {
        axios.post('/api/v1/teams/add/member', formData)
        .then((response) => {
            isLoading.value = false
            if(response.status === 204) {
                router.replace('/')
                emit('set-app-modal-msg', 'Team Member Added!', 
                    'Member has been added successfully!')
            }
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                formError(e, errors)
            }
        })
    }
    connect()
}

export default addTeamMember