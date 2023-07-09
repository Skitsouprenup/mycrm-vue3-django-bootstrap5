<template>
    <div class="container-lg">
        <h1 class="mt-2">Plans</h1>
        <div class="d-flex flex-wrap flex-row-reverse justify-content-center gap-3">
            <div 
                class="box d-flex flex-column flex-fill"
                v-for="plan in plans">
                <h2>{{ plan.name as string }} 
                    <span v-if="plan.name === $route.params.plan_name">
                        (Active)
                    </span>
                </h2>
                <h3>$ {{ plan.price as string }}</h3>
                <div class="d-flex flex-column gap-1 mb-2">
                    <span><b>Max Leads: </b>{{ plan.max_leads }}</span>
                    <span><b>Max Clients: </b>{{ plan.max_clients }}</span>
                </div>
                <button 
                    v-if="plan.name === $route.params.plan_name && 
                          plan.name !== 'Free'"
                    class="btn btn-secondary"
                    @click="preCancelPlan">
                    Cancel Plan
                </button>
                <button 
                    :class="['btn', 
                    plan.name === 'Free' ? 'btn-primary' : 'btn-success']"
                    @click="plan.name === 'Free' ? 
                        preChoosePlan(plan.name as string) : 
                        choosePlan(plan.name as string)" 
                    :disabled="$route.params.plan_name === 'Free' 
                               && plan.name === 'Free' ? true : false"
                    v-else>
                    {{ $route.params.plan_name === 'Free' 
                       && plan.name === 'Free' ? 'Current Plan' : 'Choose Plan' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
import { cancelSubscription, getPlans, 
         getStripePubKey, 
         stripeCheckOut } from '../../../scripts/team/planoperations'
import useAccountStore from '../../../store/useAccountStore'
import { storeToRefs } from 'pinia'
import { Stripe } from '@stripe/stripe-js'
import { useRouter } from 'vue-router'
import modalConfirm from '../../../scripts/utilities/modalConfirm'

const plans: Ref<unknownObjectType[] | null> = ref(null)
const stripePubKey = ref('')
const planName = ref('')
const accountStore = useAccountStore()
const { isLoading } = storeToRefs(accountStore)
const stripeInstance : Ref<Stripe | null> = ref(null)
const router = useRouter()

const choosePlan = (plan: string) => {
    if(plan !== 'Free') stripeCheckOut(plan, stripeInstance)
    //cancelSubscription method delete subscription and set the plan to 
    //'Free'
    else cancelSubscription(isLoading, accountStore.setTeamPlan, router)
}

const preChoosePlan = (plan: string) => {
    planName.value = plan
    modalConfirm('Switch to Free Plan?', 
                 'Switching to free plan removes your paid plan.'+
                 ' Do you really wanna switch plan?', 
                 'choosePlan', 
                 confirmChoices)
}

const preCancelPlan = () => {
    modalConfirm('Cancel Plan?', 
                 ' Do you really wanna cancel your subscription?', 
                 'cancelPlan', 
                 confirmChoices)
}

const confirmChoices = (choice: string) => {

    switch(choice) {
        case 'choosePlan':
            choosePlan(planName.value)
            break
        case 'cancelPlan':
            cancelSubscription(isLoading, accountStore.setTeamPlan, router)
            break
    }
}

onMounted(async () => {
    await getStripePubKey(stripePubKey, isLoading, stripeInstance)
    getPlans(plans as Ref<unknownObjectType[]>, isLoading)
})
</script>

<style scoped>
.box {
  border: 1px solid lightgray;
  padding: 10px;
  box-shadow: 5px 10px lightgrey;
}
</style>