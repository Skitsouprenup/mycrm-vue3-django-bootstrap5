import { AxiosError } from "axios"
import { Ref } from "vue"

type responseDataType = {[index: string] : string}

const formError = (error: AxiosError, errors: Ref<string[]>) => {
    const resp = error?.response
    console.log(resp?.status)
    if(resp && resp?.status < 500) {
        const responseData : responseDataType = 
            resp?.data as responseDataType
        if(!responseData) return

        for(const key in responseData) {
            errors.value.push(`${key} : ${responseData[key]}`)
        }
    }
    else {
        errors.value.push('Something went wrong! Try again later.')
        console.error(error)
    }
}

export default formError