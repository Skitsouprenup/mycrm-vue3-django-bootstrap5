<template>
    <div class="modal" id="appModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ props.modalTitle }}</h5>
                <button 
                    type="button" 
                    class="btn-close"
                    data-bs-dismiss="modal" 
                    aria-label="Close"
                    @click="emit('reset-modal')"></button>
            </div>
            <div class="modal-body">
                <p>{{ props.modalMsg }}</p>
            </div>
            <div class="modal-footer">
                <button 
                    type="button" 
                    class="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    @click="emit('reset-modal')">
                    Close
                </button>
                <button 
                    type="button" 
                    class="btn btn-primary" 
                    data-bs-dismiss="modal"
                    @click="() => {
                        executeConfirm()
                        emit('reset-modal')
                    }"
                    v-if="props.withConfirm">
                    Confirm
                </button>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { executeConfirm } from '../../../scripts/utilities/modalConfirm';

interface Props {
    modalTitle?: string,
    modalMsg?: string,
    withConfirm?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    modalTitle: '',
    modalMsg: '',
    withConfirm: false 
})

const emit = defineEmits<{
  'reset-modal': []
}>()

</script>

<style scoped>

</style>