

const leadRoutes = [
    {
        path: '/dashboard/leads',
        name: 'Leads',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/lead/Leads.vue') 
    },
    {
        path: '/dashboard/leads/add',
        name: 'AddLead',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/lead/AddLead.vue') 
    },
    {
        path: '/dashboard/leads/:id',
        name: 'ViewLead',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/lead/ViewLead.vue') 
    },
    {
        path: '/dashboard/leads/:id/edit',
        name: 'EditLead',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/lead/EditLead.vue') 
    },
]

export default leadRoutes