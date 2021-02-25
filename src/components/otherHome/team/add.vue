<template>
  <el-dialog
    title="添加机构"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="30%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="courtName" label="机构名">
        <el-input v-model="form.courtName" plcaeholder="请输入机构名" />
      </el-form-item>
      <!-- <el-form-item prop="type" label="机构类型">
        <el-select v-model="form.type" placeholder="请选择机构类型">
          <el-option
            v-for="item in unitType"
            :key="item.index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="linkMan" label="联系人" plcaeholder="请输入联系人">
        <el-input v-model="form.linkMan" />
      </el-form-item>
      <el-form-item prop="phone" label="号码" plcaeholder="请输入联系号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="address" label="地址" plcaeholder="请输入地址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item prop="mediateType" label="解纷类型">
        <!-- <el-input v-model="form.mediateType"></el-input> -->
        <el-select v-model="form.mediateType" placeholder="请选择解纷类型">
          <el-option
            v-for="item in disputeArr"
            :key="item.index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="orgType" label="组织类型">
        <el-select v-model="form.orgType" placeholder="请选择组织类型">
          <el-option
            v-for="item in organizationArr"
            :key="item.index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="parentCourtId" label="上级机构">
        <el-select v-model="form.parentCourtId" placeholder="请选择上级机构">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.courtName"
            :value="item.id"
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
import { addCourt } from '@/api/otherHome/otherHome'
import { listCourtByType } from '@/api/otherHome/otherHome'
import teamData from './team'
export default {
  name: 'Add',
  mixins: [teamData], // 一些可以复用的数据放mixins里
  data() {
    return {
      isLoading: false,
      dialogVisible: false,
      form: {
        type: '',
        linkMan: '',
        phone: '',
        address: '',
        mediateType: '',
        orgType: '',
        parentCourtId: '',
        courtName: ''
      },
      options: [],
      unitType: [
        { index: 1, name: '联动单位' },
        { index: 2, name: '解纷组织' }
      ],
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: ['change', 'blur'] }],
        linkMan: [{ required: true, message: '请输入联系人', trigger: ['change', 'blur'] }],
        phone: [{ required: true, message: '请输入号码', trigger: ['change', 'blur'] }],
        address: [{ required: true, message: '请输入地址', trigger: ['change', 'blur'] }],
        mediateType: [{ required: true, message: '请选择解纷类型', trigger: ['change', 'blur'] }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: ['change', 'blur'] }],
        parentCourtId: [{ required: true, message: '请选择上级机构', trigger: ['change', 'blur'] }],
        courtName: [{ required: true, message: '请输入机构名', trigger: ['change', 'blur'] }]
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
        type: Number(teamType) - 1,
        pageSize: 100
      }
      listCourtByType(params).then(res => {
        if (res.state === 100) {
          this.options = res.content
        }
      })
      this.form.type = teamType
      this.dialogVisible = true
    },
    submit() {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        addCourt(this.form).then(res => {
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
