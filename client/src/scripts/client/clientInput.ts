export type clientFormData = {
  name: string,
  contact_person: string,
  email: string,
  phone: string,
  website: string,
}

export const clientInputData = [
    { id: 'name', label: 'Name', type: 'text', model: 'name' },
    { id: 'contact', label: 'Contact Person', type: 'input', 
      model: 'contact_person',
    },
    { id: 'email', label: 'E-mail', type: 'email', model: 'email' },
    { id: 'phone', label: 'Phone', type: 'text', model: 'phone' },
    { id: 'website', label: 'Website', type: 'text', model: 'website' },
]

export const clientInfo = [
  { label: 'Name', name: 'name' },
  { label: 'Contact Person', name: 'contact_person' },
  { label: 'E-mail', name: 'email' },
  { label: 'Phone', name: 'phone' },
  { label: 'Website', name: 'website' },
  { label: 'Created at', name: 'created_at' },
  { label: 'Modified at', name: 'modified_at' },
]