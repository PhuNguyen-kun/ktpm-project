import axiosInstance from '@/utils/axiosInstance'

export const fetchVehicles = async (
  search: string | null,
  page: number,
  perPage: number,
  householdId: number | null,
  type: number | null,
) => {
  try {
    const response = await axiosInstance.get('/vehicles', {
      params: {
        search: search,
        page: page,
        per_page: perPage,
        household_id: householdId,
        type: type,
      },
    })
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
}

export const createVehicle = async (vehicleData: any) => {
  try {
    const response = await axiosInstance.post('/vehicles', vehicleData)
    return response.data
  } catch (error) {
    console.error('Error creating vehicle:', error)
    throw error
  }
}

export const updateVehicle = async (id: number, vehicleData: any) => {
  try {
    const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData)
    return response.data
  } catch (error) {
    console.error('Error updating vehicle:', error)
    throw error
  }
}

export const deleteVehicle = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/vehicles/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw error
  }
}
