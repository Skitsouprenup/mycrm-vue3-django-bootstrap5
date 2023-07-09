

const noteRoutes = [
    {
        path: '/dashboard/clients/:id/notes/add',
        name: 'AddNote',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/note/AddNote.vue') 
    },
    {
        path: '/dashboard/clients/:id/notes/:note_id/edit',
        name: 'EditNote',
        meta: { requiresAuth: true },
        component: () => import('../../../../components/dashboard/note/EditNote.vue') 
    },
]

export default noteRoutes