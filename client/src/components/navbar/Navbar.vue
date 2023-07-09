<template>
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
        <div class="container-fluid">
            <RouterLink 
                to="/"
                style="text-decoration: none;">
                <span class="text-light">
                    MyCRM
                </span>
            </RouterLink>

            <button 
                class="navbar-toggler" 
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navmenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!--
                This element will be hidden if the navbar is not
                collapsed(100% width). Sibling elements of this
                element will be part of the navbar 
                
                if it's collaped(fixed-width),
                This element will be part of the navbar. Sibling
                elements of this element will be hidden

                .collapse is a trigger type and .navbar-collapse
                indicates the element that will trigger a
                collapse trigger type
            -->
            <div class="collapse navbar-collapse" id="navmenu">
                <ul class="navbar-nav ms-auto">
                    <template v-for="link in navLinks">
                        <li 
                            class="nav-item" 
                            v-if="link?.showIfAuth !== undefined ? 
                                showIfAuth(link.showIfAuth) :
                                true">
                        <RouterLink 
                            :to="link.to"
                            style="text-decoration: none;"
                            v-if="link?.to">
                            <span 
                                class="nav-link txt-btn"
                                role="button">
                                {{ link.name }}
                            </span>
                        </RouterLink>
                        <span v-else
                            class="nav-link txt-btn"
                            role="button"
                            @click="link.clickEvt">
                            {{ link.name }}
                        </span>
                    </li>
                    </template>
                </ul>
            </div>

        </div>
    </nav>
</template>

<script setup lang="ts">
    import { RouterLink, useRouter } from 'vue-router'
    import useAccountStore from '../../store/useAccountStore'

    const router = useRouter()
    const accountStore = useAccountStore()
    
    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('teamInfo')
        localStorage.removeItem('teamPlanInfo')
        router.push('/login')
    }

    const showIfAuth = (auth: boolean) => {
        if(accountStore.isAuthenticated)
            return auth
        else return !auth
    }

    const navLinks = [
        { to: '/dashboard/leads', name: 'Leads', showIfAuth: true },
        { to: '/dashboard/team/view/members', name: 'Team', showIfAuth: true },
        { to: '/dashboard/clients', name: 'Clients', showIfAuth: true },
        { to: '/', name: 'Profile', showIfAuth: true },

        { to: '/login', name: 'Login', showIfAuth: false },
        { name: 'Logout', showIfAuth: true, clickEvt: logout },

        { to: '/signup', name: 'Register', showIfAuth: false },
    ]
</script>

<style scoped>
.txt-btn:hover {
    color: yellowgreen;
}
</style>