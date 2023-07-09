<template>
    <div class="container-lg">
        <h2>Plan has been cancelled.</h2>
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
import { showToast } from '../../../../scripts/appToast'

onMounted(() => {
    showToast('Plan Cancelled', 'Plan wasn\'t updated.', 'btn-danger')
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