import axiosInstance from '@/utils/axiosInstance'

export const fetchHouseholds = async (search: string | null, page: number, perPage: number) => {
  try {
    const response = await axiosInstance.get('/households', {
      params: {
        search: search,
        page: page,
        per_page: perPage,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching households:', error)
    throw error
  }
}

export const createHousehold = async (householdData: any) => {
  try {
    const response = await axiosInstance.post('/households', householdData)
    return response.data
  } catch (error) {
    console.error('Error creating household:', error)
    throw error
  }
}

export const updateHousehold = async (id: number, householdData: any) => {
  try {
    const response = await axiosInstance.put(`/households/${id}`, householdData)
    return response.data
  } catch (error) {
    console.error('Error updating household:', error)
    throw error
  }
}

export const deleteHousehold = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/households/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting household:', error)
    throw error
  }
}
