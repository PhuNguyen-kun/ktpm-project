import axiosInstance from '@/utils/axiosInstance'

export const fetchFeeTypes = async (
  search: string | null,
  page: number,
  perPage: number,
  is_mandatory: boolean | null = null,
) => {
  try {
    const response = await axiosInstance.get('/fee-types', {
      params: {
        search: search,
        page: page,
        per_page: perPage,
        is_mandatory: is_mandatory,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching fee types:', error)
    throw error
  }
}

export const createFeeType = async (feeTypeData: any) => {
  try {
    const response = await axiosInstance.post('/fee-types', feeTypeData)
    return response.data
  } catch (error) {
    console.error('Error creating fee type:', error)
    throw error
  }
}

export const updateFeeType = async (id: number, feeTypeData: any) => {
  try {
    const response = await axiosInstance.put(`/fee-types/${id}`, feeTypeData)
    return response.data
  } catch (error) {
    console.error('Error updating fee type:', error)
    throw error
  }
}

export const deleteFeeType = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/fee-types/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting fee type:', error)
    throw error
  }
}
