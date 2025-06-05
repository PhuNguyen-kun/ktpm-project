<template>
  <h1 class="admin-page__title">Quản lý Đợt thu</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 70%">
      <el-input
        v-model="feeCampaignStore.search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo ghi chú hoặc tên loại phí"
        @change="handleSearch"
      />

      <el-select
        v-model="feeCampaignStore.feeTypeId"
        placeholder="Lọc theo loại phí"
        clearable
        style="margin-left: 10px; width: 200px"
        @change="handleSearch"
      >
        <el-option
          v-for="feeType in feeTypeOptions"
          :key="feeType.value"
          :label="feeType.label"
          :value="feeType.value"
        />
      </el-select>

      <div class="date-filters">
        <el-date-picker
          v-model="feeCampaignStore.startDate"
          type="date"
          placeholder="Từ ngày"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
        <el-date-picker
          v-model="feeCampaignStore.endDate"
          type="date"
          placeholder="Đến ngày"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
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
      <Button class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm đợt thu</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="feeCampaignStore.feeCampaigns"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #fee_type="{ row }">
      <span>{{ row.fee_type?.fee_name || 'Không xác định' }}</span>
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
    <span>Bạn có chắc chắn muốn xóa đợt thu này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa các đợt thu đã chọn?</span>
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
      :model="feeCampaign"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Loại phí" prop="fee_type_id">
        <el-select
          v-model="feeCampaign.fee_type_id"
          placeholder="Chọn loại phí"
          style="width: 100%"
        >
          <el-option
            v-for="feeType in feeTypeOptions"
            :key="feeType.value"
            :label="feeType.label"
            :value="feeType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ngày bắt đầu" prop="start_date">
        <el-date-picker
          v-model="feeCampaign.start_date"
          type="date"
          placeholder="Chọn ngày bắt đầu"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Ngày kết thúc" prop="end_date">
        <el-date-picker
          v-model="feeCampaign.end_date"
          type="date"
          placeholder="Chọn ngày kết thúc"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input v-model="feeCampaign.note" placeholder="Nhập ghi chú" rows="5" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="feeCampaignStore.pagination"
    @changePage="(page: number) => feeCampaignStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, reactive } from 'vue'
import { useFeeCampaignStore } from '@/stores/feeCampaignStore'
import { useFeeTypeStore } from '@/stores/feeTypeStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { FeeCampaign } from '@/types/fee_campaign'

const feeCampaignStore = useFeeCampaignStore()
const feeTypeStore = useFeeTypeStore()
const fetchLoading = ref<boolean>(false)
const feeTypeOptions = ref<{ value: number; label: string }[]>([])

const handleSearch = async () => {
  feeCampaignStore.pagination.current_page = 1
  await feeCampaignStore.fetchFeeCampaigns()
}

const feeCampaign = reactive<FeeCampaign>({
  id: null,
  fee_type_id: 0,
  start_date: '',
  end_date: '',
  note: '',
})

// Delete fee campaign
const deleteConfirmVisible = ref<boolean>(false)
const deleteFeeCampaignId = ref<number>()

const openDeleteConfirm = (id: number) => {
  deleteFeeCampaignId.value = id
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  if (deleteFeeCampaignId.value) {
    feeCampaignStore.deleteFeeCampaign(deleteFeeCampaignId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected fee campaigns
const selectedRows = ref<any[]>([])
const deleteSelectedConfirmVisible = ref(false)

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((feeCampaign: any) => feeCampaign.id)
  await feeCampaignStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit fee campaign
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  feeCampaignStore.selectedFeeCampaign = null
  Object.assign(feeCampaign, {
    id: null,
    fee_type_id: 0,
    start_date: '',
    end_date: '',
    note: '',
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm đợt thu'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedFeeCampaign: FeeCampaign) => {
  modalTitle.value = 'Chỉnh sửa đợt thu'
  isModalVisible.value = true

  feeCampaignStore.selectedFeeCampaign = selectedFeeCampaign

  Object.assign(feeCampaign, {
    id: selectedFeeCampaign.id,
    fee_type_id: selectedFeeCampaign.fee_type_id,
    start_date: selectedFeeCampaign.start_date,
    end_date: selectedFeeCampaign.end_date,
    note: selectedFeeCampaign.note || '',
  })
}

const handleSubmit = async () => {
  try {
    if (feeCampaignStore.selectedFeeCampaign) {
      if (feeCampaign.id) {
        await feeCampaignStore.updateFeeCampaign(feeCampaign.id, feeCampaign)
      }
    } else {
      await feeCampaignStore.createFeeCampaign(feeCampaign)
    }
    isModalVisible.value = false
  } finally {
    resetForm()
  }
}

const columns = ref<IColumn[]>([
  {
    prop: 'fee_type',
    label: 'Loại phí',
    width: 200,
    type: 'string',
    fixed: 'left',
    lineClamp: 2,
  },
  {
    prop: 'start_date',
    label: 'Ngày bắt đầu',
    width: 150,
    type: 'string',
  },
  {
    prop: 'end_date',
    label: 'Ngày kết thúc',
    width: 150,
    type: 'string',
  },
  {
    prop: 'note',
    label: 'Ghi chú',
    width: 300,
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
  fee_type_id: [{ required: true, message: 'Vui lòng chọn loại phí', trigger: 'change' }],
  start_date: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'change' }],
  end_date: [
    { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (feeCampaign.start_date && value && value < feeCampaign.start_date) {
          callback(new Error('Ngày kết thúc phải sau ngày bắt đầu'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  note: [{ max: 1000, message: 'Ghi chú không được vượt quá 1000 ký tự', trigger: 'blur' }],
}

const loadFeeTypeOptions = async () => {
  try {
    await feeTypeStore.fetchFeeTypes()
    feeTypeOptions.value = feeTypeStore.feeTypes.map((feeType: any) => ({
      value: feeType.id,
      label: feeType.fee_name,
    }))
  } catch (error) {
    console.error('Error loading fee type options:', error)
  }
}

onMounted(async () => {
  await loadFeeTypeOptions()
  feeCampaignStore.fetchFeeCampaigns()
})
</script>

<style scoped lang="scss">
.admin-page__search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-page__search-input {
  width: 340px;
}

.date-filters {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}

.divider {
  height: 20px;
  width: 1px;
  background-color: #dcdfe6;
  margin: 0 5px;
}
</style>
