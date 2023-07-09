import { Ref } from "vue"
import axios from "axios"
import { Router } from "vue-router"
import formError from "../forms/formError"
import { noteFormData } from "./noteInput"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

export const patchNoteById = (
    id: string,
    clientId: string,
    isLoading: Ref<boolean>,
    note: Ref<noteFormData | null>,
    errors: Ref<string[]>,
    router: Router,
    emit: Function,
) => {
    isLoading.value = true
    /*
        get_queryset() is overriden and it requires query string
        with client_id

        By default, get_object() uses get_queryset() and
        update() uses get_object() by default
        This error below will occur is client_id is not provided
        "GET /api/v1/notes/1/ HTTP/1.1" 404 23

        get_object() source
        https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py#L24
    */
    const connect = async () => {
        axios.patch(`/api/v1/notes/${id}/?client_id=${clientId}`, note.value)
        .then(() => {
            isLoading.value = false
            router.push(`/dashboard/clients/${clientId}`)
            emit('set-app-modal-msg', 'Note Edit Success!', 
                'Note has been edited successfully!')
        })
        .catch(async (e) => {
            await refreshTokenWithStatus(e.response.data?.code, connect)
            isLoading.value = false
            if(e.response.data?.code !== 'token_not_valid') {
                formError(e, errors)
            }
        })
    }
    connect()
}