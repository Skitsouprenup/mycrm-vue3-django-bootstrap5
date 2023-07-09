<template>
    <div class="container-lg mb-3">
        <h1 class="mb-3 mt-3">Add Team</h1>

        <form @submit.prevent="submitForm">
            <div class="mb-3" v-for="input in teamInputData">
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
    import { ref, reactive } from 'vue'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import { useRouter } from 'vue-router'
    import FormError from '../../FormError.vue'
    import { checkBlankInputs } from '../../../scripts/forms/checkblankinputs'
    import addTeam from '../../../scripts/team/addTeam'
    import { setInputValue } from '../../../scripts/forms/formInput'

    const router = useRouter()
    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const emit = defineEmits(['set-app-modal-msg'])
    const errors = ref<string[]>([])

    const teamInputData = [
        { id: 'team', label: 'Team Name', type: 'text', model: 'name' },
    ]

    const formData : {[index: string] : string | number} = reactive({
        name: ''
    })

    const goToLeads = (event: Event) => {
        event.preventDefault()
        router.push('/dashboard/leads')
    }

    const submitForm = () => {
        errors.value = []
        if(!checkBlankInputs(
            [{ 
                input: formData.name ? true : false, 
                inputName: 'Team Name',
            }], errors)) {
            addTeam(formData, emit, isLoading, errors, router)
        }
    }

</script>

<style scoped>

</style>