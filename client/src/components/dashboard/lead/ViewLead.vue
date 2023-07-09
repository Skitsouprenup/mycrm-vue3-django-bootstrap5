<template>
    <div class="container-lg w-100 h-100">
        <div
            class="loadingDiv" 
            v-if="message">
            <h1>{{ message }}</h1>
        </div>
        <div
            class="container-fluid w-100" v-else>
            <h1 class="mt-3 mb-3">{{ getLeadItem('company') }}</h1>
            <div class="d-flex mb-2 gap-2 flex-wrap">
                <button 
                    class="btn btn-primary"
                    @click="goToEditLead">
                    Edit
                </button>
                <button 
                    class="btn btn-success"
                    @click="preConvertToClient"
                    :disabled="lead?.converted_to_client ? true : false">
                    {{ lead?.converted_to_client ? 
                        'Converted to Client' : 
                        'Convert to Client' }}
                </button>
                <button 
                    class="btn btn-danger"
                    @click="preDeleteSelectedLead">
                    Delete
                </button>
            </div>
            <div class="container-fluid row">
                <div class="col me-3 box">
                    <h2 class="mt-3 mb-3">Details</h2>
                    <div class="row mb-2 align-items-center" v-for="item in detailsItems">
                        <b class="col-sm-5">{{ item.label }}: </b>
                        <span class="col">{{ getLeadItem(item.name) }}</span>
                    </div>
                </div>

                <div class="col box">
                    <h2 class="mt-3 mb-3">Contact Information</h2>
                    <div class="row mb-2 align-items-center" v-for="item in contactInfoItems">
                        <b class="col-sm-5">{{ item.label }}: </b>
                        <span class="col">{{ getLeadItem(item.name) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getLeadById } from '../../../scripts/lead/getlead'
    import { Ref, ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { leadFormData,
             detailsItems,
             contactInfoItems } from '../../../scripts/lead/leadInput'
    import { getRefFormObjProperty, 
             unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
    import convertLeadToClient from '../../../scripts/lead/convertLeadToClient'
    import useAccountStore from '../../../store/useAccountStore'
    import { storeToRefs } from 'pinia'
import deleteLead from '../../../scripts/lead/deleteLead'
import modalConfirm from '../../../scripts/utilities/modalConfirm'

    const route = useRoute()
    const router = useRouter()
    const message = ref('Loading...')
    const lead : Ref<unknownObjectType | null> = ref(null)
    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)

    onMounted(() => 
        getLeadById(
            route.params.id as string, 
            message, 
            lead as Ref<leadFormData | null>))

    const getLeadItem = (key: string) => {
        return getRefFormObjProperty(lead, key)
    }

    const goToEditLead = () => {
        router.push(`/dashboard/leads/${route.params.id}/edit/`)
    }

    const preDeleteSelectedLead = () => {
        modalConfirm('Delete Lead?', 
                     'Do you really wanna delete this lead?', 
                     'deleteSelectedLead', 
                     confirmChoices)
    }

    const deleteSelectedLead = () => {
        deleteLead(route.params.id as string, isLoading, router)
    }

    const preConvertToClient = () => {
        modalConfirm('Convert Lead to Client?', 
                     'Do you really wanna convert this lead to client?', 
                     'convertToClient', 
                     confirmChoices)
    }

    const convertToClient = () => {
        convertLeadToClient(route.params.id as string, 
                            getLeadItem('company') as string, 
                            router, 
                            isLoading)
    }

    const confirmChoices = (choice: string) => {
        switch(choice) {
            case 'deleteSelectedLead':
                deleteSelectedLead()
                break
            case 'convertToClient':
                convertToClient()
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