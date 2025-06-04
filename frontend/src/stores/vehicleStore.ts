import { defineStore } from 'pinia'
import * as vehicleService from '@/services/vehicleService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { Vehicle } from '@/types/vehicle'

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })
  const search = ref('')
  const householdId = ref<number | null>(null)
  const type = ref<number | null>(null)
  const loading = ref(false)
  const selectedVehicle = ref<Vehicle | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchVehicles()
  }

  const fetchVehicles = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await vehicleService.fetchVehicles(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
        householdId.value,
        type.value,
      )

      vehicles.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Không thể tải dữ liệu phương tiện')
      console.error(error)
      loading.value = false
    }
  }

  const createVehicle = async (vehicle: Vehicle) => {
    try {
      loading.value = true
      await vehicleService.createVehicle(vehicle)
      notifySuccess('Tạo thông tin phương tiện thành công')
      await fetchVehicles()
    } catch (error) {
      notifyError('Lỗi khi tạo thông tin phương tiện')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id: number, vehicle: Vehicle) => {
    try {
      loading.value = true
      await vehicleService.updateVehicle(id, vehicle)
      notifySuccess('Cập nhật thông tin phương tiện thành công')
      fetchVehicles()
    } catch (error) {
      notifyError('Lỗi khi cập nhật thông tin phương tiện')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (id: number) => {
    try {
      loading.value = true
      await vehicleService.deleteVehicle(id)
      notifySuccess('Xóa thông tin phương tiện thành công')
      fetchVehicles()
    } catch (error) {
      notifyError('Lỗi khi xóa thông tin phương tiện')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await vehicleService.deleteVehicle(id)
      }
      notifySuccess('Đã xóa phương tiện được chọn')
      await fetchVehicles()
    } catch (error) {
      notifyError('Lỗi khi xóa phương tiện đã chọn')
    } finally {
      loading.value = false
    }
  }

  return {
    vehicles,
    selectedVehicle,
    loading,
    pagination,
    search,
    householdId,
    type,
    handlePageChange,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    deleteSelected,
    notifyError,
    notifySuccess,
  }
})
