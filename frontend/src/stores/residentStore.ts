import { defineStore } from 'pinia'
import * as residentService from '@/services/residentService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { Resident } from '@/types/resident'

export const useResidentStore = defineStore('resident', () => {
  const residents = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })
  const search = ref('')
  const householdId = ref<number | null>(null)
  const status = ref<number | null>(null)
  const loading = ref(false)
  const selectedResident = ref<Resident | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchResidents()
  }

  const fetchResidents = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await residentService.fetchResidents(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
        householdId.value,
        status.value,
      )

      residents.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Không thể tải dữ liệu nhân khẩu')
      console.error(error)
      loading.value = false
    }
  }

  const createResident = async (resident: Resident) => {
    try {
      loading.value = true
      await residentService.createResident(resident)
      notifySuccess('Tạo thông tin nhân khẩu thành công')
      await fetchResidents()
    } catch (error) {
      notifyError('Lỗi khi tạo thông tin nhân khẩu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateResident = async (id: number, resident: Resident) => {
    try {
      loading.value = true
      await residentService.updateResident(id, resident)
      notifySuccess('Cập nhật thông tin nhân khẩu thành công')
      fetchResidents()
    } catch (error) {
      notifyError('Lỗi khi cập nhật thông tin nhân khẩu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteResident = async (id: number) => {
    try {
      loading.value = true
      await residentService.deleteResident(id)
      notifySuccess('Xóa thông tin nhân khẩu thành công')
      fetchResidents()
    } catch (error) {
      notifyError('Lỗi khi xóa thông tin nhân khẩu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await residentService.deleteResident(id)
      }
      notifySuccess('Đã xóa nhân khẩu được chọn')
      await fetchResidents()
    } catch (error) {
      notifyError('Lỗi khi xóa nhân khẩu đã chọn')
    } finally {
      loading.value = false
    }
  }

  return {
    residents,
    selectedResident,
    loading,
    pagination,
    search,
    householdId,
    status,
    handlePageChange,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
    deleteSelected,
    notifyError,
    notifySuccess,
  }
})
