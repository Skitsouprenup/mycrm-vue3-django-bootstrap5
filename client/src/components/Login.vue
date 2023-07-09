<template>
    <div class="container-lg mt-3 mb-3">
        <h1 class="mb-3">Login</h1>
        <form @submit.prevent="submitForm">

            <div class="mb-3">
                <label for="email-input" class="form-label">
                    Email
                </label>
                <input 
                    type="input" 
                    class="form-control" 
                    id="email-input"
                    v-model="email" />
            </div>
            <div class="mb-3">
                <label for="password-input" class="form-label">
                    Password
                </label>
                <input 
                    type="password" 
                    class="form-control" 
                    id="password-input"
                    v-model="password" />
            </div>

            <FormError :errors="errors" />

            <div 
                class="spinner-border" role="status"
                style="width: 3rem; height: 3rem;"
                v-if="isLoading">
                <span class="visually-hidden">Loading...</span>
            </div>
            <button type="submit" class="btn btn-success" v-else>Login</button>

        </form>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { checkBlankInputs } from '../scripts/forms/checkblankinputs'
import useAccountStore from '../store/useAccountStore'
import FormError from './FormError.vue'
import { storeToRefs } from 'pinia'
import loginUser from '../scripts/login/loginUser'

let email = ref('')
let password = ref('')
const router = useRouter()
const errors = ref<string[]>([])
const accountStore = useAccountStore()
const { isLoading } = storeToRefs(accountStore)

const submitForm = () => {
    errors.value = []

    const isBlank = checkBlankInputs(
    [
        { input: email.value ? true : false, inputName: 'E-mail' },
        { input: password.value ? true : false, inputName: 'Password' },
    ], errors)

    if(!isBlank) {
        const formData : { [index: string] : string } = {
            username: email.value,
            password: password.value
        }
        loginUser(formData, isLoading, errors, router, accountStore)
    }
}

</script>

<style scoped></style>