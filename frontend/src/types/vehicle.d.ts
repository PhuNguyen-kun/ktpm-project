export interface Vehicle {
  id?: number | null
  household_id: number
  type: number
  plate_number: string
  registered_date?: string
  created_at?: string
  updated_at?: string
  household?: {
    id: number
    owner_name: string
    apartment_code: string
    address: string
    phone_number: string
  }
}
