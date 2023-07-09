<template>
    <div class="container-lg">
        <h1 class="mb-3 mt-3">Clients</h1>
        <div class="d-flex gap-2 justify-content-between flex-wrap-reverse">
            <div 
                class="container-fluid bg-warning p-2"
                v-if="clientsCount >= accountStore.max_clients">

                Your Team's {{ accountStore.plan_name }} plan has reached its 
                maximum clients of {{ accountStore.max_clients }}. Please upgrade
                your plan to add more clients.
            </div>
            <button 
                class="btn btn-info"
                @click="moveToAddClient"
                v-else>
                Add Client
            </button>
            <SearchField @search_item="searchItem"/>
        </div>
        <table class="table table-striped table-hover table-responsive align-middle">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact Person</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="client in clients"
                    :key="convertIdType(client.id, 'number')">
                    <td>{{ client.name }}</td>
                    <td>{{ client.contact_person }}</td>
                    <td>
                        <button 
                            class="btn btn-success"
                            @click="viewClient(convertIdType(client.id, 'string') as string)">
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
    import { Ref, onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'
    import { storeToRefs } from 'pinia'
    import useAccountStore from '../../../store/useAccountStore'
    import { getClients, getTeamClientsCount, searchClients } from '../../../scripts/client/getClient'
    import SearchField from '../../../assets/SearchField.vue'

    const accountStore = useAccountStore()
    const { isLoading } = storeToRefs(accountStore)
    const router = useRouter()
    let clients : Ref<unknownObjectType[]> = ref([])
    const currentPage = ref(1)
    const clientsCount = ref(0)
    const paginationBtns = reactive({
        showNext: false,
        showPrev: false,
    })

    const searchItem = (item: string) => {
        if(item.trim()) {
            searchClients(clients, isLoading, item)
        }
    }

    const nextPage = () => {
        if(paginationBtns.showNext)
            getClients(clients, isLoading, paginationBtns, currentPage, 'next')
    }

    const prevPage = () => {
        if(paginationBtns.showPrev)
            getClients(clients, isLoading, paginationBtns, currentPage, 'prev')
    }

    const moveToAddClient = () => {
        router.push('/dashboard/clients/add')
    }

    const viewClient = (id: string) => {
        router.push({ name: 'ViewClient', params: { id } })
    }

    const convertIdType = (id : unknown, type: 'string' | 'number') => {
        switch(type) {
            case 'string':
                return id as string
            case 'number':
                return id as number
        }
    }

    onMounted(() => {
        const initClients = async () => {
            await getTeamClientsCount(clientsCount, isLoading, accountStore.teamId)
            getClients(clients, isLoading, paginationBtns, currentPage, 'init')
        }
        initClients()
    })

</script>

<style scoped></style>