<template>
    <div class="container-lg mb-3">
        <h1 class="mb-3 mt-3">Add Lead</h1>

        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in leadInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="formData[input.model]"
                    @input="
                        setInputValue(formData, input.model, $event.target)"
                    :min="input.type === 'number' ? 0 : undefined"
                    :disabled="isLoading" />
            </div>

            <LeadSelections 
                v-model:status="formData.status"
                v-model:priority="formData.priority"/>
            <FormError :errors="errors"/>

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
                        @click="goToLeads">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import { leadFormData, leadInputData } from '../../../scripts/lead/leadInput'
    import checkBlankLeadInputs from '../../../scripts/lead/checkBlankLeadInputs'
    import addLead from '../../../scripts/lead/addLead'
    import FormError from '../../FormError.vue'
    import LeadSelections from './addlead/LeadSelections.vue'
    import { useRouter } from 'vue-router'
    import { setInputValue } from '../../../scripts/forms/formInput'
    import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const router = useRouter()

    const formData : unknownObjectType = reactive({
        company: '',
        contact_person: '',
        email: '',
        phone: '',
        website: '',
        assigned_to: '',
        confidence: 0,
        estimated_value: 0,
        status: 'new',
        priority: 'low',
    })
    
    const goToLeads = (event: Event) => {
        event.preventDefault()
        router.push('/dashboard/leads')
    }

    const submitForm = () => {
        errors.value = []
        if(!checkBlankLeadInputs(formData as leadFormData, errors)) 
            addLead(formData as leadFormData, emit, isLoading, errors, router)
    }
    
</script>

<style scoped></style>