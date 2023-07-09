<template>
    <div
        class="loadingDiv" 
        v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg">
        <h1 class="mb-3 mt-3">{{ teamName }}</h1>

        <div class="plan-panel p-3 mb-4 rounded">
            <div class="d-flex gap-2">
                <h2>Plan:</h2>
                <span class="plan-name">{{ plan?.name }}</span>
            </div>
            <div class="d-flex gap-3 mb-3">
                <div class="d-flex flex-column">
                    <b>Max Leads:</b>
                    <b>Max Clients:</b>
                    <b v-if="plan?.plan_end_date">End Date:</b>
                </div>
                <div class="d-flex flex-column">
                    <span>{{ plan?.max_leads }}</span>
                    <span>{{ plan?.max_clients }}</span>
                    <span v-if="plan?.plan_end_date">{{ plan?.plan_end_date }}</span>
                </div>
            </div>
            <button 
                class="btn btn-dark"
                @click="router.push(`/dashboard/team/plans/${plan?.name}`)">
                Change Plan
            </button>
        </div>

        <button 
            class="btn btn-info"
            @click="goToAddTeamMember">
            Add Member
        </button>
        <h3 class="mt-2 mb-1">Members</h3>
        <table class="table table-striped table-hover table-responsive align-middle">

            <thead>
                <tr>
                    <th>Email</th>
                    <th>Full Name</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="member in getMembers()"
                    :key="member['id']">
                    <td>{{ member['username'] }}</td>
                    <td>{{ member['first_name'] + ' ' +
                           member['last_name'] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { Ref, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import getMembersById from '../../../scripts/team/getMembersById'
    import { teamMemberType } from '../../../scripts/team/teamMembers'
    import { unknownObjectType } from '../../../scripts/utilities/ObjectProperty'

    const router = useRouter()
    const teamName = ref('')
    const plan : Ref<unknownObjectType | null> = ref(null)
    const message = ref('Loading...')
    //Value of this ref is an array proxy javascript object
    //The values of the array are object proxy type 
    const members : Ref< teamMemberType | null> = ref(null)
    //RouterView requires this emit event it's not gonna
    //be used here. Because an emit event is defined in RouterView
    defineEmits(['set-app-modal-msg'])

    onMounted(() => getMembersById(message, members, teamName, plan))

    const getMembers = () => {
        if(members?.value) {
            const data = Object.assign([], members.value)
            const arr : teamMemberType | [] = []
            
            for(const member of data) {
                arr.push(Object.assign({}, member))
            }

            if(arr.length)
                return arr as teamMemberType
            else return []
        }
        else return []
    }

    const goToAddTeamMember = () => {
        router.push(`/dashboard/team/add/members`)
    }


</script>

<style scoped>
.plan-panel {
    background-color: lightgrey;
    width: fit-content;
}

.plan-name {
    font-size: 1.7rem;
}
</style>