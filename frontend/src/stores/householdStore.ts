import { defineStore } from 'pinia'
import * as householdService from '@/services/householdService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { ref, reactive } from 'vue'
import { defaultPagination } from '@/constants/pagination'

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

  const handlePageChange = (page: number) => {
    pagination.current_page = page
    fetchHouseholds()
  }

  return {
    households,
    fetchHouseholds,
    handlePageChange,
    pagination,
    search,
    notifyError,
    notifySuccess,
  }
})
