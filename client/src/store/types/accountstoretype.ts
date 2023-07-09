import { Store } from "pinia"

export type accountStoreType = 
    Store<string, accountStoreState, {}, accountStoreActions>

export interface accountStoreState {
    isLoading: boolean,
    isAuthenticated: boolean,
    accessToken: string | null,
    refreshToken: string | null,
    userId: string,
    username: string,
    teamId: string,
    teamname: string,
    max_clients: number,
    max_leads: number,
    plan_name: string,
}

export interface accountStoreActions {
    initializeStore(): void,
    setAccessToken(token: string): void,
    setRefreshToken(token: string): void,
    removeToken(): void,
    setUser(userInfo : {id: string, name: string}): void,
    setTeam(teamInfo : {id: string, name: string}): void,
    setTeamPlan(
        teamPlanInfo : 
        {
            max_leads: number, 
            max_clients: number,
            plan_name: string,
        }
    ): void,
}