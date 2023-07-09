import { Ref } from "vue"
import { Modal } from 'bootstrap'

let messageRef : Ref<string> | null = null
let titleRef : Ref<string> | null = null
let withConfirmRef : Ref<boolean> | null = null

export const initModalRefs = (
    refTitle: Ref<string>, 
    msgRef: Ref<string>,
    withConfirm: Ref<boolean> 
) => {
    messageRef = msgRef
    titleRef = refTitle   
    withConfirmRef = withConfirm 
}

//Direct access to app modal. This is useful when do you want to
//access app modal but you're not in a component. For component
//emit 'set-app-modal-msg'
export const showAppModal = (
    title: string, 
    message: string, 
    withConfirm: boolean = false
) => {
    if(messageRef && titleRef && withConfirmRef) {
        messageRef.value = message
        titleRef.value = title
        withConfirmRef.value = withConfirm
        const appModal = new Modal(document.getElementById('appModal') as HTMLElement, {})
        appModal.show()
    }
}