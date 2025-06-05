import { Household } from './household'
import { FeeCampaign, FeeType } from './fee_campaign'

export interface HouseholdFeeAssignment {
  id: number
  fee_campaign_id: number
  household_id: number
  amount_due: number
  amount_paid: number
  payment_date: string | null
  paid_by: number | null
  payment_status: number // 1: unpaid, 2: paid, 3: partially paid
  created_at: string
  updated_at: string

  // Related objects
  campaign?: {
    id: number
    fee_type_id: number
    start_date: string
    end_date: string
    note: string
    fee_type?: FeeType
  }
  household?: {
    id: number
    owner_name: string
    apartment_code: string
    address: string
    phone_number: string
  }
  user?: {
    id: number
    fullname: string
    email: string
  }
}

export interface CreateHouseholdFeeAssignmentRequest {
  fee_campaign_id: number
  household_id: number
  amount_due: number
  amount_paid?: number
  payment_date?: string
  paid_by?: number
  payment_status?: number
}

export interface UpdateHouseholdFeeAssignmentRequest {
  fee_campaign_id?: number
  household_id?: number
  amount_due?: number
  amount_paid?: number
  payment_date?: string
  paid_by?: number
  payment_status?: number
}

export interface MarkAsPaidRequest {
  amount_paid: number
  payment_date?: string
}

export interface BulkCreateHouseholdFeeAssignmentRequest {
  fee_campaign_id: number
  assignments: {
    household_id: number
    amount_due: number
  }[]
}

export interface HouseholdFeeAssignmentFilters {
  search?: string
  fee_campaign_id?: number
  household_id?: number
  payment_status?: number
  start_date?: string
  end_date?: string
}
