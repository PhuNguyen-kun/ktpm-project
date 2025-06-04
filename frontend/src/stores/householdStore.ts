import { defineStore } from 'pinia'
import * as householdService from '@/services/householdService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { Household } from '@/types/household'

export const useHouseholdStore = defineStore('household', () => {
  const households = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })
  const search = ref('')
  const loading = ref(false)
  const selectedHousehold = ref<Household | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchHouseholds()
  }

  const fetchHouseholds = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await householdService.fetchHouseholds(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
      )

      households.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Failed to fetch households')
      console.error(error)
      loading.value = false
    }
  }

  const createHousehold = async (household: Household) => {
    try {
      loading.value = true
      await householdService.createHousehold(household)
      notifySuccess('Tạo hộ gia đình thành công')
      await fetchHouseholds()
    } catch (error) {
      notifyError('Lỗi khi tạo hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateHousehold = async (id: number, household: Household) => {
    try {
      loading.value = true
      await householdService.updateHousehold(id, household)
      notifySuccess('Cập nhật hộ gia đình thành công')
      fetchHouseholds()
    } catch (error) {
      notifyError('Lỗi khi cập nhật hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteHousehold = async (id: number) => {
    try {
      loading.value = true
      await householdService.deleteHousehold(id)
      notifySuccess('Xóa hộ gia đình thành công')
      fetchHouseholds()
    } catch (error) {
      notifyError('Lỗi khi xóa hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await householdService.deleteHousehold(id)
      }
      notifySuccess('Đã xóa hộ gia đình được chọn')
      await fetchHouseholds()
    } catch (error) {
      notifyError('Lỗi khi xóa hộ gia đình đã chọn')
    } finally {
      loading.value = false
    }
  }

  return {
    households,
    selectedHousehold,
    loading,
    pagination,
    search,
    handlePageChange,
    fetchHouseholds,
    createHousehold,
    updateHousehold,
    deleteHousehold,
    deleteSelected,
    notifyError,
    notifySuccess,
  }
})
