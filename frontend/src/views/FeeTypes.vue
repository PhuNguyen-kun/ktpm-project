<template>
  <h1 class="admin-page__title">Quản lý Loại phí</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container">
      <el-input
        v-model="feeTypeStore.search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên hoặc mô tả"
        @change="handleSearch"
      />

      <el-select
        v-model="feeTypeStore.isMandatoryFilter"
        placeholder="Bắt buộc/Không bắt buộc"
        clearable
        style="margin-left: 10px; width: 200px"
        @change="handleSearch"
      >
        <el-option :value="true" label="Bắt buộc" />
        <el-option :value="false" label="Không bắt buộc" />
      </el-select>
      <el-button class="btn btn--primary" @click="handleSearch">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
    </div>
    <div class="admin-page__heading--right">
      <Button v-if="selectedRows.length" class="btn btn--danger" @click="openDeleteSelectedConfirm">
        <el-icon class="btn--nicer">
          <Delete />
        </el-icon>
        <span>Xóa các mục đã chọn</span>
      </Button>
      <Button class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm loại phí</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="feeTypeStore.feeTypes"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #is_mandatory="{ row }">
      <el-tag v-if="row.is_mandatory === true" type="success" effect="dark" round>Bắt buộc</el-tag>
      <el-tag v-else-if="row.is_mandatory === false" type="warning" effect="dark" round
        >Không bắt buộc</el-tag
      >
    </template>

    <template #unit="{ row }">
      <span v-if="row.unit === 1">Theo m²</span>
      <span v-else-if="row.unit === 2">Theo người</span>
      <span v-else-if="row.unit === 3">Theo phương tiện</span>
    </template>

    <template #calculation_method="{ row }">
      <span v-if="row.calculation_method === 1">Cố định</span>
      <span v-else-if="row.calculation_method === 2">Theo m²</span>
      <span v-else-if="row.calculation_method === 3">Theo đầu người</span>
    </template>

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
    <span>Bạn có chắc chắn muốn xóa loại phí này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa loại phí đã chọn?</span>
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
      :model="feeType"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên loại phí" prop="fee_name">
        <el-input v-model="feeType.fee_name" placeholder="Nhập tên loại phí"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          v-model="feeType.description"
          placeholder="Nhập mô tả"
          rows="5"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="Loại phí bắt buộc" prop="is_mandatory">
        <el-switch v-model="feeType.is_mandatory" />
      </el-form-item>
      <el-form-item label="Đơn vị tính" prop="unit">
        <el-select v-model="feeType.unit" placeholder="Chọn đơn vị tính">
          <el-option :value="1" label="Theo m²" />
          <el-option :value="2" label="Theo người" />
          <el-option :value="3" label="Theo phương tiện" />
        </el-select>
      </el-form-item>
      <el-form-item label="Phương thức tính" prop="calculation_method">
        <el-select v-model="feeType.calculation_method" placeholder="Chọn phương thức tính">
          <el-option :value="1" label="Cố định" />
          <el-option :value="2" label="Theo m²" />
          <el-option :value="3" label="Theo đầu người" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mức phí mặc định" prop="default_amount">
        <el-input-number
          v-model="feeType.default_amount"
          :min="0"
          :precision="2"
          :step="1000"
          style="width: 100%"
          placeholder="Nhập mức phí mặc định"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="feeTypeStore.pagination"
    @changePage="(page: number) => feeTypeStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, reactive } from 'vue'
import { useFeeTypeStore } from '@/stores/feeTypeStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { FeeType } from '@/types/fee_type'
import ts from 'typescript'

const feeTypeStore = useFeeTypeStore()
const fetchLoading = ref<boolean>(false)

const handleSearch = async () => {
  feeTypeStore.pagination.current_page = 1
  await feeTypeStore.fetchFeeTypes()
}

const feeType = reactive({
  id: null as number | null,
  fee_name: '',
  description: '',
  is_mandatory: false,
  unit: 1,
  calculation_method: 1,
  default_amount: 0,
})

