import { Ref } from "vue"
import { unknownObjectType } from "../utilities/ObjectProperty"

export const setInputValue = (
    formData: unknownObjectType,
    state: string, 
    element: EventTarget | null) => {
  
    if(element) {
        const value = (element as HTMLInputElement).value
  
        if(typeof(formData[state]) === 'number') 
            formData[state] = Number(value)
        else formData[state] = value
    }
}

export const setInputValueRef = (
    formData: Ref<unknownObjectType | null>,
    state: string, 
    element: EventTarget | null) => {
  
    if(element) {
        const value = (element as HTMLInputElement).value
  
        if(formData.value) {
          if(typeof(formData.value[state]) === 'number') 
            formData.value[state] = Number(value)
          else formData.value[state] = value
        }
    }
}