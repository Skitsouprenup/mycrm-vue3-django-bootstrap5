<template>
    <div
        class="loadingDiv" 
        v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg mt-3 mb-3" v-else>
        <h1 class="mb-3">Edit {{ clientName }}</h1>
        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in clientInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="getObjectRefProperty(
                        getClientRef(), input.model)"
                    @input="
                        setInputValueRef(getClientRef(), input.model, $event.target)"
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
                        @click="goToClient">Cancel</button>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, onMounted } from 'vue'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import FormError from '../../FormError.vue'
    import { useRoute, useRouter } from 'vue-router'
    import { clientInputData, 
             clientFormData } from '../../../scripts/client/clientInput'
    import { unknownObjectType, getObjectRefProperty } from '../../../scripts/utilities/ObjectProperty'
    import { getClientById } from '../../../scripts/client/getClient'
    import { setInputValueRef } from '../../../scripts/forms/formInput'
    import checkBlankClientInputs from '../../../scripts/client/checkBlankClientInputs'
    import { patchClientById } from '../../../scripts/client/updateClient'

    const clientName = ref('')

    const accountStore = useAccountStore()
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const { isLoading } = storeToRefs(accountStore)
    const message = ref('Loading...')
    const route = useRoute()
    const router = useRouter()
    const client : Ref<unknownObjectType | null> = ref(null)

    const goToClient = (event: Event) => {
        event.preventDefault()
        router.push(`/dashboard/clients/${route.params.id}`)
    }

    const getClientRef = () => {
        return client as Ref<unknownObjectType>
    }

    onMounted(() => getClientById(route.params.id as string, message, client, clientName))

    const submitForm = () => {
        errors.value = []
        //Make sure lead.value is not null or else this will break
        //lead must be initialized bedore accessing
        if(!checkBlankClientInputs(client.value as clientFormData, errors)) {
            patchClientById(
                route.params.id as string, isLoading, client, errors, router, emit)
        }
    }
</script>

<style scoped></style>