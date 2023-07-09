<template>
    <div class="mb-3" >
        <label for="status" class="form-label">
            Status
        </label>
        <!-- Note: the value of each option must be equal to the
                key identifier in the models.py of lead app
        -->
        <select class="form-select" 
                aria-label="Status Select" 
                id="status"
                :value="status"
                @input="
                    $emit('update:status', 
                        ($event.target as HTMLInputElement).value)">
            <option selected value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="inprogress">In-Progress</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
        </select>
    </div>
    <div class="mb-3" >
        <label for="priority" class="form-label">
            Priority
        </label>
        <!-- Note: the value of each option must be equal to the
                key identifier in the models.py of lead app
        -->
        <select class="form-select" 
                aria-label="Status Select" 
                id="priority"
                :value="priority"
                @input="
                    $emit('update:priority', 
                        ($event.target as HTMLInputElement).value)">
            <option selected value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
    </div>
</template>

<script setup lang="ts">
defineProps(['status', 'priority'])
defineEmits(['update:status','update:priority'])
</script>

<style scoped></style>