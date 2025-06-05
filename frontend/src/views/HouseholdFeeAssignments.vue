<template>
  <h1 class="admin-page__title">Quản lý Thu phí hộ gia đình</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 70%">
      <el-input
        v-model="householdFeeAssignmentStore.search"
        placeholder="Tìm kiếm theo họ tên, địa chỉ hoặc tên loại phí"
        class="admin-page__search-input"
        clearable
        @input="handleSearch"
      />

      <div class="filters-container">
        <el-select
          v-model="householdFeeAssignmentStore.paymentStatus"
          placeholder="Trạng thái thanh toán"
          clearable
          @change="handleSearch"
        >
          <el-option :value="1" label="Chưa thanh toán" />
          <el-option :value="2" label="Đã thanh toán" />
          <el-option :value="3" label="Thanh toán một phần" />
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
      <Button class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm đơn thu phí</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="householdFeeAssignmentStore.householdFeeAssignments"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #apartment_code="{ row }">
      <span>{{ row.household?.apartment_code || 'N/A' }}</span>
    </template>

    <template #address="{ row }">
      <span>{{ row.household?.address || 'N/A' }}</span>
    </template>

    <template #fee_type="{ row }">
      <span>{{ row.fee_campaign?.fee_type?.fee_name || 'N/A' }}</span>
    </template>

    <template #payment_status="{ row }">
      <el-tag :type="getStatusType(row.payment_status)">
        {{ getStatusText(row.payment_status) }}
      </el-tag>
    </template>

    <template #paid_by_resident="{ row }">
      <span>{{ row.paid_by_resident?.full_name || 'N/A' }}</span>
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
    <span>Bạn có chắc chắn muốn xóa thu phí hộ gia đình này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa thu phí hộ gia đình đã chọn?</span>
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
      :model="householdFeeAssignment"
      :rules="formRules"
      label-width="140px"
      require-asterisk-position="right"
    >
      <el-form-item label="Chiến dịch phí" prop="fee_campaign_id">
        <el-select
          v-model="householdFeeAssignment.fee_campaign_id"
          placeholder="Chọn chiến dịch phí"
          style="width: 100%"
        >
          <el-option
            v-for="campaign in feeCampaigns"
            :key="campaign.id"
            :label="`${campaign.fee_type?.fee_name} (${formatDate(campaign.start_date)} - ${formatDate(campaign.end_date)})`"
            :value="campaign.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Hộ gia đình" prop="household_id">
        <el-select
          v-model="householdFeeAssignment.household_id"
          placeholder="Chọn hộ gia đình"
          style="width: 100%"
        >
          <el-option
            v-for="household in households"
            :key="household.id"
            :label="`${household.household_number} - ${household.address}`"
            :value="household.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Số tiền phải nộp" prop="amount_due">
        <el-input-number
          v-model="householdFeeAssignment.amount_due"
          :min="0"
          :precision="2"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Số tiền đã nộp" prop="amount_paid">
        <el-input-number
          v-model="householdFeeAssignment.amount_paid"
          :min="0"
          :precision="2"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Ngày thanh toán" prop="payment_date">
        <el-date-picker
          v-model="householdFeeAssignment.payment_date"
          type="date"
          placeholder="Chọn ngày thanh toán"
          style="width: 100%"
          format="YYYY/MM/DD"
        />
      </el-form-item>

      <el-form-item label="Người thanh toán" prop="paid_by">
        <el-select
          v-model="householdFeeAssignment.paid_by"
          placeholder="Chọn người thanh toán"
          style="width: 100%"
        >
          <el-option
            v-for="resident in residents"
            :key="resident.id"
            :label="`${resident.full_name} - ${resident.identity_number}`"
            :value="resident.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Trạng thái" prop="payment_status">
        <el-select
          v-model="householdFeeAssignment.payment_status"
          placeholder="Chọn trạng thái"
          style="width: 100%"
        >
          <el-option :value="1" label="Chưa thanh toán" />
          <el-option :value="2" label="Đã thanh toán" />
          <el-option :value="3" label="Thanh toán một phần" />
        </el-select>
      </el-form-item>
    </el-form>
  </Modal>

  <Pagination
    :pagination="householdFeeAssignmentStore.pagination"
    @changePage="(page: number) => householdFeeAssignmentStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { useHouseholdFeeAssignmentStore } from '@/stores/householdFeeAssignmentStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { HouseholdFeeAssignment } from '@/types/householdFeeAssignment'
