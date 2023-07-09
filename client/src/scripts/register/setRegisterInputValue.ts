
export type registerInputDataType = {[id: string] : string | number}

export const registerInputData = [
    { id: 'email', label: 'E-mail', type: 'email', model: 'username' },
    { id: 'lastname', label: 'Lastname', type: 'text', model: 'last_name' },
    { id: 'firstname', label: 'Firstname', type: 'text', model: 'first_name' },
    { id: 'password', label: 'Password', type: 'password', model: 'password' },
    { id: 're-pass', label: 'Repeat Password', type: 'password', model: 'repeat_pass' },
]

export const setRegisterInputValue = (
    formData: registerInputDataType,
    state: string, 
    element: EventTarget | null) => {
  
    if(element) {
        const value = (element as HTMLInputElement).value
  
        if(typeof(formData[state]) === 'number') 
            formData[state] = Number(value)
        else formData[state] = value
    }
  }