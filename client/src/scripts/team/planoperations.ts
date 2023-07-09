import axios from 'axios'
import { Ref } from 'vue'
import { unknownObjectType } from '../utilities/ObjectProperty'
import { showToast } from '../appToast'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Router } from 'vue-router'
import { refreshTokenWithStatus } from '../utilities/refreshToken'

export const stripeCheckOut = (
    plan: string,
    stripeInstance: Ref<Stripe | null>
) => {
    const connect = async () => {
        axios.post('/api/v1/stripe/checkout/plan', { plan })
        .then((response) => {
            if(response.status === 200) {
                if(stripeInstance.value) {
                    stripeInstance.value.redirectToCheckout(
                        { sessionId: response.data.sessionId }
                    )
                }
            }
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    connect()
}

export const getStripePubKey = async (
    keyRef: Ref<string>,
    isLoading: Ref<boolean>,
    stripeInstance: Ref<Stripe | null>,
) => {

    isLoading.value = true
    const connect = async () => {
        await axios.get('/api/v1/stripe/key/public')
        .then(async (response) => {
            if(response.status === 200) {
                keyRef.value = response.data.key
                stripeInstance.value = await loadStripe(response.data.key)
            }
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    connect()
}

export const getPlans = (
    plans: Ref<unknownObjectType[]>,
    isLoading: Ref<boolean>,
) => {

    isLoading.value = true
    const connect = async () => {
        axios.get('/api/v1/teams/plans')
        .then((response) => {
            if(response.status === 200) {
                plans.value = response.data
            }
            isLoading.value = false
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    connect()
}

export const cancelSubscription = (
    isLoading: Ref<boolean>,
    setTeamPlan: Function,
    router: Router,
) => {
    isLoading.value = true

    const connect = async () => {
        axios.put('/api/v1/stripe/subscription/cancel')
        .then((response) => {
            if(response.status === 200) {
                setTeamPlan({
                    max_leads: response.data.max_leads,
                    max_clients: response.data.max_clients,
                    plan_name: response.data.name
                })
                router.push('/dashboard/team/view/members')
            }
            isLoading.value = false
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
                showToast('Error!', 'Unexpected error occured!')
            }
        })
    }
    connect()
}

export const checkSubscription = (
    sessionId: string,
    isLoading: Ref<boolean>,
    setTeamPlan: Function
) => {

    isLoading.value = true
    /*
        Note: session_id is not used in the backend.
        Could be useful in the future
    */
    const connect = async () => {
        axios.post('/api/v1/stripe/subscription', {
            'session_id': sessionId
        })
        .then((response) => {
            if(response.status === 201) {
                setTeamPlan({
                    max_leads: response.data.max_leads,
                    max_clients: response.data.max_clients,
                    plan_name: response.data.name
                })
    
                showToast('Plan changed!', 
                'Your team plan has been successfully changed!')
            }
            isLoading.value = false
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                showToast('Error!', 'Unexpected error occured!')
                console.error(e)
            }
        })
    }
    connect()
}