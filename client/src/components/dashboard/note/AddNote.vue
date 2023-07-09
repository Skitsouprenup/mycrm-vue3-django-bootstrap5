<template>
    <div class="container-lg mb-3">
        <h1 class="mb-3 mt-3">Add Note</h1>

        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in noteInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="noteData[input.model]"
                    @input="
                        setInputValue(noteData, input.model, $event.target)"
                    :min="input.type === 'number' ? 0 : undefined"
                    :disabled="isLoading" />
            </div>
            <div class="mb-3">
                <label for="body" class="form-label">
                    Body
                </label>
                <textarea 
                    v-model="(noteData['body'] as string)"
                    class="form-control"
                    id="body">
                </textarea>
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
    import { setInputValue } from '../../../scripts/forms/formInput'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import FormError from '../../FormError.vue'
    import { useRoute, useRouter } from 'vue-router'
    import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
    import { noteFormData, noteInputData } from '../../../scripts/note/noteInput'
    import checkBlankNoteInputs from '../../../scripts/client/checkBlankNoteInputs'
    import addNote from '../../../scripts/note/addNote'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const router = useRouter()
    const route = useRoute()

    const noteData : unknownObjectType = reactive({
        name: '',
        body: '',
    })

    const goToClients = (event: Event) => {
        event.preventDefault()
        router.push('/dashboard/clients')
    }

    const submitForm = () => {
        errors.value = []
        if(!checkBlankNoteInputs(noteData as noteFormData, errors)) {
            addNote(
                noteData, 
                emit, 
                isLoading, 
                errors, 
                router,
                route.params.id as string
            )
        }
    }
    
</script>

<style scoped></style>