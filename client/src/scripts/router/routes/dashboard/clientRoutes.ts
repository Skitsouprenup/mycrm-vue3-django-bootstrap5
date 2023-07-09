

const clientRoutes = [
    {
        path: '/dashboard/clients',
        name: 'ListClients',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/client/ListClients.vue') 
    },
    {
        path: '/dashboard/clients/add',
        name: 'AddClient',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/client/AddClient.vue') 
    },
    {
        path: '/dashboard/clients/:id',
        name: 'ViewClient',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/client/ViewClient.vue') 
    },
    {
        path: '/dashboard/clients/:id/edit',
        name: 'EditClient',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/client/EditClient.vue') 
    },
]

export default clientRoutes