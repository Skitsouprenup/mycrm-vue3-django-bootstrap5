import { Ref } from "vue"
import { checkBlankInputs } from "../forms/checkblankinputs"
import { profileFormData } from '../profile/profileInput'

const checkBlankProfileInputs = (formData: profileFormData, errors: Ref<string[]>) : boolean => {
    
    return checkBlankInputs(
        [
            { input: formData.first_name ? true : false, inputName: 'First Name' },
            { input: formData.last_name ? true : false, inputName: 'Last Name' },
        ], errors)
}

export default checkBlankProfileInputs