import axiosInstance from '@/utils/axiosInstance'

const householdFeeAssignmentStore = useHouseholdFeeAssignmentStore()
const fetchLoading = ref<boolean>(false)

const households = ref<any[]>([])
const feeCampaigns = ref<any[]>([])
const residents = ref<any[]>([])

// Fetch related data
const fetchHouseholds = async () => {
  try {
    const response = await axiosInstance.get('/households', {
      params: { per_page: 99 },
    })
    households.value = response.data.data
  } catch (error) {
    console.error('Error fetching households:', error)
  }
}

const fetchFeeCampaigns = async () => {
  try {
    const response = await axiosInstance.get('/fee-campaigns', {
      params: { per_page: 99 },
    })
    feeCampaigns.value = response.data.data
  } catch (error) {
    console.error('Error fetching fee campaigns:', error)
  }
}

const fetchResidents = async () => {
  try {
    const response = await axiosInstance.get('/residents', {
      params: { per_page: 99 },
    })
    residents.value = response.data.data
  } catch (error) {
    console.error('Error fetching residents:', error)
  }
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Payment status helpers
const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return 'Chưa thanh toán'
    case 2:
      return 'Đã thanh toán'
    case 3:
      return 'Thanh toán một phần'
    default:
      return 'Không xác định'
  }
}

const getStatusType = (status: number) => {
  switch (status) {
    case 1:
      return 'danger'
    case 2:
      return 'success'
    case 3:
      return 'warning'
    default:
      return 'info'
  }
}

const handleSearch = async () => {
  householdFeeAssignmentStore.pagination.current_page = 1
  await householdFeeAssignmentStore.fetchHouseholdFeeAssignments()
}

// const assignmentForm = reactive<HouseholdFeeAssignment>({
//   id: null,
//   fee_campaign_id: 0,
//   household_id: 0,
//   amount_due: 0,
//   amount_paid: 0,
//   payment_date: null,
//   paid_by: null,
//   payment_status: 1,
// })

const householdFeeAssignment = reactive({
  id: null,
  fee_campaign_id: 0,
  household_id: 0,
  amount_due: 0,
  amount_paid: 0,
  payment_date: null,
  paid_by: null,
  payment_status: null,
})

// Delete assignment
const deleteConfirmVisible = ref<boolean>(false)
const deleteAssignmentId = ref<number>()

const openDeleteConfirm = (id: number) => {
  deleteAssignmentId.value = id
  deleteConfirmVisible.value = true
}

const handleDelete = () => {
  if (deleteAssignmentId.value) {
    householdFeeAssignmentStore.deleteHouseholdFeeAssignment(deleteAssignmentId.value)
    deleteConfirmVisible.value = false
  }
}

// Delete selected assignments
const selectedRows = ref<any[]>([])
const deleteSelectedConfirmVisible = ref<boolean>(false)

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((assignment: any) => assignment.id)
  await householdFeeAssignmentStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Add or Edit assignment
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const resetForm = () => {
  formRef.value?.resetFields()
  householdFeeAssignmentStore.selectedAssignment = null
  Object.assign(householdFeeAssignment, {
    id: null,
    fee_campaign_id: '',
    household_id: '',
    amount_due: '',
    amount_paid: '',
    payment_date: null,
    paid_by: null,
    payment_status: '',
  })
}

