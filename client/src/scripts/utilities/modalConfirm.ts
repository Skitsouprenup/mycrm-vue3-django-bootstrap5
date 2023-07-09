import { showAppModal } from "../appModal"

let confirmAction : string = ''
let confirmFunction : ((choice: string) => void) | null = null

const modalConfirm = (
    title: string, 
    message: string, 
    action: string,
    func: (choice: string) => void) => {

    confirmAction = action
    confirmFunction = func
    showAppModal(title, message, true)
}

export const executeConfirm = () => {
    if(confirmFunction)
        confirmFunction(confirmAction)
}

export default modalConfirm