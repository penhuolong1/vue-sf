<template>
  <el-dialog
    title="添加解纷员"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="30%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="name" label="解纷员名" plcaeholder="请输入联系号码">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item prop="courtId" label="机构">
        <el-select v-model="form.courtId" placeholder="请选择机构类型">
          <el-option
            v-for="item in unitType"
            :key="item.id"
            :label="item.courtName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="phone" label="联系号码" plcaeholder="请输入联系号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-select v-model="form.sex" placeholder="请选择解纷类型">
          <el-option
            v-for="item in sexArr"
            :key="item.index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMediator } from '@/api/otherHome/otherHome'
import { listCourtByType } from '@/api/otherHome/otherHome'
export default {
  name: 'Add',
  data() {
    return {
      isLoading: false,
      dialogVisible: false,
      form: {
        name: '',
        courtId: '',
        phone: '',
        sex: ''
      },
      sexArr: [
        { index: 0, name: '男' },
        { index: 1, name: '女' },
        { index: 2, name: '未知' }
      ],
      unitType: [],
      rules: {
        name: [{ required: true, message: '请选择姓名', trigger: ['change', 'blur'] }],
        courtId: [{ required: true, message: '请输入机构', trigger: ['change', 'blur'] }],
        phone: [{ required: true, message: '请输入号码', trigger: ['change', 'blur'] }],
        sex: [{ required: true, message: '请选择性别', trigger: ['change', 'blur'] }]
      }
    }
  },
  computed: {

  },
  watch: {
    dialogVisible(cur, old) {
      !cur && this.$refs['form'].resetFields() // 表单清空
    }
  },
  mounted() {

  },
  methods: {
    show(teamType) {
      const params = {
        type: 2,
        pageSize: 100
      }
      listCourtByType(params).then(res => {
        if (res.state === 100) {
          this.unitType = res.content
        }
      })
      this.dialogVisible = true
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        addMediator(this.form).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.dialogVisible = false
            this.$emit('done')
          }
        }).finally(() => {
          this.isLoading = false
        })
      })
    }
  }
}
</script>

<style scoped lang = "scss">

</style>
