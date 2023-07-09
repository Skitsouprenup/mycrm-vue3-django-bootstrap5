<template>
    <div
        class="loadingDiv" 
        v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg mt-3 mb-3" v-else>
        <h1 class="mb-3">Edit Profile</h1>
        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in profileInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="getObjectRefProperty(
                        getUserInfoRef(), input.model)"
                    @input="
                        setInputValueRef(getUserInfoRef(), input.model, $event.target)"
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
                        @click="goToProfile">Cancel</button>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, onMounted } from 'vue'
    import { unknownObjectType, 
             getObjectRefProperty } from '../../scripts/utilities/ObjectProperty'
    import { useRoute, useRouter } from 'vue-router'
    import { profileFormData, profileInputData } from '../../scripts/profile/profileInput'
    import useAccountStore from '../../store/useAccountStore'
    import { setInputValueRef } from '../../scripts/forms/formInput'
    import { storeToRefs } from 'pinia'
    import checkBlankProfileInputs from '../../scripts/profile/checkBlankProfileInputs'
    import getUserInfo  from '../../scripts/profile/getUserInfo'
    import FormError from '../FormError.vue'
    import editUserInfo from '../../scripts/profile/editUserInfo'

    const message = ref('Loading...')
    const userInfo : Ref<unknownObjectType | null> = ref(null)
    const errors = ref<string[]>([])
    const router = useRouter()
    const route = useRoute()
    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)

    onMounted(() => 
        getUserInfo(route.params.id as string, userInfo as Ref<unknownObjectType>, message))

    const submitForm = () => {
        errors.value = []

        if(!checkBlankProfileInputs(userInfo.value as profileFormData, errors)) {
            editUserInfo(
                route.params.id as string,
                userInfo.value as profileFormData,
                isLoading, 
                errors, 
                router)
        }
    }

    const getUserInfoRef = () => {
        return userInfo as Ref<unknownObjectType>
    }

    const goToProfile = (event: Event) => {
        event.preventDefault()
        router.push('/')
    }

</script>

<style scoped></style>