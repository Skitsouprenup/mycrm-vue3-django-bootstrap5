<template>
    <div
        class="loadingDiv" 
        v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg mt-3 mb-3" v-else>
        <h1 class="mb-3">Edit {{ companyName }}</h1>
        <form @submit.prevent="submitForm" autocomplete="on">

            <div class="mb-3" v-for="input in leadInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    autocomplete="on"
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="getLeadItem(input.model).toString()"
                    @input="
                        setLeadInput(input.model, $event.target)"
                    :min="input.type === 'number' ? 0 : undefined"
                    :disabled="isLoading" />
            </div>

            <LeadSelections 
                :status="getLeadItem('status').toString()"
                @update:status="
                    setLeadSelectionInput('status', $event)"
                :priority="getLeadItem('priority').toString()"
                @update:priority="
                    setLeadSelectionInput('priority', $event)"/>
            <FormError :errors="errors" />

            <div 
                class="spinner-border" role="status"
                style="width: 3rem; height: 3rem;"
                v-if="isLoading">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="w-100" v-else>
                <div class="inline-flex">
                    <button type="submit" class="btn btn-primary me-1">Submit</button>
                    <button 
                        class="btn btn-light ms-1"
                        @click="goToLead">Cancel</button>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, onMounted } from 'vue';
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import LeadSelections from './addlead/LeadSelections.vue'
    import FormError from '../../FormError.vue'
    import { leadFormData, leadInputData } from '../../../scripts/lead/leadInput'
    import checkBlankLeadInputs from '../../../scripts/lead/checkBlankLeadInputs'
    import { getLeadById } from '../../../scripts/lead/getlead'
    import { useRoute, useRouter } from 'vue-router'
    import { patchLeadById } from '../../../scripts/lead/updatelead'
    import { getRefFormObjProperty, 
             unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
    import { setInputValueRef } from '../../../scripts/forms/formInput'

    const companyName = ref('')

    const accountStore = useAccountStore()
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const { isLoading } = storeToRefs(accountStore)
    const message = ref('Loading...')
    const route = useRoute()
    const router = useRouter()
    const lead : Ref<unknownObjectType | null> = ref(null)

    const goToLead = (event: Event) => {
        event.preventDefault()
        router.push(`/dashboard/leads/${route.params.id}`)
    }

    const getLeadItem = (key: string) => {
        return getRefFormObjProperty(lead, key)
    }
    
    const setLeadSelectionInput = (state: string, message: string) => {
        if(lead?.value) {
            lead.value[state] = message
        }
    }

    const setLeadInput = (state: string, element: EventTarget | null) => {
        setInputValueRef(lead, state, element)
    }
    onMounted(() => 
        getLeadById(
            route.params.id as string, 
            message, 
            lead as Ref<leadFormData | null>,
            companyName))

    const submitForm = () => {
        errors.value = []
        //Make sure lead.value is not null or else this will break
        //lead must be initialized bedore accessing
        if(!checkBlankLeadInputs(lead.value as leadFormData, errors)) {
            patchLeadById(
                route.params.id as string, 
                isLoading, 
                lead as Ref<leadFormData | null>, 
                errors, 
                router, 
                emit)
        }
    }
</script>

<style scoped></style>