<template>
  <h1 class="admin-page__title">Quản lý Hộ gia đình</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 700px">
      <el-input
        v-model="householdStore.search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên chủ hộ, mã căn hộ, địa chỉ hoặc số điện thoại"
        @change="handleSearch"
      />

      <Button class="btn btn--primary" @click="handleSearch">
        <el-icon>
          <Search />
        </el-icon>
      </Button>
    </div>
    <div class="admin-page__heading--right">
      <Button v-if="selectedRows.length" class="btn btn--danger" @click="openDeleteSelectedConfirm">
        <el-icon class="btn--nicer">
          <Delete />
        </el-icon>
        <span>Xóa các mục đã chọn</span>
      </Button>
      <!-- <Button
        v-if="selectedRows.length"
        class="btn btn--success"
        @click="openRestoreSelectedConfirm"
      >
        <el-icon class="btn--nicer">
          <RefreshLeft />
        </el-icon>
        <span>Khôi phục các mục đã chọn</span>
      </Button> -->
      <Button class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm hộ gia đình</span>
      </Button>
    </div>
  </div>

  <Table :columns="columns" :data="householdStore.households" :loading="fetchLoading">
    <template #actions="{ row }">
      <div class="action-buttons">
        <el-button
          v-if="row.deleted_at"
          size="small"
          type="text"
          @click="bookStore.restoreBook(row.id)"
        >
          Khôi phục
        </el-button>
        <template v-else>
          <el-button link size="small" type="primary" @click="openEditModal(row)">
            <img alt="Edit" src="@/assets/img/edit.svg" />
          </el-button>
          <div class="divider"></div>
          <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
            <img alt="Delete" src="@/assets/img/delete.svg" />
          </el-button>
        </template>
      </div>
    </template>
  </Table>

  <Pagination
    :pagination="householdStore.pagination"
    @changePage="(page: number) => householdStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted } from 'vue'
import { useHouseholdStore } from '@/stores/householdStore'
import Pagination from '@/components/Pagination.vue'

const householdStore = useHouseholdStore()
const fetchLoading = ref<boolean>(false)
const deleteSelectedConfirmVisible = ref<boolean>(false)
const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const handleSearch = async () => {
  householdStore.pagination.current_page = 1
  await householdStore.fetchHouseholds()
}

const openCreateModal = () => {}

const openEditModal = () => {}

const openDeleteConfirm = () => {}

const selectedRows = ref([])

const columns = ref([
  {
    prop: 'owner_name',
    label: 'Tên chủ hộ',
    width: 200,
    type: 'string',
    fixed: 'left',
    lineClamp: 2,
  },
  {
    prop: 'apartment_code',
    label: 'Mã căn hộ',
    width: 150,
    type: 'string',
    fixed: 'left',
  },
  {
    prop: 'address',
    label: 'Địa chỉ',
    width: 300,
    type: 'string',
  },
  {
    prop: 'phone_number',
    label: 'Số điện thoại',
    width: 150,
    type: 'string',
  },
  { prop: 'actions', label: 'Hành động', width: 125, align: 'center', fixed: 'right' },
])

onMounted(() => {
  householdStore.fetchHouseholds()
})
</script>
