import { Ref } from "vue"
import axios from "axios"
import { getObjectProperty, 
         unknownObjectType } from "../utilities/ObjectProperty"
import { updatePagination, updatePaginationUrl } from "../Pagination"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

const flattenLeadData = (lead: unknownObjectType, viewType: string = 'view') => {
    const flattenedLead : unknownObjectType = {}

    for (const [key, value] of Object.entries(lead)) {

        if(key === 'assigned_to') {
            if(viewType === 'view')
                flattenedLead[key] = 
                    getObjectProperty(lead.assigned_to, 'first_name') + ' ' +
                    getObjectProperty(lead.assigned_to, 'last_name')
            else flattenedLead[key] = getObjectProperty(lead.assigned_to, 'username')
            continue
        }
        flattenedLead[key] = value
    }
    return flattenedLead
}

export const getTeamLeadsCount = async (
    leadsCount: Ref<number>,
    isLoading: Ref<boolean>,
    id: string,
) => {
    isLoading.value = true

    const connect = async () => {
        axios.get(
            `/api/v1/leads/team/leads_count?id=${id}`)
        .then((response) => {
            leadsCount.value = response.data.count
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    await connect()
}

export const getLeadById = (
    id: string,
    message: Ref<string>,
    lead: Ref<unknownObjectType | null>,
    companyName: Ref<string> | null = null,
    assignedToView: string) => {

    const connect = async () => {
        axios.get(`/api/v1/leads/${id}/`)
        .then((response) => {
            message.value = ''
            if(companyName) companyName.value = response.data.company 
            lead.value = flattenLeadData(response.data, assignedToView)
            
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                message.value = "Can't Fetch Data!"
                console.error(e)
            }
        })
    }
    connect()
}

export const getLeads = (
    leads: Ref<unknownObjectType[]>,
    isLoading: Ref<boolean>,
    paginationBtns: {showNext: boolean, showPrev: boolean},
    currentPage: Ref<number>,
    pageAction: 'next' | 'prev' | 'init'
) => {
    isLoading.value = true

    let pageNumber = currentPage.value + 1
    if(pageAction === 'prev')
        pageNumber = currentPage.value - 1

    let url = updatePaginationUrl(pageAction, pageNumber, 'leads')

    const connect = async() => {
        axios.get(url)
        .then((response) => {
            isLoading.value = false
            leads.value = response.data.results
            updatePagination(
                response.data.next ? true : false,
                response.data.previous ? true : false,
                currentPage, 
                paginationBtns,
                pageAction
            )
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    connect()
}

export const searchLeads = (
    leads: Ref<unknownObjectType[]>,
    isLoading: Ref<boolean>,
    searchItem: string,
) => {
    isLoading.value = true

    const connect = async() => {
        axios.get(
            `/api/v1/leads?search=${searchItem}`)
        .then((response) => {
            isLoading.value = false
            leads.value = response.data.results
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                console.error(e)
            }
        })
    }
    connect()
}