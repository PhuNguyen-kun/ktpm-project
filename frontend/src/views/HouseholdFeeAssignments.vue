<template>
  <h1 class="admin-page__title">Quản lý Thu phí hộ gia đình</h1>

  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 70%">
      <el-input
        v-model="householdFeeAssignmentStore.search"
        placeholder="Tìm kiếm theo họ tên, địa chỉ"
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
        <el-select
          v-model="householdFeeAssignmentStore.feeCampaignId"
          placeholder="Loại phí"
          clearable
          @change="handleSearch"
          class="filters-container__select"
        >
          <el-option
            v-for="campaign in feeCampaigns"
            :key="campaign.id"
            :value="campaign.id"
            :label="`${campaign.fee_type?.fee_name} (${formatDate(campaign.start_date)} - ${formatDate(campaign.end_date)})`"
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
      <el-tooltip
        v-if="!canModify"
        content="Chỉ kế toán mới có thể tạo"
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
          <span>Tạo khoản thu</span>
        </Button>
      </el-tooltip>
      <Button v-else class="btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Tạo khoản thu</span>
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
      <!-- <el-tag :type="getStatusType(row.payment_status)">
        {{ getStatusText(row.payment_status) }}
      </el-tag> -->
      <el-tag v-if="row.payment_status == 1" type="info" effect="dark" round
        >Chưa thanh toán</el-tag
      >
      <el-tag v-else-if="row.payment_status == 2" type="success" effect="dark" round
        >Đã thanh toán</el-tag
      >
      <el-tag v-else-if="row.payment_status == 3" type="warning" effect="dark" round
        >Thanh toán một phần</el-tag
      >
    </template>

    <template #paid_by_resident="{ row }">
      <span>{{ row.paid_by_resident?.full_name || 'N/A' }}</span>
    </template>

    <template #actions="{ row }">
      <div class="action-buttons">
        <el-tooltip
          v-if="!canModify"
          content="Chỉ kế toán mới có thể chỉnh sửa"
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
          content="Chỉ kế toán mới có thể xóa"
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
    @submit="confirmDelete"
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

  <!-- Standard Form Modal for Single Creation/Editing -->
  <Modal
    v-if="!isBatchMode"
    :title="modalTitle"
    :visible="isModalVisible"
    @close="isModalVisible = false"
    @update:visible="isModalVisible = $event"
    @submit="handleSubmit"
  >
    <el-form
      ref="formRef"
      :model="householdFeeAssignment"
      label-position="top"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Đợt thu phí" prop="fee_campaign_id">
        <el-select
          v-model="householdFeeAssignment.fee_campaign_id"
          placeholder="Chọn đợt thu phí"
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
          filterable
        >
          <el-option
            v-for="household in households"
            :key="household.id"
            :label="`${household.apartment_code} - ${household.address}`"
            :value="household.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Số tiền cần thu" prop="amount_due">
        <el-input-number
          v-model.number="householdFeeAssignment.amount_due"
          type="number"
          placeholder="Nhập số tiền cần thu"
        />
      </el-form-item>

      <el-form-item label="Số tiền đã đóng" prop="amount_paid">
        <el-input-number
          v-model.number="householdFeeAssignment.amount_paid"
          type="number"
          placeholder="Nhập số tiền đã đóng"
        />
      </el-form-item>

      <el-form-item label="Ngày thanh toán" prop="payment_date">
        <el-date-picker
          v-model="householdFeeAssignment.payment_date"
          type="date"
          placeholder="Chọn ngày thanh toán"
          style="width: 100%"
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

  <!-- Batch Creation Modal -->
  <Modal
    v-else
    :title="modalTitle"
    :visible="isModalVisible"
    @close="isModalVisible = false"
    @submit="handleBatchSubmit"
    @update:visible="isModalVisible = $event"
  >
    <el-form
      ref="batchFormRef"
      :model="batchForm"
      label-position="top"
      :rules="batchRules"
      @submit.prevent="handleBatchSubmit"
    >
      <el-form-item label="Đợt thu phí" prop="fee_campaign_id">
        <el-select
          v-model="batchForm.fee_campaign_id"
          placeholder="Chọn đợt thu phí"
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
          v-model="batchForm.household_ids"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="Chọn hộ gia đình (không chọn = tất cả)"
          style="width: 100%"
          filterable
          clearable
        >
          <el-option
            v-for="household in households"
            :key="household.id"
            :label="`${household.apartment_code} - ${household.address}`"
            :value="household.id"
          />
        </el-select>
        <span class="form-hint">Không chọn hộ gia đình nào sẽ áp dụng cho tất cả các hộ</span>
      </el-form-item>

      <div class="notice-box">
        <p>Hệ thống sẽ tự động tính toán số tiền dựa vào phương thức tính phí:</p>
        <ul>
          <li><strong>Cố định:</strong> Sử dụng mức phí mặc định</li>
          <li><strong>Theo m²:</strong> Tính dựa vào diện tích mỗi hộ</li>
          <li><strong>Theo người:</strong> Tính dựa vào số người trong mỗi hộ</li>
          <li><strong>Theo phương tiện:</strong> Tính dựa vào số phương tiện của mỗi hộ</li>
        </ul>
      </div>
    </el-form>
  </Modal>

  <Pagination
    :pagination="householdFeeAssignmentStore.pagination"
    @changePage="(page: number) => householdFeeAssignmentStore.handlePageChange(page)"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table.vue'
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useHouseholdFeeAssignmentStore } from '@/stores/householdFeeAssignmentStore'
import { useAuthStore } from '@/stores/authStore'
import Pagination from '@/components/Pagination.vue'
import Modal from '@/components/Modal.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IColumn } from '@/components/Table.vue'
import type { HouseholdFeeAssignment } from '@/types/householdFeeAssignment'
import axiosInstance from '@/utils/axiosInstance'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
// Button component is already imported elsewhere or not needed
import { ElMessageBox } from 'element-plus'
import { notifySuccess, notifyError } from '@/composables/notifications'

