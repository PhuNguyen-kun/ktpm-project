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

  <Table
    :columns="columns"
    :data="householdStore.households"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #actions="{ row }">
      <div class="action-buttons">
        <el-button link size="small" type="primary" @click="openEditModal(row)">
          <img alt="Edit" src="@/assets/img/edit.svg" />
        </el-button>
        <div class="divider"></div>
        <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
          <img alt="Delete" src="@/assets/img/delete.svg" />
        </el-button>
      </div>
    </template>
  </Table>

  <Modal
    :title="'Xác nhận xóa'"
    :visible="deleteConfirmVisible"
    style="width: 500px; height: 150px"
    @submit="handleDelete"
    @update:visible="deleteConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn xóa hộ gia đình này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa hộ gia đình đã chọn?</span>
  </Modal>

  <Modal
    :title="modalTitle"
    :visible="isModalVisible"
    style="width: 600px"
    :form-ref="formRef || undefined"
    @close="resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
    class="big-modal"
  >
    <el-form
      ref="formRef"
      :model="household"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên chủ hộ" prop="owner_name">
        <el-input v-model="household.owner_name" placeholder="Nhập tên chủ hộ"></el-input>
      </el-form-item>
      <el-form-item label="Mã căn hộ" prop="apartment_code">
        <el-input v-model="household.apartment_code" placeholder="Nhập mã căn hộ"></el-input>
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="address">
        <el-input
          v-model="household.address"
          placeholder="Nhập địa chỉ"
          rows="5"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone_number">
        <el-input v-model="household.phone_number" placeholder="Nhập số điện thoại"></el-input>
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="householdStore.pagination"
    @changePage="(page: number) => householdStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { useHouseholdStore } from '@/stores/householdStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { Household } from '@/types/household'

const householdStore = useHouseholdStore()
const fetchLoading = ref<boolean>(false)

const handleSearch = async () => {
  householdStore.pagination.current_page = 1
  await householdStore.fetchHouseholds()
}

const household = reactive({
  id: '',
  owner_name: '',
  apartment_code: '',
  address: '',
  phone_number: '',
})

// Delete household
const deleteConfirmVisible = ref<boolean>(false)
const deleteHouseholdId = ref()

const openDeleteConfirm = (id: number) => {
  deleteHouseholdId.value = id
  deleteConfirmVisible.value = true
  console.log(deleteHouseholdId.value)
}

const handleDelete = () => {
  if (deleteHouseholdId.value) {
    householdStore.deleteHousehold(deleteHouseholdId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected households
const selectedRows = ref([])
const deleteSelectedConfirmVisible = ref(false)
// @ts-ignore
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log(selectedRows.value)
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((household: any) => household.id)
  await householdStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit household
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  householdStore.selectedHousehold = null
  Object.assign(household, {
    id: '',
    owner_name: '',
    apartment_code: '',
    address: '',
    phone_number: '',
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm hộ gia đình'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedHousehold: Household) => {
  modalTitle.value = 'Chỉnh sửa hộ gia đình'
  isModalVisible.value = true

  householdStore.selectedHousehold = selectedHousehold

  Object.assign(household, {
    id: selectedHousehold.id,
    owner_name: selectedHousehold.owner_name,
    apartment_code: selectedHousehold.apartment_code,
    address: selectedHousehold.address,
    phone_number: selectedHousehold.phone_number,
  })
}

const handleSubmit = async () => {
  console.log(householdStore.selectedHousehold)

  try {
    if (householdStore.selectedHousehold) {
      // @ts-ignore
      await householdStore.updateHousehold(household.id, household)
    } else {
      // @ts-ignore
      await householdStore.createHousehold(household)
    }
    isModalVisible.value = false
  } finally {
    resetForm()
  }
}

const columns = ref<IColumn[]>([
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
  {
    prop: 'actions',
    label: 'Hành động',
    width: 125,
    align: 'center',
    fixed: 'right',
    type: 'function',
  },
])

const formRules = {
  owner_name: [
    { required: true, message: 'Vui lòng nhập tên chủ hộ', trigger: 'blur' },
    { min: 2, max: 50, message: 'Tên chủ hộ phải từ 2 đến 50 ký tự', trigger: 'blur' },
  ],
  apartment_code: [
    { required: true, message: 'Vui lòng nhập mã căn hộ', trigger: 'blur' },
    { min: 1, max: 20, message: 'Mã căn hộ phải từ 1 đến 20 ký tự', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' },
    { min: 5, max: 100, message: 'Địa chỉ phải từ 5 đến 100 ký tự', trigger: 'blur' },
  ],
  phone_number: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' },
  ],
}

onMounted(() => {
  householdStore.fetchHouseholds()
})
</script>
