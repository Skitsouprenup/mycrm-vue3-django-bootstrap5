<template>
    <div
        class="container-fluid" v-if="message">
        <h1 class="container-fluid row justify-content-center">{{ message }}</h1>
    </div>
    <div class="container-lg mb-4" v-else>
        <h1 class="mt-3">Notes</h1>
        <button 
            class="btn btn-info mb-4"
            @click="goToAddNote">
        Add Note
        </button>
        <div class="container-fluid row justify-content-center">
            <div class="container-fluid box" v-for="note in notes">
                <div class="d-flex justify-content-between align-items-center">
                    <h2 class="mt-3 mb-3">{{ note.name }}</h2>
                    <button 
                        class="btn btn-success btn-edit"
                        @click="goToEditNote(note.id as string)">
                        Edit
                    </button>
                </div>
                <p>{{ note.body }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'
import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
import { useRoute, useRouter } from 'vue-router'
import { getNotesByClientId } from '../../../scripts/note/getNotes'

const notes : Ref<unknownObjectType[]> = ref([])
const message = ref('Loading Notes...')
const route = useRoute()
const router = useRouter()

onMounted(() => {
    getNotesByClientId(route.params.id as string, message, notes)
})

const goToEditNote = (note_id : string) => {
    router.push(`/dashboard/clients/${route.params.id}/notes/${note_id}/edit`)
}
const goToAddNote = () => {
    router.push(`/dashboard/clients/${route.params.id}/notes/add`)
}

</script>

<style scoped>
.box {
  border: 1px solid lightgray;
  padding: 10px;
  box-shadow: 5px 10px lightgrey;
}
.btn-edit {
    width: 75px;
    height: 40px;
}
</style>