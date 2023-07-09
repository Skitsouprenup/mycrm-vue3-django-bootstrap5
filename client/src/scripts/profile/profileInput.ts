export type profileFormData = {
    first_name: string,
    last_name: string,
  }

export const profileInputData = [
    { id: 'firstname', label: 'First Name', type: 'text', model: 'first_name' },
    { id: 'lastname', label: 'Last Name', type: 'text', model: 'last_name' },
]

export const profileViewData = [
  { label: 'Username', model: 'username' },
  { label: 'First Name', model: 'first_name' },
  { label: 'Last Name', model: 'last_name' },
]