const householdFeeAssignmentStore = useHouseholdFeeAssignmentStore()
const authStore = useAuthStore()
const fetchLoading = ref<boolean>(false)
const loading = ref<boolean>(false)

const households = ref<any[]>([])
const feeCampaigns = ref<any[]>([])
const residents = ref<any[]>([])
const isAccountant = computed(() => authStore.userInfo?.role === 2)
const isLeader = computed(() => authStore.userInfo?.role === 1)
const canModify = computed(() => isAccountant.value)

// Mode toggle for different form types
const isBatchMode = ref<boolean>(true)

// Fetch related data
const fetchHouseholds = async () => {
  try {
    const response = await axiosInstance.get('/households', {
      params: {
        page: 1,
        per_page: 1000, // Get all households
      },
    })
    households.value = response.data.data
  } catch (error) {
    console.error('Error fetching households:', error)
  }
}

const fetchFeeCampaigns = async () => {
  try {
    const response = await axiosInstance.get('/fee-campaigns', {
      params: {
        page: 1,
        per_page: 1000, // Get all campaigns
      },
    })
    feeCampaigns.value = response.data.data
  } catch (error) {
    console.error('Error fetching fee campaigns:', error)
  }
}

const fetchResidents = async () => {
  try {
    const response = await axiosInstance.get('/residents', {
      params: {
        page: 1,
        per_page: 1000, // Get all residents
      },
    })
    residents.value = response.data.data
  } catch (error) {
    console.error('Error fetching residents:', error)
  }
}

// Fetch data on component mount
onMounted(async () => {
  fetchLoading.value = true
  try {
    await Promise.all([
      fetchHouseholds(),
      fetchFeeCampaigns(),
      fetchResidents(),
      householdFeeAssignmentStore.fetchHouseholdFeeAssignments(),
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    fetchLoading.value = false
  }
})

// Individual fee assignment form
const householdFeeAssignment = reactive({
  id: null as number | null,
  fee_campaign_id: '' as string | number,
  household_id: '' as string | number,
  amount_due: '' as string | number,
  amount_paid: '' as string | number,
  payment_date: null,
  paid_by: null as number | null,
  payment_status: '' as string | number,
})

// Form for batch creation
const batchForm = reactive({
  fee_campaign_id: '' as string | number,
  household_ids: [] as number[],
})

// Form rules
const rules = reactive<FormRules>({
  fee_campaign_id: [{ required: true, message: 'Vui lòng chọn đợt thu phí', trigger: 'blur' }],
  household_id: [{ required: true, message: 'Vui lòng chọn hộ gia đình', trigger: 'blur' }],
  amount_due: [{ required: true, message: 'Vui lòng nhập số tiền cần thu', trigger: 'blur' }],
  payment_status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'blur' }],
})

// Rules for batch form
const batchRules = reactive<FormRules>({
  fee_campaign_id: [{ required: true, message: 'Vui lòng chọn chiến dịch phí', trigger: 'blur' }],
})

// Date formatter for display
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

