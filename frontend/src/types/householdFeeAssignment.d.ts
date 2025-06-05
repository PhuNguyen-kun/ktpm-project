export interface HouseholdFeeAssignment {
  id?: number | null
  fee_campaign_id: number
  household_id: number
  amount_due: number
  amount_paid: number
  payment_date: string | null
  paid_by: number | null
  payment_status: number // 1 unpaid, 2 paid, 3 partial
  fee_campaign?: {
    id: number
    fee_type_id: number
    start_date: string
    end_date: string
    note: string
    fee_type?: {
      id: number
      fee_name: string
      description: string
      is_mandatory: boolean
      unit: string
      calculation_method: string
      default_amount: number
    }
  }
  household?: {
    id: number
    household_number: string
    area: number
    address: string
  }
  paid_by_resident?: {
    id: number
    full_name: string
    identity_number: string
  }
}
