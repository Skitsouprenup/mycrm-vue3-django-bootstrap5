<template>
    <div
        class="loadingDiv" v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg mb-3" v-else>
        <h1 class="mb-3 mt-3">Edit {{ noteTitle }}</h1>

        <form @submit.prevent="submitForm">

            <div class="mb-3" v-for="input in noteInputData">
                <label :for="input.id" class="form-label">
                    {{ input.label }}
                </label>
                <input 
                    :type="input.type"
                    class="form-control" 
                    :id="input.id"
                    :value="getObjectRefProperty(
                        getNoteRef(), input.model)"
                    @input="
                        setInputValueRef(getNoteRef(), input.model, $event.target)"
                    :min="input.type === 'number' ? 0 : undefined"
                    :disabled="isLoading" />
            </div>
            <div class="mb-3">
                <label for="body" class="form-label">
                    Body
                </label>
                <textarea 
                    :value="getObjectRefProperty(
                        getNoteRef(), 'body')"
                    @input="
                        setInputValueRef(getNoteRef(), 'body', $event.target)"
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
    import { ref, onMounted, Ref } from 'vue'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
    import FormError from '../../FormError.vue'
    import { useRoute, useRouter } from 'vue-router'
    import { unknownObjectType, 
             getObjectRefProperty } from '../../../scripts/utilities/ObjectProperty'
    import { noteFormData, noteInputData } from '../../../scripts/note/noteInput'
    import checkBlankNoteInputs from '../../../scripts/client/checkBlankNoteInputs'
    import { getNoteById } from '../../../scripts/note/getNotes'
    import { patchNoteById } from '../../../scripts/note/editNote'
    import { setInputValueRef } from '../../../scripts/forms/formInput'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const errors = ref<string[]>([])
    const emit = defineEmits(['set-app-modal-msg'])
    const message = ref('Loading...')
    const noteTitle = ref('')
    const router = useRouter()
    const route = useRoute()
    const note : Ref<unknownObjectType | null> = ref(null)

    onMounted(() => {
        getNoteById(
            route.params.note_id as string,
            route.params.id as string,
            message, 
            note,
            noteTitle)
    })

    const goToClients = (event: Event) => {
        event.preventDefault()
        router.push(`/dashboard/clients/${route.params.id}`)
    }

    const getNoteRef = () => {
        return note as Ref<unknownObjectType>
    }

    const submitForm = () => {
        errors.value = []
        if(!checkBlankNoteInputs(note.value as noteFormData, errors)) {
            patchNoteById(
                route.params.note_id as string,
                route.params.id as string,
                isLoading,
                note as Ref<noteFormData | null>,
                errors, 
                router,
                emit, 
            )
        }
    }
    
</script>

<style scoped></style>