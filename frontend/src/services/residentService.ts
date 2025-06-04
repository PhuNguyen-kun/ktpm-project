import axiosInstance from '@/utils/axiosInstance'

export const fetchResidents = async (
  search: string | null,
  page: number,
  perPage: number,
  householdId: number | null,
  status: number | null,
) => {
  try {
    const response = await axiosInstance.get('/residents', {
      params: {
        search: search,
        page: page,
        per_page: perPage,
        household_id: householdId,
        status: status,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching residents:', error)
    throw error
  }
}

export const createResident = async (residentData: any) => {
  try {
    const response = await axiosInstance.post('/residents', residentData)
    return response.data
  } catch (error) {
    console.error('Error creating resident:', error)
    throw error
  }
}

export const updateResident = async (id: number, residentData: any) => {
  try {
    const response = await axiosInstance.put(`/residents/${id}`, residentData)
    return response.data
  } catch (error) {
    console.error('Error updating resident:', error)
    throw error
  }
}

export const deleteResident = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/residents/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting resident:', error)
    throw error
  }
}
