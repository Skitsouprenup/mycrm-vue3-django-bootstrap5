import { Ref } from "vue"

type paramTypes = Array<{
    input: boolean,
    inputName: string
}>
export const checkBlankInputs = (inputs : paramTypes, errors: Ref<string[]>) => {
    
    for(const inputObj of inputs) {
        if(!inputObj.input)
            errors.value.push(`${inputObj.inputName} field is empty!`)
    }
    
    if(errors.value.length > 0) return true
    else return false 
}