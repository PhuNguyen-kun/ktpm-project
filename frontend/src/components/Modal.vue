<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    @close="handleClose"
    @update:model-value="(val: any) => emit('update:visible', val)"
    destroy-on-close
  >
    <slot></slot>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">Hủy</el-button>
        <el-button type="primary" @click="handleSubmit">{{ confirmText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal Title',
  },
  confirmText: {
    type: String,
    default: 'Xác nhận',
  },
  formRef: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(['update:visible', 'submit', 'reset'])

const handleClose = () => {
  emit('update:visible', false)
  emit('reset')
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('reset')
}

const handleSubmit = () => {
  if (props.formRef) {
    props.formRef.validate((valid: boolean) => {
      if (valid) {
        emit('submit')
        emit('update:visible', false)
        emit('reset')
      } else {
        return false
      }
    })
  } else {
    emit('submit')
    emit('reset')
  }
}
</script>

<style lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
  padding-top: 5px;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 999;
}

.el-dialog__header {
  text-align: center;
  font-weight: 600;
  padding: 5px 0 20px 0;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;

  &__header,
  .dialog-footer {
    flex-shrink: 0;
  }
  &__body {
    flex-grow: 1;
    overflow-y: auto;
  }
}

.big-modal {
  width: 1100px;
  margin: auto;
  min-height: 500px;
  top: 50%;
  transform: translateY(-50%);
  padding-bottom: 60px;

  .dialog-footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .el-upload-dragger {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .el-icon--upload {
    margin-top: 50px;
  }
}
</style>
