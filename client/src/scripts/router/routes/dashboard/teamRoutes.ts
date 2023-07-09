
const teamRoutes = [
    {
        path: '/dashboard/team/add',
        name: 'AddTeam',
        meta: { requiresAuth: true, addTeamPage: true },
        component: () => import('../../../../components/dashboard/team/AddTeam.vue') 
    },
    {
        path: '/dashboard/team/view/members',
        name: 'ViewTeamMembers',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/team/ViewTeamMembers.vue') 
    },
    {
        path: '/dashboard/team/add/members',
        name: 'AddTeamMembers',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/team/AddTeamMembers.vue') 
    },
    {
        path: '/dashboard/team/plans/:plan_name',
        name: 'UpgradeTeamPlan',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/team/Plan.vue') 
    },
    {
        path: '/dashboard/team/plans/success',
        name: 'UpgradeSuccess',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/team/plan/UpgradeSuccess.vue') 
    },
    {
        path: '/dashboard/team/plans/cancelled',
        name: 'UpgradeCancelled',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/team/plan/UpgradeCancel.vue') 
    },
    
]

export default teamRoutes