// Table selection handling
const selectedRows = ref<any[]>([])

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// Table columns definition
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
    prop: 'amount_due',
    label: 'Số tiền cần thu',
    width: 150,
    type: 'string',
  },
  {
    prop: 'amount_paid',
    label: 'Số tiền đã đóng',
    width: 150,
    type: 'string',
  },
  {
    prop: 'payment_date',
    label: 'Ngày thanh toán',
    width: 150,
    type: 'string',
  },
  {
    prop: 'payment_status',
    label: 'Trạng thái',
    width: 120,
    type: 'string',
  },
  {
    prop: 'actions',
    label: 'Thao tác',
    width: 120,
    type: 'string',
    fixed: 'right',
    align: 'center',
  },
])

// Search handler
const handleSearch = () => {
  householdFeeAssignmentStore.pagination.current_page = 1
  householdFeeAssignmentStore.fetchHouseholdFeeAssignments()
}

watch(
  () => householdFeeAssignmentStore.householdId,
  () => {
    handleSearch()
  },
)

// Delete handling
const deleteConfirmVisible = ref<boolean>(false)
const deleteAssignmentId = ref<number | null>(null)

const openDeleteConfirm = (id: number) => {
  deleteAssignmentId.value = id
  deleteConfirmVisible.value = true
}

const confirmDelete = async () => {
  if (deleteAssignmentId.value) {
    await householdFeeAssignmentStore.deleteHouseholdFeeAssignment(deleteAssignmentId.value)
    deleteConfirmVisible.value = false
    deleteAssignmentId.value = null
  }
}

// Delete selected
const deleteSelectedConfirmVisible = ref<boolean>(false)

const openDeleteSelectedConfirm = () => {
  deleteSelectedConfirmVisible.value = true
}

const confirmDeleteSelected = async () => {
  const selectedIds = selectedRows.value.map((assignment: any) => assignment.id)
  await householdFeeAssignmentStore.deleteSelected(selectedIds)
  deleteSelectedConfirmVisible.value = false
}

// Modal handling
const modalTitle = ref<string>('')
const isModalVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const batchFormRef = ref<FormInstance | null>(null)

// Reset forms
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

const resetBatchForm = () => {
  batchFormRef.value?.resetFields()
  Object.assign(batchForm, {
    fee_campaign_id: '',
    household_ids: [],
  })
}

// Open modal for creating new assignment
const openCreateModal = () => {
  isBatchMode.value = true
  modalTitle.value = 'Tạo khoản thu'
  isModalVisible.value = true
  resetBatchForm()
}

// Open modal for editing existing assignment
const openEditModal = (selectedAssignment: HouseholdFeeAssignment) => {
  isBatchMode.value = false
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

// Handle regular form submission for individual fee assignments
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

// Handle batch creation form submission
const handleBatchSubmit = async () => {
  // Validate form
  if (!batchForm.fee_campaign_id) {
    notifyError('Vui lòng chọn chiến dịch phí')
    return
  }

  try {
    loading.value = true

    // Confirm before proceeding
    await ElMessageBox.confirm(
      'Hệ thống sẽ tự động tính toán khoản phí cho các hộ gia đình dựa vào phương thức tính của loại phí. Bạn có chắc chắn muốn tiếp tục?',
      'Xác nhận tạo khoản thu',
      {
        confirmButtonText: 'Tiếp tục',
        cancelButtonText: 'Hủy',
        type: 'info',
      },
    )

    const response = await householdFeeAssignmentStore.batchCreateHouseholdFeeAssignments(
      batchForm.fee_campaign_id as number,
      batchForm.household_ids.length ? batchForm.household_ids : undefined,
    )

    isModalVisible.value = false
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Error creating batch assignments:', error)
      notifyError('Lỗi khi tạo khoản thu')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.admin-page__search-input {
  width: 250px;
}

.filters-container {
  display: flex;
  gap: 5px;
  :deep(.el-select__wrapper) {
    width: 200px;
    height: 36.5px;
  }
}

.filters-container__select {
  :deep(.el-select__wrapper) {
    width: 370px;
    height: 36.5px;
  }
}

.notice-box {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
  color: #333;

  strong {
    color: #d9534f;
  }
}

// .filters-container {
//   display: flex;
//   gap: 10px;
//   margin: 0 10px;

//   &__select {
//     width: 300px;
//   }
// }

.action-buttons {
  display: flex;
  align-items: center;

  .divider {
    width: 1px;
    height: 20px;
    background-color: #dcdfe6;
    margin: 0 5px;
  }
}

.date-filters {
  display: flex;
  gap: 10px;
  margin: 0 10px;
}

.notice-box {
  background-color: #f0f9ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;

  p {
    margin-top: 0;
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }
}

.form-hint {
  color: #909399;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
}
</style>
