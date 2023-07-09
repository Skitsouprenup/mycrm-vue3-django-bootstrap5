<template>
    <div class="container-lg w-100 h-100">

        <div
            class="loadingDiv" v-if="message">
            <h1>{{ message }}</h1>
        </div>
        <div class="container-lg mb-4" v-else>
            <h1 class="mt-3 mb-3">{{ getClientItem('name') }}</h1>
            <button 
                class="btn btn-info mb-2 me-1"
                @click="goToEditClient">
                Edit
            </button>
            <button 
                class="btn btn-danger mb-2"
                @click="preDeleteSelectedClient">
                Delete
            </button>
            <div class="container-fluid row justify-content-center mb-3">
                <div class="col box">
                    <h2 class="mt-3 mb-3">Information</h2>
                    <div class="row mb-2 align-items-center" v-for="item in clientInfo">
                        <b class="col-sm-2">{{ item.label }}: </b>
                        <span class="col">{{ getClientItem(item.name) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <ViewNotes v-if="!message"/>

    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { clientInfo } from '../../../scripts/client/clientInput'
    import { getObjectProperty, 
             getRefFormObjProperty } from '../../../scripts/utilities/ObjectProperty'
    import { getClientById } from '../../../scripts/client/getClient'
import ViewNotes from '../note/ViewNotes.vue'
import deleteClient from '../../../scripts/client/deleteClient'
import useAccountStore from '../../../store/useAccountStore'
import { storeToRefs } from 'pinia'
import modalConfirm from '../../../scripts/utilities/modalConfirm'

    const route = useRoute()
    const router = useRouter()
    const message = ref('Loading...')
    const client : Ref<{[index: string] : unknown} | null> = ref(null)
    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)

    onMounted(() => {
        getClientById(route.params.id as string, message, client)
    })

    const getClientItem = (key: string) => {
        const item : unknown = getRefFormObjProperty(client, key)
        
        //Typescript can't detect types during runtime
        //and that lead data retrieved from the server
        //has object(Proxy) type
        if(typeof(item) === 'object' && key === 'assigned_to') {
            return getObjectProperty(item, 'username')
        } else return item
    }

    const preDeleteSelectedClient = () => {
        modalConfirm('Delete Client?', 
                     'Do you really wanna delete this client?', 
                     'convertToClient', 
                     confirmChoices)
    }

    const deleteSelectedClient = () => {
        deleteClient(route.params.id as string, isLoading, router)
    }

    const goToEditClient = () => {
        router.push(`/dashboard/clients/${route.params.id}/edit/`)
    }

    const confirmChoices = (choice: string) => {
        switch(choice) {
            case 'deleteSelectedClient':
                deleteSelectedClient()
                break
        }
    }
</script>

<style scoped>
.box {
  border: 1px solid lightgray;
  padding: 10px;
  box-shadow: 5px 10px lightgrey;
}
</style>