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
