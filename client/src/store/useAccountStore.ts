import { defineStore } from 'pinia'
import { accountStoreState } from './types/accountstoretype'
import { accountStoreActions } from './types/accountstoretype'

type userInfoType = { id: string, name: string }
const getUserInfo = () : userInfoType => {
    return localStorage.getItem('userInfo') ? 
        JSON.parse(localStorage.getItem('userInfo') as string) :
        { id: '', name: '' }
}

type teamInfoType = { id: string, name: string }
const getTeamInfo = () : teamInfoType => {
    return localStorage.getItem('teamInfo') ? 
        JSON.parse(localStorage.getItem('teamInfo') as string) :
        { id: '', name: '' }
}

type teamPlanInfoType = { max_leads: number, max_clients: number, plan_name: string }
const getTeamPlanInfo = () : teamPlanInfoType => {
    return localStorage.getItem('teamPlanInfo') ? 
        JSON.parse(localStorage.getItem('teamPlanInfo') as string) :
        { max_leads: 0, max_clients: 0, plan_name: '' }
}

//Only instantiate one store instance
export default defineStore<string, accountStoreState, {}, accountStoreActions>({
    id: 'account',
    
    state: () => {
        return { 
            isLoading: false,
            isAuthenticated: false,
            accessToken: '',
            refreshToken: '',
            userId: '',
            username: '',
            teamId: '',
            teamname: '',
            max_leads: 0,
            max_clients: 0,
            plan_name: '',
        }
    },

    //Modify state values
    actions: {
        initializeStore() {
            const storedAccessToken = localStorage.getItem('accessToken')
            const storedRefreshToken = localStorage.getItem('refreshToken')
            const storedUserInfo = getUserInfo()
            const storedTeamInfo = getTeamInfo()
            const storedTeamPlanInfo = getTeamPlanInfo()

            if(storedAccessToken) {
                this.accessToken = storedAccessToken
                this.refreshToken = storedRefreshToken
                this.isAuthenticated = true
                this.userId = storedUserInfo.id
                this.username = storedUserInfo.name
                this.teamId = storedTeamInfo.id
                this.teamname = storedTeamInfo.name
                this.max_leads = storedTeamPlanInfo.max_leads
                this.max_clients = storedTeamPlanInfo.max_clients
                this.plan_name = storedTeamPlanInfo.plan_name
            } 
            else {
                this.accessToken = ''
                this.refreshToken = ''
                this.isAuthenticated = false
                this.userId = ''
                this.username = ''
                this.teamId = ''
                this.teamname = ''
                this.plan_name = ''
            }
        },
        setAccessToken(token : string) {
            this.accessToken = token
            localStorage.setItem('accessToken', token)
            this.isAuthenticated = true
        },
        setRefreshToken(token : string) {
            this.refreshToken = token
            localStorage.setItem('refreshToken', token)
            this.isAuthenticated = true
        },
        removeToken() {
            this.accessToken = ''
            this.refreshToken = ''
            this.isAuthenticated = false
        },
        setUser(userInfo : {id: string, name: string}) {
            this.userId = userInfo.id
            this.username = userInfo.name
            localStorage.setItem('userInfo', JSON.stringify(
                {
                    id: this.userId,
                    name: this.username,
                }
            ))
        },
        setTeam(teamInfo : {id: string, name: string}) {
            this.teamId = teamInfo.id
            this.teamname = teamInfo.name
            localStorage.setItem('teamInfo', JSON.stringify(
                {
                    id: this.teamId,
                    name: this.teamname,
                }
            ))
        },
        setTeamPlan(
            teamPlanInfo : 
                { 
                    max_leads: number, 
                    max_clients: number, 
                    plan_name: string
                }
        ) {
            this.max_leads = teamPlanInfo.max_leads
            this.max_clients = teamPlanInfo.max_clients
            this.plan_name = teamPlanInfo.plan_name
            localStorage.setItem('teamPlanInfo', JSON.stringify(
                {
                    max_leads: this.max_leads,
                    max_clients: this.max_clients,
                    plan_name:this.plan_name,
                }
            ))
        },
    }
})