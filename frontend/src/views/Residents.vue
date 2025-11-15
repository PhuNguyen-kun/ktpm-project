<template>
  <h1 class="admin-page__title">Quản lý Nhân khẩu</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 75%">
      <el-input
        v-model="residentStore.search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên, số CMND/CCCD, số điện thoại"
        @change="handleSearch"
      />

      <div class="admin-page__filters">
        <el-select
          v-model="residentStore.status"
          placeholder="Lọc theo trạng thái"
          clearable
          class="admin-page__filter-select"
          @change="handleSearch"
        >
          <el-option label="Thường trú" :value="1" />
          <el-option label="Tạm trú" :value="2" />
          <el-option label="Đã chuyển đi" :value="3" />
        </el-select>
        <el-select
          v-model="residentStore.householdId"
          placeholder="Chọn hộ gia đình"
          clearable
          class="admin-page__filter-select-household"
          @change="handleSearch"
        >
          <el-option
            v-for="household in householdOptions"
            :key="household.value"
            :label="household.label"
            :value="household.value"
          />
        </el-select>
      </div>

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
      <el-tooltip
        v-if="!canModify"
        content="Chỉ tổ trưởng/tổ phó mới có thể thêm"
        placement="top"
        effect="light"
      >
        <Button
          class="btn btn--primary disabled-icon"
          @click="openCreateModal"
          :disabled="!canModify"
        >
          <el-icon class="btn--nicer" style="margin-top: -3px">
            <Plus />
          </el-icon>
          <span>Thêm nhân khẩu</span>
        </Button>
      </el-tooltip>
      <Button v-else class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm nhân khẩu</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="residentStore.residents"
    :loading="fetchLoading"
    :row-class-name="tableRowClassName"
    @selection-change="handleSelectionChange"
  >
    <template #household_apartment_code="{ row }">
      {{ row.household?.apartment_code || 'Chưa có' }}
    </template>

    <template #status="{ row }">
      <el-tag
        :type="getStatusTagType(row.status).type"
        :effect="getStatusTagType(row.status).effect"
        round
      >
        {{ getStatusLabel(row.status) }}
      </el-tag>
    </template>

    <template #gender="{ row }">
      <span> {{ getGenderLabel(row.gender) }}</span>
    </template>

    <template #actions="{ row }">
      <div class="action-buttons">
        <el-tooltip
          v-if="!canModify"
          content="Chỉ tổ trưởng/tổ phó mới có thể chỉnh sửa"
          placement="top"
          effect="light"
        >
          <el-button link size="small" type="primary" :disabled="!canModify">
            <img alt="Edit" src="@/assets/img/edit.svg" class="disabled-icon" />
          </el-button>
        </el-tooltip>
        <el-button v-else link size="small" type="primary" @click="openEditModal(row)">
          <img alt="Edit" src="@/assets/img/edit.svg" />
        </el-button>

        <div class="divider"></div>

        <el-tooltip
          v-if="!canModify"
          content="Chỉ tổ trưởng/tổ phó mới có thể xóa"
          placement="top"
          effect="light"
        >
          <el-button link size="small" type="danger" :disabled="!canModify">
            <img alt="Delete" src="@/assets/img/delete.svg" class="disabled-icon" />
          </el-button>
        </el-tooltip>
        <el-button v-else link size="small" type="danger" @click="openDeleteConfirm(row.id)">
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
    <span>Bạn có chắc chắn muốn xóa nhân khẩu này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa nhân khẩu đã chọn?</span>
  </Modal>

  <Modal
    :title="modalTitle"
    :visible="isModalVisible"
    style="width: 800px"
    :form-ref="formRef || undefined"
    @close="resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
    class="big-modal"
  >
    <el-form
      ref="formRef"
      :model="resident"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Hộ gia đình" prop="household_id">
        <el-select
          v-model="resident.household_id"
          placeholder="Chọn hộ gia đình"
          style="width: 100%"
        >
          <el-option
            v-for="household in householdOptions"
            :key="household.value"
            :label="household.label"
            :value="household.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Họ và tên" prop="full_name">
        <el-input v-model="resident.full_name" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Ngày sinh" prop="birth_date">
            <el-date-picker
              v-model="resident.birth_date"
              type="date"
              placeholder="Chọn ngày sinh"
              style="width: 100%"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Giới tính" prop="gender">
            <el-select v-model="resident.gender" placeholder="Chọn giới tính" style="width: 100%">
              <el-option :value="1" label="Nam" />
              <el-option :value="2" label="Nữ" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Nơi sinh" prop="birth_place">
        <el-input v-model="resident.birth_place" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Số điện thoại" prop="phone_number">
            <el-input v-model="resident.phone_number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Dân tộc" prop="ethnicity">
            <el-input v-model="resident.ethnicity" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="CMND/CCCD" prop="identity_number">
            <el-input v-model="resident.identity_number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ngày cấp" prop="issue_date">
            <el-date-picker
              v-model="resident.issue_date"
              type="date"
              placeholder="Chọn ngày cấp"
              style="width: 100%"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Nơi cấp" prop="issue_place">
        <el-input v-model="resident.issue_place" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Nghề nghiệp" prop="occupation">
            <el-input v-model="resident.occupation" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nơi làm việc" prop="workplace">
            <el-input v-model="resident.workplace" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Trạng thái" prop="status">
        <el-select v-model="resident.status" placeholder="Chọn trạng thái" style="width: 100%">
          <el-option :value="1" label="Thường trú" />
          <el-option :value="2" label="Tạm trú" />
          <el-option :value="3" label="Đã chuyển đi" />
        </el-select>
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="residentStore.pagination"
    @changePage="(page: number) => residentStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useResidentStore } from '@/stores/residentStore'
