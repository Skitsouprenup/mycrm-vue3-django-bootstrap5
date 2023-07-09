<template>
    <MessageModal 
        @reset-modal="resetModal" 
        :modalMsg="modalMsg"
        :modalTitle="modalTitle"
        :withConfirm="withConfirm"/>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" class="toast" data-bs-delay="1500" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
            <strong class="me-auto">{{ toastTitle }}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
            {{ toastMsg }}
            </div>
        </div>
    </div>

    <Navbar />
    <RouterView @set-app-modal-msg="showAppModal"/>
</template>

<script setup lang="ts">
import Navbar from './components/navbar/Navbar.vue'
import MessageModal from './components/utilities/modals/MessageModal.vue'

import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { initModalRefs, showAppModal } from './scripts/appModal'
import { initToastRefs } from './scripts/appToast'

const modalMsg = ref('')
const modalTitle = ref('')
const withConfirm = ref(false)

const toastMsg = ref('')
const toastTitle = ref('')

const resetModal = () => {
    modalMsg.value = ''
    modalTitle.value = ''
}

initModalRefs(modalTitle, modalMsg, withConfirm)
initToastRefs(toastTitle, toastMsg)
</script>

<style scoped></style>
