<template>
    <div class="container-lg mt-3 mb-3 ">
        <h1 class="mb-3">Signup</h1>
        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in registerInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="formData[input.model]"
                    @input="
                        setRegisterInputValue(formData, input.model, $event.target)"
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
                        @click="goToLogin">
                        Cancel
                    </button>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { checkBlankInputs } from '../scripts/forms/checkblankinputs'
    import FormError from './FormError.vue'
    import useAccountStore from '../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import registerUser from '../scripts/register/registerUser'
    import { useRouter } from 'vue-router'
    import { 
             registerInputDataType, 
             registerInputData, 
             setRegisterInputValue 
            } from '../scripts/register/setRegisterInputValue'

    const formData : registerInputDataType = reactive({
        username : '',
        first_name : '',
        last_name : '',
        password : '',
        repeat_pass : '',
    })

    const errors = ref<string[]>([])

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const emit = defineEmits(['set-app-modal-msg'])
    const router = useRouter()

    const goToLogin = (event: Event) => {
        event.preventDefault()
        router.push('/login')
    }

    const submitForm = () => {
        errors.value = []

        const passNotConfirmed = 
            formData.password !== formData.repeat_pass ? true : false
        const isBlank = checkBlankInputs(
        [
            { input: formData.username ? true : false, inputName: 'E-mail' },
            { input: formData.first_name ? true : false, inputName: 'First Name' },
            { input: formData.last_name ? true : false, inputName: 'Last Name' },
            { input: formData.password ? true : false, inputName: 'Password' },
            { 
                input: formData.repeat_pass ? true : false,
                inputName: 'Password Confirmation' 
            },
        ], errors)
        if(passNotConfirmed) errors.value.push('Password Verification Failed!')

        if(!passNotConfirmed && !isBlank) {
            registerUser(
                formData, emit, isLoading, formData.username as string, 
                errors, router)
        }
    }

</script>

<style scoped></style>