import { useAuthStore } from '@/stores/authStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { Resident } from '@/types/resident'
import { useHouseholdStore } from '@/stores/householdStore'

const residentStore = useResidentStore()
const householdStore = useHouseholdStore()
const authStore = useAuthStore()
const fetchLoading = ref<boolean>(false)

const isAccountant = computed(() => authStore.userInfo?.role === 2)
const isLeader = computed(() => authStore.userInfo?.role === 1)
const canModify = computed(() => isLeader.value)

const handleSearch = async () => {
  residentStore.pagination.current_page = 1
  await residentStore.fetchResidents()
  console.log('Filtering with household ID:', residentStore.householdId)
}

const resident = reactive({
  id: null,
  household_id: null as number | null,
  full_name: '',
  phone_number: '',
  birth_date: '',
  birth_place: '',
  ethnicity: '',
  occupation: '',
  workplace: '',
  identity_number: '',
  issue_date: '',
  issue_place: '',
  status: 1,
  gender: 1,
})

const getStatusTagType = (status: string): { type: string; effect: string } => {
  const statusTagTypes: { [key: string]: { type: string; effect: string } } = {
    '1': { type: 'success', effect: 'dark' },
    '2': { type: 'primary', effect: 'dark' },
    '3': { type: 'info', effect: 'dark' },
  }
  return statusTagTypes[status] ?? { type: 'info', effect: 'dark' }
}

const getStatusLabel = (status: string) => {
  if (status == '1') {
    return 'Thường trú'
  } else if (status == '2') {
    return 'Tạm trú'
  } else if (status == '3') {
    return 'Đã chuyển đi'
  }
  return status
}

const getGenderLabel = (gender: number) => {
  if (gender === 1) {
    return 'Nam'
  } else if (gender === 2) {
    return 'Nữ'
  }
  return 'Khác'
}

const tableRowClassName = ({ row }: { row: any }) => {
  return row.status === 3 ? 'inactive-row' : ''
}

const householdOptions = ref<{ value: number; label: string }[]>([])

// Delete resident
const deleteConfirmVisible = ref<boolean>(false)
const deleteresidentId = ref()

const openDeleteConfirm = (id: number) => {
  deleteresidentId.value = id
  deleteConfirmVisible.value = true
  console.log(deleteresidentId.value)
}

