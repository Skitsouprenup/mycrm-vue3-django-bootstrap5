import { Ref } from "vue"
import { checkBlankInputs } from "../forms/checkblankinputs"
import { leadFormData } from "./leadInput"

const checkBlankLeadInputs = (formData: leadFormData, errors: Ref<string[]>) : boolean => {
    
    return checkBlankInputs(
        [
            { input: formData.company ? true : false, inputName: 'Company' },
            { input: formData.contact_person ? true : false, inputName: 'Contact Person' },
            { input: formData.email ? true : false, inputName: 'E-mail' },
            { input: formData.phone ? true : false, inputName: 'Phone' },
            { input: formData.website ? true : false, inputName: 'Website' },
            { input: formData.confidence ? true : false, inputName: 'Confidence' },
            { input: formData.estimated_value ? true : false, inputName: 'Estimated Value' },
        ], errors)
}

export default checkBlankLeadInputs