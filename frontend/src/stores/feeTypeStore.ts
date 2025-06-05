import { defineStore } from 'pinia'
import * as feeTypeService from '@/services/feeTypeService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { FeeType } from '@/types/fee_type'

export const useFeeTypeStore = defineStore('feeType', () => {
  const feeTypes = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })
  const search = ref('')
  const isMandatoryFilter = ref<boolean | null>(null)
  const loading = ref(false)
  const selectedFeeType = ref<FeeType | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchFeeTypes()
  }

  const fetchFeeTypes = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await feeTypeService.fetchFeeTypes(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
        isMandatoryFilter.value,
      )

      feeTypes.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Không thể tải dữ liệu loại phí')
      console.error(error)
      loading.value = false
    }
  }

  const createFeeType = async (feeType: FeeType) => {
    try {
      loading.value = true
      await feeTypeService.createFeeType(feeType)
      notifySuccess('Tạo loại phí thành công')
      await fetchFeeTypes()
    } catch (error) {
      notifyError('Lỗi khi tạo loại phí')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateFeeType = async (id: number, feeType: FeeType) => {
    try {
      loading.value = true
      await feeTypeService.updateFeeType(id, feeType)
      notifySuccess('Cập nhật loại phí thành công')
      fetchFeeTypes()
    } catch (error) {
      notifyError('Lỗi khi cập nhật loại phí')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteFeeType = async (id: number) => {
    try {
      loading.value = true
      await feeTypeService.deleteFeeType(id)
      notifySuccess('Xóa loại phí thành công')
      fetchFeeTypes()
    } catch (error) {
      notifyError('Lỗi khi xóa loại phí')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await feeTypeService.deleteFeeType(id)
      }
      notifySuccess('Đã xóa loại phí được chọn')
      await fetchFeeTypes()
    } catch (error) {
      notifyError('Lỗi khi xóa loại phí đã chọn')
    } finally {
      loading.value = false
    }
  }

  return {
    feeTypes,
    selectedFeeType,
    loading,
    pagination,
    search,
    isMandatoryFilter,
    handlePageChange,
    fetchFeeTypes,
    createFeeType,
    updateFeeType,
    deleteFeeType,
    deleteSelected,
    notifyError,
    notifySuccess,
  }
})