const handleDelete = () => {
  if (deleteresidentId.value) {
    residentStore.deleteResident(deleteresidentId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected residents
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
  const selectedIds = selectedRows.value.map((resident: any) => resident.id)
  await residentStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit resident
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  residentStore.selectedResident = null
  Object.assign(resident, {
    id: null,
    household_id: null,
    full_name: '',
    phone_number: '',
    birth_date: '',
    birth_place: '',
    ethnicity: '',
    occupation: '',
    workplace: '',
    identity_number: '',
    issue_date: '',
    issue_place: '',
    status: 1,
    gender: 1,
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm nhân khẩu'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedResident: Resident) => {
  modalTitle.value = 'Chỉnh sửa nhân khẩu'
  isModalVisible.value = true

  residentStore.selectedResident = selectedResident

  Object.assign(resident, {
    id: selectedResident.id,
    household_id: selectedResident.household_id,
    full_name: selectedResident.full_name,
    phone_number: selectedResident.phone_number,
    birth_date: selectedResident.birth_date,
    birth_place: selectedResident.birth_place,
    ethnicity: selectedResident.ethnicity,
    occupation: selectedResident.occupation,
    workplace: selectedResident.workplace,
    identity_number: selectedResident.identity_number,
    issue_date: selectedResident.issue_date,
    issue_place: selectedResident.issue_place,
    status: selectedResident.status,
    gender: selectedResident.gender,
  })
}

const handleSubmit = async () => {
  console.log(residentStore.selectedResident)

  try {
    if (residentStore.selectedResident) {
      // @ts-ignore
      await residentStore.updateResident(resident.id, resident)
    } else {
      // @ts-ignore
      await residentStore.createResident(resident)
    }
    isModalVisible.value = false
  } finally {
    resetForm()
  }
}

const columns = ref<IColumn[]>([
  {
    prop: 'full_name',
    label: 'Họ và tên',
    width: 200,
    type: 'string',
    fixed: 'left',
    lineClamp: 2,
  },
  {
    prop: 'household_apartment_code',
    label: 'Mã căn hộ',
    width: 120,
    type: 'string',
  },
  {
    prop: 'phone_number',
    label: 'Số điện thoại',
    width: 150,
    type: 'string',
  },
  {
    prop: 'gender',
    label: 'Giới tính',
    width: 100,
    type: 'string',
  },
  {
    prop: 'birth_date',
    label: 'Ngày sinh',
    width: 150,
    type: 'string',
  },
  {
    prop: 'birth_place',
    label: 'Nơi sinh',
    width: 150,
    type: 'string',
  },
  {
    prop: 'ethnicity',
    label: 'Dân tộc',
    width: 120,
    type: 'string',
  },
  {
    prop: 'occupation',
    label: 'Nghề nghiệp',
    width: 170,
    type: 'string',
  },
  {
    prop: 'workplace',
    label: 'Nơi làm việc',
    width: 200,
    type: 'string',
  },
  {
    prop: 'identity_number',
    label: 'Số CMND/CCCD',
    width: 150,
    type: 'string',
  },
  {
    prop: 'issue_date',
    label: 'Ngày cấp',
    width: 120,
    type: 'string',
  },
  {
    prop: 'issue_place',
    label: 'Nơi cấp',
    width: 150,
    type: 'string',
  },
  {
    prop: 'status',
    label: 'Trạng thái',
    width: 120,
    type: 'string',
    // formatter: (row) => {
    //   return row.status === 1 ? 'Đang sống' : 'Đã mất'
    // },
    align: 'center',
    fixed: 'right',
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

const loadHouseholdOptions = async () => {
  try {
    await householdStore.fetchHouseholds()
    householdOptions.value = householdStore.households.map((household: any) => ({
      value: household.id,
      label: `${household.apartment_code} - ${household.owner_name}`,
    }))
  } catch (error) {
    residentStore.notifyError('Không thể tải danh sách hộ gia đình')
  }
}

onMounted(async () => {
  await loadHouseholdOptions()
  residentStore.fetchResidents()
})
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  overflow-y: hidden !important;
}

.admin-page__filters {
  display: flex;
  align-items: center;
  gap: 5px;
}

.admin-page__filter-select {
  height: 36.5px;
  width: 180px;
  :deep(.el-select__wrapper) {
    height: 36.5px;
    width: 180px;
  }
}

.admin-page__filter-select-household {
  height: 36.5px;
  width: 250px;
  :deep(.el-select__wrapper) {
    height: 36.5px;
    width: 250px;
  }
}

.admin-page__search-input {
  width: 350px;
}

:deep(.inactive-row) {
  background-color: #f5f5f5;
  color: #c7c7c7;
}
</style>
