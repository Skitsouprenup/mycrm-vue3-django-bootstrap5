<template>
    <div class="container-lg mb-3">
        <h1 class="mb-3 mt-3">Add Member</h1>
        <form @submit.prevent="submitForm">
            <div class="mb-3" v-for="input in inputData">
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
                        @click="goToTeams">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import useAccountStore from '../../../store/useAccountStore'
    import FormError from '../../FormError.vue'
    import addTeamMember from '../../../scripts/team/addTeamMember'
    import { checkBlankInputs } from '../../../scripts/forms/checkblankinputs'
    import { setInputValue } from '../../../scripts/forms/formInput'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const router = useRouter()

    const goToTeams = (event: Event) => {
        event.preventDefault()
        router.push('/dashboard/team/view/members')
    }

    const inputData = [
        { id: 'email', label: 'E-mail', type: 'text', model: 'email' },
    ]
    const formData : { [index: string] : string | number } = reactive({
        email: '',
    })

    const submitForm = () => {
        errors.value = []
        if(!checkBlankInputs([
            { input: formData.email ? true : false, inputName: 'E-mail' },
        ], errors)) 
            addTeamMember(formData, emit, isLoading, errors, router)
    }

</script>

<style scoped></style>