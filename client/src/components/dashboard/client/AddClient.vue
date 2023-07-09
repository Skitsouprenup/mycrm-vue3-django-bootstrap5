<template>
    <div class="container-lg mb-3">
        <h1 class="mb-3 mt-3">Add Client</h1>

        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in clientInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="clientData[input.model]"
                    @input="
                        setInputValue(clientData, input.model, $event.target)"
                    :min="input.type === 'number' ? 0 : undefined"
                    :disabled="isLoading" />
            </div>
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
                        @click="goToClients">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { clientFormData, clientInputData } from '../../../scripts/client/clientInput'
    import { setInputValue } from '../../../scripts/forms/formInput'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import FormError from '../../FormError.vue'
    import { useRouter } from 'vue-router'
    import addClient from '../../../scripts/client/addClient'
    import checkBlankClientInputs from '../../../scripts/client/checkBlankClientInputs'
    import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const router = useRouter()

    const clientData : unknownObjectType = reactive({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        website: '',
    })
    
    const goToClients = (event: Event) => {
        event.preventDefault()
        router.push('/dashboard/clients')
    }

    const submitForm = () => {
        errors.value = []
        if(!checkBlankClientInputs(clientData as clientFormData, errors)) {
            addClient(
                clientData as clientFormData, 
                emit, 
                isLoading, 
                errors, 
                router,
            )
        }
    }
    
</script>

<style scoped></style>