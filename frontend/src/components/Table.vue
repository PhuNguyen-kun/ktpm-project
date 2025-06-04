<template>
  <el-table
    :data="data"
    style="width: 100%; height: calc(100vh - 290px); border-radius: 15px; border: 1px solid #ccc"
    header-row-class-name="table-title"
    class="table-checkbox custom-table"
    v-loading="loading"
    empty-text="Không có bản ghi nào"
  >
    <el-table-column
      type="selection"
      width="60"
      :selectable="selectable"
      :align="'center'"
    ></el-table-column>

    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :align="column.align || 'left'"
      :fixed="column.fixed"
    >
      <template #default="scope" v-if="column.type === 'checkbox'">
        <el-checkbox v-model="scope.row[column.prop]" />
      </template>
      <template v-if="$slots[column.prop]" #default="scope">
        <slot :name="column.prop" :row="scope.row" :index="scope.$index" />
      </template>
      <template v-else #default="scope">
        <el-tooltip
          effect="customized"
          placement="top"
          :content="scope.row[column.prop]"
          raw-content
          popper-class="custom-tooltip"
        >
          <span
            :class="{ 'is-line-clamp': column.lineClamp }"
            style="white-space: pre-wrap"
            v-html="scope.row[column.prop]"
          ></span>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type ColumnType = 'number' | 'string' | 'checkbox' | 'function'

export interface IColumn {
  prop: string
  label: string
  width: number
  type: ColumnType
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  lineClamp?: number
}

defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<IColumn[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
})

const stripHtml = (html: string) => {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const selectable = (row: Record<string, any>, index: number) => {
  return true
}
</script>

<style lang="scss">
.el-table__inner-wrapper {
  border-radius: 20px;
}

.table-title {
  height: 45px;
  font-weight: 800;
  font-size: 16px;
  color: #000;
}

.table-checkbox .el-checkbox__input {
  border: 1px solid #ccc;
  border-radius: 2px;
  width: 14px;
  height: 14px;
}

.table-checkbox .el-checkbox__input.is-checked {
  background-color: #4880ff;
  border-color: #333;
}

.table-checkbox .el-checkbox__input:hover {
  border-color: #555;
}

.is-line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table__header,
.el-table__body {
  width: 100% !important;
}

.custom-tooltip {
  max-width: 400px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  text-align: left !important;
}

.el-popper.is-customized {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #ccc;
}

.el-popper.is-customized .el-popper__arrow::before {
  background: #fff;
  right: 0;
  border: 1px solid #ccc;
}
</style>
