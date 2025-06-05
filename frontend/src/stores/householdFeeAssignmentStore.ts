import { defineStore } from 'pinia'
import * as householdFeeAssignmentService from '@/services/householdFeeAssignmentService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { HouseholdFeeAssignment } from '@/types/householdFeeAssignment'

export const useHouseholdFeeAssignmentStore = defineStore('householdFeeAssignment', () => {
  const householdFeeAssignments = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })

  const search = ref('')
  const householdId = ref<number | null>(null)
  const feeCampaignId = ref<number | null>(null)
  const paymentStatus = ref<number | null>(null)
  const loading = ref(false)
  const selectedAssignment = ref<HouseholdFeeAssignment | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchHouseholdFeeAssignments()
  }

  const fetchHouseholdFeeAssignments = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await householdFeeAssignmentService.fetchHouseholdFeeAssignments(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
        householdId.value,
        feeCampaignId.value,
        paymentStatus.value,
      )

      householdFeeAssignments.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Failed to fetch household fee assignments')
      console.error(error)
      loading.value = false
    }
  }

  const createHouseholdFeeAssignment = async (assignment: HouseholdFeeAssignment) => {
    try {
      loading.value = true
      await householdFeeAssignmentService.createHouseholdFeeAssignment(assignment)
      notifySuccess('Tạo thu phí hộ gia đình thành công')
      await fetchHouseholdFeeAssignments()
    } catch (error) {
      notifyError('Lỗi khi tạo thu phí hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateHouseholdFeeAssignment = async (id: number, assignment: HouseholdFeeAssignment) => {
    try {
      loading.value = true
      await householdFeeAssignmentService.updateHouseholdFeeAssignment(id, assignment)
      notifySuccess('Cập nhật thu phí hộ gia đình thành công')
      fetchHouseholdFeeAssignments()
    } catch (error) {
      notifyError('Lỗi khi cập nhật thu phí hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteHouseholdFeeAssignment = async (id: number) => {
    try {
      loading.value = true
      await householdFeeAssignmentService.deleteHouseholdFeeAssignment(id)
      notifySuccess('Xóa thu phí hộ gia đình thành công')
      fetchHouseholdFeeAssignments()
    } catch (error) {
      notifyError('Lỗi khi xóa thu phí hộ gia đình')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await householdFeeAssignmentService.deleteHouseholdFeeAssignment(id)
      }
      notifySuccess('Đã xóa thu phí hộ gia đình được chọn')
      await fetchHouseholdFeeAssignments()
    } catch (error) {
      notifyError('Lỗi khi xóa thu phí hộ gia đình đã chọn')
    } finally {
      loading.value = false
    }
  }

  const resetFilters = () => {
    search.value = ''
    householdId.value = null
    feeCampaignId.value = null
    paymentStatus.value = null
    pagination.current_page = 1
    fetchHouseholdFeeAssignments()
  }

  return {
    householdFeeAssignments,
    selectedAssignment,
    loading,
    pagination,
    search,
    householdId,
    feeCampaignId,
    paymentStatus,
    handlePageChange,
    fetchHouseholdFeeAssignments,
    createHouseholdFeeAssignment,
    updateHouseholdFeeAssignment,
    deleteHouseholdFeeAssignment,
    deleteSelected,
    resetFilters,
  }
})
