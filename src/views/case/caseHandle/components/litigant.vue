<template>
  <!-- 同步调解平台 -->
  <el-dialog
    :close-on-click-modal="false"
    width="800"
    title="当事人信息"
    append-to-body
    :visible.sync="modalVisible"
  >
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="当事人类型" prop="dsrlx">
              <el-select v-model="form.dsrlx" filterable style="width: 100%;" placeholder="请选择当事人类型">
                <el-option
                  v-for="item in dsrlx"
                  :key="item.pro1"
                  :label="item.pro2"
                  :value="item.pro1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="zjlx">
              <el-select v-model="form.zjlx" filterable style="width: 100%;" placeholder="请选择证件类型">
                <el-option
                  v-for="item in zjlx"
                  :key="item.pro1"
                  :label="item.pro2"
                  :value="item.pro1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="isNaturalPerson ? '姓名':'当事单位名称'" prop="dsrxm">
              <el-input v-model="form.dsrxm" style="width: 100%;" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="zjhm">
              <el-input v-model="form.zjhm" style="width: 100%;" placeholder="请输入证件号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isNaturalPerson">
          <el-col :span="12">
            <el-form-item label="性别" prop="xb">
              <el-select v-model="form.xb" filterable style="width: 100%;" placeholder="请选择性别">
                <el-option
                  v-for="item in xb"
                  :key="item.pro1"
                  :label="item.pro2"
                  :value="item.pro1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="nl">
              <el-input v-model="form.nl" style="width: 100%;" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isNaturalPerson">
          <el-col :span="12">
            <el-form-item label="民族" prop="mz">
              <el-select v-model="form.mz" filterable style="width: 100%;" placeholder="请选择民族">
                <el-option
                  v-for="item in mz"
                  :key="item.pro1"
                  :label="item.pro2"
                  :value="item.pro1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="zy">
              <el-input v-model="form.zy" style="width: 100%;" placeholder="请输入职业" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isNaturalPerson">
          <el-col :span="12">
            <el-form-item label="电话" prop="dh">
              <el-input v-model="form.dh" style="width: 100%;" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="dwdz">
              <el-input v-model="form.dwdz" style="width: 100%;" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isNaturalPerson">
          <el-col :span="12">
            <el-form-item label="当事单位负责人" prop="dsdwfzr">
              <el-input v-model="form.dsdwfzr" style="width: 100%;" placeholder="请输入当事单位负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位电话" prop="dh">
              <el-input v-model="form.dh" style="width: 100%;" placeholder="请输入单位电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isNaturalPerson">
          <el-col :span="24">
            <el-form-item label="单位地址" prop="dwdz">
              <el-input v-model="form.dwdz" style="width: 100%;" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {
    mz: {
      type: Array,
      default: () => {
        return []
      }
    },
    dsrlx: {
      type: Array,
      default: () => {
        return []
      }
    },
    zjlx: {
      type: Array,
      default: () => {
        return []
      }
    },
    xb: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      modalVisible: false,
      form: {},
      isLoading: false,
      type: null,
      rules: {
        dsrlx: [{ required: true, message: '请选择当事人类型', trigger: ['blur'] }],
        zjlx: [{ required: true, message: '请选择证件类型', trigger: ['blur'] }],
        dsrxm: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
        zjhm: [{ required: true, message: '请输入证件号码', trigger: ['blur'] }],
        xb: [{ required: true, message: '请选择性别', trigger: ['blur'] }],
        nl: [{ required: true, message: '请输入年龄', trigger: ['blur'] }],
        mz: [{ required: true, message: '请选择民族', trigger: ['blur'] }],
        zy: [{ required: true, message: '请输入职业', trigger: ['blur'] }],
        dh: [{ required: true, message: '请输入电话', trigger: ['blur'] }],
        dsdwfzr: [{ required: true, message: '请输入当事单位负责人', trigger: ['blur'] }],
        dwdz: [{ required: true, message: '请输入地址', trigger: ['blur'] }]
      }
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    isNaturalPerson() { // 判读是否为自然人
      return this.form.dsrlx == '8a4f832c5d3f24d3015d3fce1014007e'
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {

  },
  methods: {
    show(form, type) {
      this.form = form
      this.type = type
      this.modalVisible = true
    },
    cancel() {
      this.modalVisible = false
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('done', this.form, this.type)
        this.cancel()
      })
    }
  }
}
</script>

<style scoped lang="scss">

.content {
  max-height: 500px;
  overflow: auto;
}
</style>
