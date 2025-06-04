export interface Resident {
  id?: number | null
  household_id: number
  full_name: string
  phone_number: string
  birth_date?: string
  birth_place?: string
  ethnicity?: string
  occupation?: string
  workplace?: string
  identity_number?: string
  issue_date?: string
  issue_place?: string
  status?: number
  gender?: number
  household?: {
    id: number
    owner_name: string
    apartment_code: string
    address: string
    phone_number: string
  }
}
