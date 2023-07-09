<template>
    <form 
        @submit.prevent="searchItem" 
        class="d-flex gap-2">
        <input type="text" v-model="item" class="form-control" />
        <button 
            type="submit"
            class="btn btn-info">
            Search
        </button>
    </form>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const emit = defineEmits(['search_item'])
    const item = ref('')

    const searchItem = () => {
        emit('search_item', item.value)
    }

</script>

<style scoped>

</style>