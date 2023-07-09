import { Ref } from "vue"
import { checkBlankInputs } from "../forms/checkblankinputs"
import { noteFormData } from "../note/noteInput"

const checkBlankNoteInputs = (formData: noteFormData, errors: Ref<string[]>) : boolean => {
    
    return checkBlankInputs(
        [
            { input: formData.name ? true : false, inputName: 'Title' },
            { input: formData.body ? true : false, inputName: 'Body' },
        ], errors)
}

export default checkBlankNoteInputs