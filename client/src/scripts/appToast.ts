import { Toast } from "bootstrap"
import { Ref } from "vue"

let messageRef : Ref<string> | null = null
let titleRef : Ref<string> | null = null

export const initToastRefs = (refTitle: Ref<string>, msgRef: Ref<string>) => {
    messageRef = msgRef
    titleRef = refTitle    
}

export const showToast = (title: string, message: string, color: string = '') => {
    if(messageRef && titleRef) {
        const toastElList = document.querySelector('.toast')
        if(toastElList?.className) {
            toastElList.className = 'toast'
        }
        if(color) {
            toastElList?.classList.add(color)
        }

        messageRef.value = message
        titleRef.value = title
        new Toast(toastElList as Element).show()
    }
}