const openCreateModal = () => {
  modalTitle.value = 'Thêm thu phí hộ gia đình'
  isModalVisible.value = true
  resetForm()
}

const openEditModal = (selectedAssignment: HouseholdFeeAssignment) => {
  modalTitle.value = 'Chỉnh sửa thu phí hộ gia đình'
  isModalVisible.value = true

  householdFeeAssignmentStore.selectedAssignment = selectedAssignment

  Object.assign(householdFeeAssignment, {
    id: selectedAssignment.id,
    fee_campaign_id: selectedAssignment.fee_campaign_id,
    household_id: selectedAssignment.household_id,
    amount_due: selectedAssignment.amount_due,
    amount_paid: selectedAssignment.amount_paid,
    payment_date: selectedAssignment.payment_date,
    paid_by: selectedAssignment.paid_by,
    payment_status: selectedAssignment.payment_status,
  })
}

const handleSubmit = async () => {
  try {
    // Create a copy to format the data properly
    const formattedData = { ...householdFeeAssignment }

    // Format payment_date to YYYY-MM-DD if it exists
    if (formattedData.payment_date) {
      const date = new Date(formattedData.payment_date)
      // @ts-ignore
      formattedData.payment_date = date.toISOString().split('T')[0]
    }

    if (householdFeeAssignmentStore.selectedAssignment) {
      // @ts-ignore
      await householdFeeAssignmentStore.updateHouseholdFeeAssignment(
        // @ts-ignore
        formattedData.id,
        formattedData,
      )
    } else {
      // @ts-ignore
      await householdFeeAssignmentStore.createHouseholdFeeAssignment(formattedData)
    }
    isModalVisible.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const columns = ref<IColumn[]>([
  {
    prop: 'apartment_code',
    label: 'Số hộ',
    width: 100,
    type: 'string',
    align: 'center',
  },
  {
    prop: 'address',
    label: 'Địa chỉ',
    width: 200,
    type: 'string',
    lineClamp: 2,
  },
  {
    prop: 'fee_type',
    label: 'Loại phí',
    width: 150,
    type: 'string',
  },
  {
    prop: 'payment_date',
    label: 'Ngày thanh toán',
    width: 150,
    type: 'string',
    align: 'center',
  },
  {
    prop: 'paid_by_resident',
    label: 'Người thanh toán',
    width: 200,
    type: 'function',
  },
  {
    prop: 'amount_due',
    label: 'Số tiền phải nộp',
    width: 150,
    type: 'string',
    align: 'right',
  },
  {
    prop: 'amount_paid',
    label: 'Số tiền đã nộp',
    width: 150,
    type: 'string',
    align: 'right',
  },
  {
    prop: 'payment_status',
    label: 'Trạng thái',
    width: 150,
    type: 'function',
    align: 'center',
  },
  {
    prop: 'actions',
    label: 'Thao tác',
    width: 120,
    type: 'function',
    align: 'center',
    fixed: 'right',
  },
])

const formRules = {
  fee_campaign_id: [{ required: true, message: 'Vui lòng chọn chiến dịch phí', trigger: 'change' }],
  household_id: [{ required: true, message: 'Vui lòng chọn hộ gia đình', trigger: 'change' }],
  amount_due: [
    { required: true, message: 'Vui lòng nhập số tiền phải nộp', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Số tiền phải lớn hơn 0', trigger: 'blur' },
  ],
  payment_status: [
    { required: true, message: 'Vui lòng chọn trạng thái thanh toán', trigger: 'change' },
  ],
}

onMounted(async () => {
  fetchLoading.value = true
  await Promise.all([
    householdFeeAssignmentStore.fetchHouseholdFeeAssignments(),
    fetchHouseholds(),
    fetchFeeCampaigns(),
    fetchResidents(),
  ])
  fetchLoading.value = false
})
</script>

<style scoped lang="scss">
.admin-page__search-input {
  width: 300px;
}

:deep(.el-select__wrapper) {
  width: 200px;
}
</style>
