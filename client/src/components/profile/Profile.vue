<template>
    <div
        class="loadingDiv" 
        v-if="message">
        <h1>{{ message }}</h1>
    </div>
    <div class="container-lg" v-else>
        <div class="row mb-3 mt-3">
            <h1 class="display-4">Profile</h1>
            <hr />
        </div>
        <div class="d-flex flex-no-wrap" v-for="data in profileViewData">
            <h3>{{ data.label + ':' }}</h3>
            <span :class="['info-font', 
                data.label === 'Username' ? 'ms-4' : 'ms-3']">
                {{ getObjectProperty(userInfo, data.model) }}
            </span>
        </div>
        <div class="mt-3">
            <div class="inline-flex">
                <button 
                    class="btn btn-primary me-1"
                    @click="goToEditProfile">
                    Edit
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, onMounted } from 'vue'
    import { getObjectProperty, 
             unknownObjectType } from '../../scripts/utilities/ObjectProperty'
    import useAccountStore from '../../store/useAccountStore';
    import getUserInfo from '../../scripts/profile/getUserInfo'
    import { useRouter } from 'vue-router'
import { profileViewData } from '../../scripts/profile/profileInput';

    const accountStore = useAccountStore()
    const message = ref('')
    const userInfo : Ref<unknownObjectType | null> = ref(null)
    const router = useRouter()

    onMounted(() => {
        getUserInfo(
            accountStore.userId, 
            userInfo as Ref<unknownObjectType>, 
            message
        )
    })

    const goToEditProfile = () => {
        router.push(`/profile/${accountStore.userId}/edit`)
    }
</script>

<style scoped>
.info-font {
    font-size: 1.5rem;
}
</style>