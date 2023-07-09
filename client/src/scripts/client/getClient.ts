import axios from "axios"
import { Ref } from "vue"
import { unknownObjectType } from "../utilities/ObjectProperty"
import { updatePagination, updatePaginationUrl } from "../Pagination"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

export const getClientById = (
    id: string,
    message: Ref<string>,
    lead: Ref<{[index: string] : unknown} | null>,
    companyName: Ref<string> | null = null) => {

    const connect = async () => {
        axios.get(`/api/v1/clients/${id}/`)
        .then((response) => {
            message.value = ''
            if(companyName) 
                companyName.value = response.data.company 
            lead.value = response.data
            
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

export const getTeamClientsCount = async (
    clientsCount: Ref<number>,
    isLoading: Ref<boolean>,
    id: string,
) => {
    isLoading.value = true

    const connect = async () => {
        await axios.get(
            `/api/v1/clients/team/clients_count?id=${id}`)
        .then((response) => {
            clientsCount.value = response.data.count
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

export const searchClients = (
    clients: Ref<unknownObjectType[]>,
    isLoading: Ref<boolean>,
    searchItem: string,
) => {
    isLoading.value = true

    const connect = async () => {
        axios.get(
            `/api/v1/clients?search=${searchItem}`)
        .then((response) => {
            isLoading.value = false
            clients.value = response.data.results
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

export const getClients = (
    clients: Ref<unknownObjectType[]>,
    isLoading: Ref<boolean>,
    paginationBtns: {showNext: boolean, showPrev: boolean},
    currentPage: Ref<number>,
    pageAction: 'next' | 'prev' | 'init'
) => {
    isLoading.value = true

    let pageNumber = currentPage.value + 1
    if(pageAction === 'prev')
        pageNumber = currentPage.value - 1

    let url = updatePaginationUrl(pageAction, pageNumber, 'clients')

    const connect = async () => {
        axios.get(url)
        .then( async (response) => {
            isLoading.value = false
            
            if(response.status === 200) {
                clients.value = response.data.results
                updatePagination(
                    response.data.next ? true : false,
                    response.data.previous ? true : false,
                    currentPage, 
                    paginationBtns,
                    pageAction
                )
            }
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