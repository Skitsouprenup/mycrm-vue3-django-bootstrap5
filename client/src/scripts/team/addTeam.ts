import axios from "axios"
import { Ref } from "vue"
import { Router } from "vue-router"
import formError from "../forms/formError"
import useAccountStore from "../../store/useAccountStore"
import { refreshTokenWithStatus } from "../utilities/refreshToken"


const addTeam = (
    formData: { [index: string] : string | number },
    emit: Function,
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router
) => {
    isLoading.value = true

    const connect = async () => {
        axios.post('/api/v1/teams/', formData)
        .then(() => {
            axios.get('/api/v1/teams/myteam')
            .then((response) => {
                isLoading.value = false
                const accountStore = useAccountStore()
                accountStore.setTeam({
                    id: response.data.id.toString(),
                    name: response.data.name,
                })
                router.replace('/')
                emit('set-app-modal-msg', 'Team Added!', 
                     'Team has been added successfully!')
            })
            .catch((e) => {
                isLoading.value = false
                formError(e, errors)
            })
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

export default addTeam