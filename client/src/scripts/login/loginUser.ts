import axios, { AxiosError } from "axios"
import { Ref } from "vue"
import { Router } from "vue-router"
import formError from "../forms/formError"
import { accountStoreType } from "../../store/types/accountstoretype"


const loginUser = (
    formData: { [index: string] : string },
    isLoading: Ref<boolean>,
    errors: Ref<string[]>,
    router: Router,
    accountStore: accountStoreType
) => {
    isLoading.value = true
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('token')

    axios.post('api/v1/jwt/create/', formData).
    then(response => {
        if(response.status === 200) {
            let accessToken = response.data.access
            let refreshToken = response.data.refresh
            axios.defaults.headers
                    .common['Authorization'] = `JWT ${accessToken}`
            
            axios.get('/api/v1/users/me/')
            .then(async (response) => {
                accountStore.setAccessToken(accessToken)
                accountStore.setRefreshToken(refreshToken)
                accountStore.setUser({
                    id: response.data.id, 
                    name: response.data.username
                })

                await axios.get('/api/v1/teams/myteam')
                    .then((response) => {
                        
                        if(response.status === 200) {
                            accountStore.setTeam({
                                id: response.data.id.toString(),
                                name: response.data.name
                            })
                            accountStore.setTeamPlan({
                                max_leads: response.data.plan.max_leads,
                                max_clients: response.data.plan.max_clients,
                                plan_name: response.data.plan.name
                            })
                        }
                    })
                    .catch((e) => {
                        formError(e, errors)
                    })
                isLoading.value = false
                router.replace('/')
            })
            .catch((e) => {
                axios.defaults.headers
                    .common['Authorization'] = ''
                isLoading.value = false
                formError(e, errors)
                accessToken = ''
                refreshToken = ''
            })

        } else {
            isLoading.value = false
            console.error(`Status code: ${response.status}`)
        }
    }).
    catch((e : AxiosError) => {
        isLoading.value = false
        formError(e, errors)
    })
}

export default loginUser
