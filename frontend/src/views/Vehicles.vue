<template>
  <h1 class="admin-page__title">Quản lý Phương tiện</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container">
      <el-input
        v-model="vehicleStore.search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo biển số xe"
        @change="handleSearch"
      />

      <div class="admin-page__filters">
        <el-select
          v-model="vehicleStore.householdId"
          clearable
          placeholder="Lọc theo hộ gia đình"
          @change="handleSearch"
        >
          <el-option
            v-for="household in householdOptions"
            :key="household.value"
            :label="household.label"
            :value="household.value"
          />
        </el-select>

        <el-select
          v-model="vehicleStore.type"
          clearable
          placeholder="Lọc theo loại xe"
          @change="handleSearch"
        >
          <el-option :value="1" label="Xe máy" />
          <el-option :value="2" label="Ô tô" />
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
          <span>Thêm phương tiện</span>
        </Button>
      </el-tooltip>
      <Button v-else class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm phương tiện</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="vehicleStore.vehicles"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #type="{ row }">
      <el-tag v-if="row.type === 1" type="success" effect="dark">Xe máy</el-tag>
      <el-tag v-else-if="row.type === 2" type="primary" effect="dark">Ô tô</el-tag>
      <span v-else>-</span>
    </template>

    <template #household="{ row }">
      <div v-if="row.household">
        {{ row.household.apartment_code }} - {{ row.household.owner_name }}
      </div>
      <div v-else>Không có dữ liệu</div>
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
    <span>Bạn có chắc chắn muốn xóa phương tiện này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa phương tiện đã chọn?</span>
  </Modal>

  <Modal
    :title="modalTitle"
    :visible="isModalVisible"
    style="width: 600px"
    :form-ref="formRef || undefined"
    @close="resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
  >
    <el-form
      ref="formRef"
      :model="vehicle"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Hộ gia đình" prop="household_id">
        <el-select v-model="vehicle.household_id" placeholder="Chọn hộ gia đình">
          <el-option
            v-for="household in householdOptions"
            :key="household.value"
            :label="household.label"
            :value="household.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Loại phương tiện" prop="type">
        <el-select v-model="vehicle.type" placeholder="Chọn loại phương tiện">
          <el-option :value="1" label="Xe máy" />
          <el-option :value="2" label="Ô tô" />
        </el-select>
      </el-form-item>

      <el-form-item label="Biển số xe" prop="plate_number">
        <el-input v-model="vehicle.plate_number" placeholder="Nhập biển số xe"></el-input>
      </el-form-item>

      <el-form-item label="Ngày đăng ký" prop="registered_date">
        <el-date-picker
          v-model="vehicle.registered_date"
          placeholder="Chọn ngày đăng ký"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="vehicleStore.pagination"
    @changePage="(page: number) => vehicleStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useVehicleStore } from '@/stores/vehicleStore'
import { useHouseholdStore } from '@/stores/householdStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { Vehicle } from '@/types/vehicle'
import { notifyError } from '@/composables/notifications'

const vehicleStore = useVehicleStore()
const authStore = useAuthStore()
const householdStore = useHouseholdStore()
const fetchLoading = ref<boolean>(false)

const isAccountant = computed(() => authStore.userInfo?.role === 2)
const isLeader = computed(() => authStore.userInfo?.role === 1)
const canModify = computed(() => isLeader.value)

const handleSearch = async () => {
  vehicleStore.pagination.current_page = 1
  await vehicleStore.fetchVehicles()
}

const vehicle = reactive({
  id: '',
  household_id: '',
  type: 1,
  plate_number: '',
  registered_date: '',
})

const householdOptions = ref<{ value: number; label: string }[]>([])

// Delete vehicle
const deleteConfirmVisible = ref<boolean>(false)
const deleteVehicleId = ref()

const openDeleteConfirm = (id: number) => {
  deleteVehicleId.value = id
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  if (deleteVehicleId.value) {
    vehicleStore.deleteVehicle(deleteVehicleId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected vehicles
const selectedRows = ref([])
const deleteSelectedConfirmVisible = ref(false)

const handleSelectionChange = (selection: any) => {
  selectedRows.value = selection
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((vehicle: any) => vehicle.id)
  await vehicleStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit vehicle
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  vehicleStore.selectedVehicle = null
  Object.assign(vehicle, {
    id: '',
    household_id: '',
    type: 1,
    plate_number: '',
    registered_date: '',
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm phương tiện'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedVehicle: Vehicle) => {
  modalTitle.value = 'Chỉnh sửa phương tiện'
  isModalVisible.value = true

  vehicleStore.selectedVehicle = selectedVehicle

  Object.assign(vehicle, {
    id: selectedVehicle.id,
    household_id: selectedVehicle.household_id,
    type: selectedVehicle.type,
    plate_number: selectedVehicle.plate_number,
    registered_date: selectedVehicle.registered_date || '',
  })
}

const handleSubmit = async () => {
  console.log(vehicleStore.selectedVehicle)

  try {
    if (vehicleStore.selectedVehicle) {
      // @ts-ignore
      await vehicleStore.updateVehicle(vehicle.id, vehicle)
    } else {
      // @ts-ignore
      await vehicleStore.createVehicle(vehicle)
    }
    isModalVisible.value = false
  } finally {
    resetForm()
  }
}

const columns = ref<IColumn[]>([
  {
    prop: 'household',
    label: 'Hộ gia đình',
    width: 150,
    type: 'string',
  },
  {
    prop: 'plate_number',
    label: 'Biển số xe',
    type: 'string',
    width: 150,
  },
  {
    prop: 'type',
    label: 'Loại phương tiện',
    width: 150,
    type: 'string',
  },
  {
    prop: 'registered_date',
    label: 'Ngày đăng ký',
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
  household_id: [{ required: true, message: 'Vui lòng chọn hộ gia đình', trigger: 'change' }],
  type: [{ required: true, message: 'Vui lòng chọn loại phương tiện', trigger: 'change' }],
  plate_number: [
    { required: true, message: 'Vui lòng nhập biển số xe', trigger: 'blur' },
    { min: 3, max: 20, message: 'Biển số xe phải từ 3 đến 20 ký tự', trigger: 'blur' },
  ],
  registered_date: [{ required: false, message: 'Vui lòng chọn ngày đăng ký', trigger: 'change' }],
}

const loadHouseholdOptions = async () => {
  try {
    await householdStore.fetchHouseholds()
    householdOptions.value = householdStore.households.map((household: any) => ({
      value: household.id,
      label: `${household.apartment_code} - ${household.owner_name}`,
    }))
  } catch (error) {
    notifyError('Không thể tải danh sách hộ gia đình')
  }
}

onMounted(async () => {
  await loadHouseholdOptions()
  vehicleStore.fetchVehicles()
})
</script>

<style scoped lang="scss">
.admin-page__search-container {
  display: flex;
  align-items: center;
  width: 70%;
}

.admin-page__search-input {
  width: 300px;
}

.admin-page__filters {
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #e0e0e0;
  margin: 0 8px;
}

.admin-page__filters {
  :deep(.el-select__wrapper) {
    height: 36.3px;
    width: 250px;
  }
}
</style>
