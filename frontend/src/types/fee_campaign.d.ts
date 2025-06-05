export interface FeeCampaign {
  id?: number | null
  fee_type_id: number
  start_date: string
  end_date: string
  note?: string
  created_at?: string
  updated_at?: string
  fee_type?: {
    id: number
    fee_name: string
    description: string
    is_mandatory: boolean
    unit: number
    calculation_method: number
    default_amount: number
  }
}
