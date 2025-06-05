export interface FeeType {
  id?: number | null
  fee_name: string
  description: string
  is_mandatory: boolean
  unit: number
  calculation_method: number
  default_amount: number
  created_at?: string
  updated_at?: string
}
