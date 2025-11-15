import axiosInstance from '@/utils/axiosInstance'

export const fetchHouseholdFeeAssignments = async (
  search: string | null,
  page: number,
  perPage: number,
  household_id: number | null = null,
  fee_campaign_id: number | null = null,
  payment_status: number | null = null,
) => {
  try {
    const response = await axiosInstance.get('/household-fee-assignments', {
      params: {
        search,
        page,
        per_page: perPage,
        household_id,
        fee_campaign_id,
        payment_status,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching household fee assignments:', error)
    throw error
  }
}

export const getHouseholdFeeAssignmentById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/household-fee-assignments/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching household fee assignment:', error)
    throw error
  }
}

export const createHouseholdFeeAssignment = async (assignmentData: any) => {
  try {
    const response = await axiosInstance.post('/household-fee-assignments', assignmentData)
    return response.data
  } catch (error) {
    console.error('Error creating household fee assignment:', error)
    throw error
  }
}

export const updateHouseholdFeeAssignment = async (id: number, assignmentData: any) => {
  try {
    const response = await axiosInstance.put(`/household-fee-assignments/${id}`, assignmentData)
    return response.data
  } catch (error) {
    console.error('Error updating household fee assignment:', error)
    throw error
  }
}

export const deleteHouseholdFeeAssignment = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/household-fee-assignments/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting household fee assignment:', error)
    throw error
  }
}

export const batchCreateHouseholdFeeAssignments = async (
  fee_campaign_id: number,
  household_ids?: number[],
) => {
  try {
    const response = await axiosInstance.post('/household-fee-assignments/batch', {
      fee_campaign_id,
      household_ids: household_ids || [],
    })
    return response.data
  } catch (error) {
    console.error('Error batch creating household fee assignments:', error)
    throw error
  }
}
