import {createRouter, createWebHistory} from 'vue-router'
import useAccountStore from '../../store/useAccountStore'
import axios from 'axios'
import leadRoutes from './routes/dashboard/leadRoutes'
import teamRoutes from './routes/dashboard/teamRoutes'
import { showAppModal } from '../appModal'
import clientRoutes from './routes/dashboard/clientRoutes'
import noteRoutes from './routes/dashboard/noteRoutes'

const routes = [
    {
        path: '/',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () => import('../../components/profile/Profile.vue') 
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../../components/Login.vue')
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../../components/Register.vue') 
    },
    {
        path: '/profile/:id/edit',
        name: 'EditProfile',
        meta: { requiresAuth: true },
        component: () => import('../../components/profile/EditProfile.vue') 
    },
    ...leadRoutes,
    ...teamRoutes,
    ...clientRoutes,
    ...noteRoutes,
    { 
        path: '/:pathMatch(.*)*', 
        component: import('../../components/utilities/404NotFound.vue')  
    },
]

const VueRouter = createRouter({
    history: createWebHistory(),
    routes
});

//Triggered when a navigation happens.
//Executed before navigating to the target
VueRouter.beforeEach((to) => {
    const accountStore = useAccountStore()
    accountStore.initializeStore()
    axios.defaults.headers.common['Authorization'] = ''

    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(!accountStore.isAuthenticated) {
            return { name: 'Login' }
        }
        else {
            axios.defaults.headers.common['Authorization'] = 
                'JWT ' + accountStore.accessToken
        }

        if(!to.meta?.addTeamPage && !accountStore.teamId) {
            showAppModal(
                'Add a Team',
                'You must be in a team first before accessing the site.')
            return { name: 'AddTeam' }
        }      
    }
})

export default VueRouter