// Delete fee type
const deleteConfirmVisible = ref<boolean>(false)
const deleteFeeTypeId = ref<number>()

const openDeleteConfirm = (id: number) => {
  deleteFeeTypeId.value = id
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  if (deleteFeeTypeId.value) {
    feeTypeStore.deleteFeeType(deleteFeeTypeId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected fee types
const selectedRows = ref([])
const deleteSelectedConfirmVisible = ref(false)

const handleSelectionChange = (selection: any[]) => {
  // @ts-ignore
  selectedRows.value = selection
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((feeType: any) => feeType.id)
  await feeTypeStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit fee type
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  feeTypeStore.selectedFeeType = null
  Object.assign(feeType, {
    id: null,
    fee_name: '',
    description: '',
    is_mandatory: false,
    unit: 1,
    calculation_method: 1,
    default_amount: 0,
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm loại phí'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedFeeType: FeeType) => {
  modalTitle.value = 'Chỉnh sửa loại phí'
  isModalVisible.value = true

  feeTypeStore.selectedFeeType = selectedFeeType

  Object.assign(feeType, {
    id: selectedFeeType.id,
    fee_name: selectedFeeType.fee_name,
    description: selectedFeeType.description,
    is_mandatory: selectedFeeType.is_mandatory,
    unit: selectedFeeType.unit,
    calculation_method: selectedFeeType.calculation_method,
    default_amount: selectedFeeType.default_amount,
  })
}

const handleSubmit = async () => {
  try {
    if (feeTypeStore.selectedFeeType) {
      if (feeType.id) {
        await feeTypeStore.updateFeeType(feeType.id, feeType)
      }
    } else {
      await feeTypeStore.createFeeType(feeType)
    }
    isModalVisible.value = false
  } finally {
    resetForm()
  }
}

const columns = ref<IColumn[]>([
  {
    prop: 'fee_name',
    label: 'Tên loại phí',
    width: 150,
    type: 'string',
    fixed: 'left',
    lineClamp: 2,
  },
  {
    prop: 'description',
    label: 'Mô tả',
    width: 250,
    type: 'string',
  },
  {
    prop: 'unit',
    label: 'Đơn vị tính',
    width: 120,
    type: 'string',
  },
  {
    prop: 'calculation_method',
    label: 'Phương thức tính',
    width: 130,
    type: 'string',
    align: 'center',
  },
  {
    prop: 'default_amount',
    label: 'Mức phí mặc định',
    width: 150,
    type: 'number',
    align: 'center',
  },
  {
    prop: 'is_mandatory',
    label: 'Bắt buộc',
    width: 130,
    type: 'string',
    align: 'left',
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
  fee_name: [
    { required: true, message: 'Vui lòng nhập tên loại phí', trigger: 'blur' },
    { min: 2, max: 255, message: 'Tên loại phí phải từ 2 đến 255 ký tự', trigger: 'blur' },
  ],
  description: [{ max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự', trigger: 'blur' }],
  unit: [{ required: true, message: 'Vui lòng chọn đơn vị tính', trigger: 'change' }],
  calculation_method: [
    { required: true, message: 'Vui lòng chọn phương thức tính', trigger: 'change' },
  ],
  default_amount: [
    { required: true, message: 'Vui lòng nhập mức phí mặc định', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Mức phí phải là số dương', trigger: 'blur' },
  ],
}

onMounted(() => {
  feeTypeStore.fetchFeeTypes()
})
</script>

<style scoped lang="scss">
:deep(.el-select__wrapper) {
  height: 36px;
  width: 220px;
}

:deep(.el-input-number) {
  width: 220px !important;
}

.admin-page__search-container {
  display: flex;
  align-items: center;
  width: 70%;
}

.admin-page__search-input {
  width: 280px;
}

.btn--primary {
  margin-left: 20px;
}
</style>
