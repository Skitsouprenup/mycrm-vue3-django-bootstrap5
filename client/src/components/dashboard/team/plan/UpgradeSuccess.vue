<template>
    <div class="container-lg">
        <h2>Your plan has been updated!</h2>
        <div>
            Click 
            <span class="link-btn" 
                  @click="$router.push('/dashboard/team/view/members')">
                here
            </span>
            to go to team view.
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { checkSubscription } from '../../../../scripts/team/planoperations';
import useAccountStore from '../../../../store/useAccountStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const accountStore = useAccountStore()
const { isLoading } = storeToRefs(accountStore)

onMounted(() => {
    checkSubscription(
        route.query.session_id as string,
        isLoading,
        accountStore.setTeamPlan)
})

</script>

<style scoped>
.link-btn {
    cursor: pointer;
    color: blue;
}

.link-btn:hover {
    text-decoration: underline;
    color: black;
}
</style>