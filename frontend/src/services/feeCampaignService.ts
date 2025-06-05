import axiosInstance from '@/utils/axiosInstance'

export const fetchFeeCampaigns = async (
  search: string | null,
  page: number,
  perPage: number,
  feeTypeId: number | null = null,
  startDate: string | null = null,
  endDate: string | null = null,
) => {
  try {
    const response = await axiosInstance.get('/fee-campaigns', {
      params: {
        search: search,
        page: page,
        per_page: perPage,
        fee_type_id: feeTypeId,
        start_date: startDate,
        end_date: endDate,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching fee campaigns:', error)
    throw error
  }
}

export const createFeeCampaign = async (feeCampaignData: any) => {
  try {
    const response = await axiosInstance.post('/fee-campaigns', feeCampaignData)
    return response.data
  } catch (error) {
    console.error('Error creating fee campaign:', error)
    throw error
  }
}

export const updateFeeCampaign = async (id: number, feeCampaignData: any) => {
  try {
    const response = await axiosInstance.put(`/fee-campaigns/${id}`, feeCampaignData)
    return response.data
  } catch (error) {
    console.error('Error updating fee campaign:', error)
    throw error
  }
}

export const deleteFeeCampaign = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/fee-campaigns/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting fee campaign:', error)
    throw error
  }
}
