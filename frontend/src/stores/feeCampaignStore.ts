import { defineStore } from 'pinia'
import * as feeCampaignService from '@/services/feeCampaignService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'
import type { FeeCampaign } from '@/types/fee_campaign'

export const useFeeCampaignStore = defineStore('feeCampaign', () => {
  const feeCampaigns = ref([])
  const pagination = reactive({
    current_page: defaultPagination.current_page,
    total: defaultPagination.total,
    total_pages: defaultPagination.total_pages,
    per_page: 12,
  })
  const search = ref('')
  const feeTypeId = ref<number | null>(null)
  const startDate = ref<string | null>(null)
  const endDate = ref<string | null>(null)
  const loading = ref(false)
  const selectedFeeCampaign = ref<FeeCampaign | null>(null)

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchFeeCampaigns()
  }

  const fetchFeeCampaigns = async () => {
    try {
      loading.value = true

      const trimmedSearch = search.value.trim()

      const response = await feeCampaignService.fetchFeeCampaigns(
        trimmedSearch.length > 0 ? trimmedSearch : null,
        pagination.current_page,
        pagination.per_page,
        feeTypeId.value,
        startDate.value,
        endDate.value,
      )

      feeCampaigns.value = response.data
      pagination.total = response.pagination.total
      pagination.total_pages = response.pagination.total_pages

      loading.value = false
    } catch (error) {
      notifyError('Không thể tải dữ liệu đợt thu')
      console.error(error)
      loading.value = false
    }
  }

  const createFeeCampaign = async (feeCampaign: FeeCampaign) => {
    try {
      loading.value = true
      await feeCampaignService.createFeeCampaign(feeCampaign)
      notifySuccess('Tạo đợt thu thành công')
      await fetchFeeCampaigns()
    } catch (error) {
      notifyError('Lỗi khi tạo đợt thu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const updateFeeCampaign = async (id: number, feeCampaign: FeeCampaign) => {
    try {
      loading.value = true
      await feeCampaignService.updateFeeCampaign(id, feeCampaign)
      notifySuccess('Cập nhật đợt thu thành công')
      fetchFeeCampaigns()
    } catch (error) {
      notifyError('Lỗi khi cập nhật đợt thu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteFeeCampaign = async (id: number) => {
    try {
      loading.value = true
      await feeCampaignService.deleteFeeCampaign(id)
      notifySuccess('Xóa đợt thu thành công')
      fetchFeeCampaigns()
    } catch (error) {
      notifyError('Lỗi khi xóa đợt thu')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const deleteSelected = async (ids: number[]) => {
    try {
      loading.value = true
      for (const id of ids) {
        await feeCampaignService.deleteFeeCampaign(id)
      }
      notifySuccess('Đã xóa các đợt thu được chọn')
      await fetchFeeCampaigns()
    } catch (error) {
      notifyError('Lỗi khi xóa các đợt thu đã chọn')
    } finally {
      loading.value = false
    }
  }

  return {
    feeCampaigns,
    selectedFeeCampaign,
    loading,
    pagination,
    search,
    feeTypeId,
    startDate,
    endDate,
    handlePageChange,
    fetchFeeCampaigns,
    createFeeCampaign,
    updateFeeCampaign,
    deleteFeeCampaign,
    deleteSelected,
    notifyError,
    notifySuccess,
  }
})
