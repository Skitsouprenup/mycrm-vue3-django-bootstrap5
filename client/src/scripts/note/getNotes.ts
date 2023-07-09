import axios from "axios"
import { Ref } from "vue"
import { unknownObjectType } from "../utilities/ObjectProperty"
import { refreshTokenWithStatus } from "../utilities/refreshToken"


export const getNotesByClientId = (
    id: string,
    message: Ref<string>,
    notes: Ref<unknownObjectType[]>) => {

    const connect = async () => {
        axios.get(`/api/v1/notes?client_id=${id}`)
        .then((response) => {
            message.value = ''
            notes.value = response.data
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                message.value = "Can't Fetch Client Notes!"
                console.error(e)
            }
        })
    }
    connect()
}

export const getNoteById = (
    id: string,
    clientId: string,
    message: Ref<string>,
    note: Ref<unknownObjectType | null>,
    noteTitle: Ref<string>) => {

    /*
        get_queryset() is overriden and it requires query string
        with client_id

        By default, get_object() uses get_queryset() and
        retrieve() uses get_object() by default
        This error below will occur is client_id is not provided
        "GET /api/v1/notes/1/ HTTP/1.1" 404 23

        get_object() source
        https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py#L24
    */
    axios.get(`/api/v1/notes/${id}/?client_id=${clientId}`)
    .then((response) => {
        message.value = ''
        note.value = response.data
        noteTitle.value = response.data.name
    })
    .catch((e) => {
        message.value = "Can't Fetch Data!"
        console.error(e)
    })
}