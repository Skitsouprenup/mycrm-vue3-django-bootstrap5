import { Ref } from "vue"
import { clientFormData } from "./clientInput"
import { checkBlankInputs } from "../forms/checkblankinputs"

const checkBlankClientInputs = (formData: clientFormData, errors: Ref<string[]>) : boolean => {
    
    return checkBlankInputs(
        [
            { input: formData.name ? true : false, inputName: 'Name' },
            { input: formData.contact_person ? true : false, inputName: 'Contact Person' },
            { input: formData.email ? true : false, inputName: 'E-mail' },
            { input: formData.phone ? true : false, inputName: 'Phone' },
            { input: formData.website ? true : false, inputName: 'Website' },
        ], errors)
}

export default checkBlankClientInputs