<template>
    <div class="container-lg">
        <h1 class="mb-3 mt-3">Leads</h1>
        <div class="d-flex gap-2 justify-content-between flex-wrap-reverse">
            <div 
                class="container-fluid bg-warning p-2"
                v-if="leadsCount >= accountStore.max_leads">

                Your Team's {{ accountStore.plan_name }} plan has reached its 
                maximum leads of {{ accountStore.max_leads }}. Please upgrade
                your plan to add more leads.
            </div>
            <button 
                class="btn btn-info"
                @click="moveToAddLead"
                v-else>
                Add Lead
            </button>
            <SearchField @search_item="searchItem"/>
        </div>
        
        <table class="table table-striped table-hover table-responsive align-middle">
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Contact Person</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="lead in leads"
                    :key="convertIdType(lead.id, 'number')">
                    <td>{{ lead.company }}</td>
                    <td>{{ lead.contact_person }}</td>
                    <td>{{ 
                        getObjectProperty(lead.assigned_to, 'first_name') + ' ' +
                        getObjectProperty(lead.assigned_to, 'last_name') }}</td>
                    <td>{{ lead.status }}</td>
                    <td>
                        <button 
                            class="btn btn-success"
                            @click="viewLead(convertIdType(lead.id, 'string') as string)">
                            View
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div>
            <button
                class="btn btn-primary"
                @click="prevPage"
                v-if="paginationBtns.showPrev">
                Previous
            </button>
            <button 
                class="btn btn-primary"
                @click="nextPage"
                v-if="paginationBtns.showNext">
                Next
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { onMounted, reactive, ref, Ref } from 'vue'
    import useAccountStore from '../../../store/useAccountStore.js'
    import { storeToRefs } from 'pinia'
    import { getObjectProperty, 
             unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
    import { getLeads, getTeamLeadsCount, searchLeads } from '../../../scripts/lead/getlead'
    import SearchField from '../../../assets/SearchField.vue'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const router = useRouter()
    const currentPage = ref(1)
    const leadsCount = ref(0)
    const paginationBtns = reactive({
        showNext: false,
        showPrev: false,
    })
    let leads : Ref<unknownObjectType[]> = ref([])

    const searchItem = (item: string) => {
        if(item.trim()) {
            searchLeads(leads, isLoading, item)
        }
    }

    const convertIdType = (id : unknown, type: 'string' | 'number') => {
        switch(type) {
            case 'string':
                return id as string
            case 'number':
                return id as number
        }
    }

    const nextPage = () => {
        if(currentPage.value > 0)
            getLeads(leads, isLoading, paginationBtns, currentPage, 'next')
    }

    const prevPage = () => {
        if(currentPage.value > 0)
            getLeads(leads, isLoading, paginationBtns, currentPage, 'prev')
    }

    const moveToAddLead = () => {
        router.push('/dashboard/leads/add')
    }

    const viewLead = (id: string) => {
        router.push({ name: 'ViewLead', params: { id } })
    }
    onMounted(async () => {
        await getTeamLeadsCount(leadsCount, isLoading, accountStore.teamId)
        getLeads(leads, isLoading, paginationBtns, currentPage, 'init')
    })

</script>

<style scoped></style>