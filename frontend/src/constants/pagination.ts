import { reactive } from 'vue'
export const defaultPagination = reactive({
  current_page: 1,
  total: 0,
  total_pages: 1,
  per_page: 10,
})
