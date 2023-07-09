interface leadForm {
  company: string,
  contact_person: string,
  email: string,
  phone: string,
  website: string,
  assigned_to: string,
  confidence: number,
  estimated_value: number,
  status: string,
  priority: string,
}

export type leadFormData = {
  [key in keyof leadForm]: string | number
}

export const leadInputData = [
    { id: 'company', label: 'Company', type: 'input', model: 'company' },
    { id: 'contact', label: 'Contact Person', type: 'input', 
      model: 'contact_person',
    },
    { id: 'email', label: 'E-mail', type: 'email', model: 'email' },
    { id: 'phone', label: 'Phone', type: 'text', model: 'phone' },
    { id: 'website', label: 'Website', type: 'text', model: 'website' },
    { id: 'confidence', label: 'Confidence', type: 'number', model: 'confidence' },
    { id: 'estVal', label: 'Estimated Value', type: 'number', model: 'estimated_value' },
    { id: 'team', label: 'Assigned to', type: 'text', model: 'assigned_to' }
]

export const detailsItems = [
  { label: 'Assigned to', name: 'assigned_to' },
  { label: 'Status', name: 'status' },
  { label: 'Priority', name: 'priority' },
  { label: 'Confidence', name: 'confidence' },
  { label: 'Estimated Value', name: 'estimated_value' },
  { label: 'Created at', name: 'created_at' },
  { label: 'Modified at', name: 'modified_at' },
]

export const contactInfoItems = [
  { label: 'Contact Person', name: 'contact_person'},
  { label: 'E-mail', name: 'email'},
  { label: 'Phone', name: 'phone'},
  { label: 'Website', name: 'website'},
]