<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
  >
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item prop="name" label="解纷员名:" plcaeholder="请输入联系号码">
            <el-input v-if="isEdit" v-model="form.name" />
            <div v-if="!isEdit" class="label">{{ form.name }}</div>
          </el-form-item>
          <el-form-item prop="courtIds" label="所属单位或组织:">
            <!-- 修改的时候只有诉非才能修改所属单位  -->
            <el-select
              v-if="(mediaterId && getUserInfo.courtId == 1 && isEdit) || !mediaterId"
              v-model="form.courtIds"
              filterable
              multiple
              style="width: 100%"
              placeholder="请选择所属单位或组织"
            >
              <el-option
                v-for="item in unitType"
                :key="item.courtUid"
                :label="item.courtName"
                :value="item.courtUid"
              />
            </el-select>
            <div v-else class="label">{{ formDetail.courtName }}</div>
          </el-form-item>
          <el-form-item prop="phone" label="联系号码:" plcaeholder="请输入联系号码">
            <!-- <el-input v-if="isEdit" v-model="form.phone" /> -->
            <encryptInfo v-show="isEdit" :id="mediaterId" ref="encryptInfo1" v-model="form.phone" type="mediater" :litigant-type="3" :placeholder="'请输入联系号码'" />
            <div v-show="!isEdit" class="label">
              <lookphone :id="mediaterId" encrypt-type="mediater" :phone="form.phone" :type="20" :mediater-id="mediaterId" />
            </div>
          </el-form-item>
          <el-form-item prop="disputeType" label="解纷类型:">
            <el-select
              v-if="isEdit"
              v-model="form.disputeType"
              multiple
              style="width: 100%"
              placeholder="请选择解纷类型"
            >
              <el-option
                v-for="item in disputeArr"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              />
            </el-select>
            <div v-if="!isEdit" class="label">{{ disputeTypeName }}</div>
          </el-form-item>
          <el-form-item prop="sex" label="性别:">
            <el-select v-if="isEdit" v-model="form.sex" style="width: 100%" placeholder="请选择性别">
              <el-option
                v-for="item in sexArr"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              />
            </el-select>
            <div v-if="!isEdit" class="label">{{ formDetail.sex }}</div>
          </el-form-item>
          <el-form-item prop="scope" label="专业领域:" plcaeholder="请输入专业领域">
            <el-input v-if="isEdit" v-model="form.scope" type="textarea" />
            <div v-if="!isEdit" class="label">{{ form.scope }}</div>
          </el-form-item>
          <el-form-item prop="scope" label="简介:">
            <el-input
              v-if="isEdit"
              v-model="form.introduction"
              type="textarea"
              plcaeholder="请输入简介"
            />
            <div v-if="!isEdit" class="label">{{ form.introduction }}</div>
          </el-form-item>
          <el-form-item v-if="mediaterId" label="累计解纷:" plcaeholder>
            <div class="label">{{ caseNum }}</div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div class="img-wrapper">
          <img v-if="avator" :src="avator" alt>
          <img v-if="!avator" src="@/assets/images/no.png" alt>
          <el-button v-if="isEdit" class="upload-btn" type="small" @click="upload">上传图片</el-button>
        </div>
        <input ref="file" type="file" style="display: none;" @change="getFile($event)">
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="mediaterId && isEdit" @click="calcel">取 消</el-button>
      <el-button v-if="mediaterId && isEdit" type="primary" @click="edit">确 定</el-button>
      <el-button
        v-if="mediaterId && !isEdit && isEditAuthor !== 0"
        v-hasPermi="['team:staff:edit']"
        type="primary"
        @click="editBtn"
      >编 辑</el-button>
      <el-button v-if="!mediaterId" type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMediator } from '@/api/team/team'
import { editMediator, getInfoById } from '@/api/otherHome/otherHome'
import { uploadImg } from '@/api/common/common.js'
import { getCourtInfoByType, getCourtByLevel, medEditAuthority } from '@/api/team/team'
import { SERVICEURL, CASETYPE, HWYURL } from '@/utils/constVal.js'
import { validPhone } from '@/utils/validate'
import { mapGetters } from 'vuex'
import lookphone from './lookPhone'
import encryptInfo from '@/components/encryptInfo'
// 验证手机号
const validatePhone = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error('手机号码格式不正确'))
  } else {
    callback()
  }
}
export default {
  name: 'AddStaff',
  components: {
    lookphone,
    encryptInfo
  },
  props: {
    mediaterId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      dialogVisible: false,
      form: {
        name: '',
        courtIds: '',
        phone: '',
        sex: '',
        scope: '',
        disputeType: []
      },
      sexArr: [
        { index: 0, name: '男' },
        { index: 1, name: '女' }
      ],
      // 调解类型
      disputeArr: [
      ],
      disputeMap: {
      },
      unitType: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['change', 'blur']
          }
        ],
        courtIds: [
          {
            required: true,
            message: '请输入机构',
            trigger: ['change', 'blur']
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入号码',
            trigger: ['change', 'blur']
          }
        ],
        sex: [
          {
            required: true,
            message: '请选择性别',
            trigger: ['change', 'blur']
          }
        ],
        disputeType: [
          {
            required: true,
            message: '请选择解纷类型',
            trigger: ['change', 'blur']
          }
        ]
      },
      avator: '',
      caseNum: '',
      formDetail: {},
      isEdit: true,
      title: '添加解纷员',
      disputeTypeName: '',
      isEditAuthor: null
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  watch: {
    dialogVisible(cur, old) {
      !cur && this.$refs['form'].resetFields() // 表单清空
    },
    mediaterId() {
      this._getInfoById()
    }
  },
  mounted() {
    this.getDisputeArr()
  },
  methods: {
    // 获取解纷类型和组织类型
    getDisputeArr() {
      this.disputeArr = []
      this.disputeMap = {}
      for (const key in CASETYPE) {
        this.disputeArr.push({ name: CASETYPE[key], index: key })
        this.disputeMap[key] = CASETYPE[key]
      }
    },
    reset() {
      this.form = {}
    },
    show(teamType) {
      this.title = '添加解纷员'
      this.isEdit = true
      const params = {
        pageNum: 1,
        pageSize: 1000,
        courtType: '1,2',
        courtId: this.getUserInfo.courtUid
      }
      this.unitType = []
      medEditAuthority({ mediaterId: this.mediaterId }).then(res => {
        if (res.state === 100) {
          this.isEditAuthor = res.authorityType // 0 无权限 1 部分修改权限 2 全部修改权限
        }
      })
      getCourtByLevel(params).then(res => {
        if (res.state === 100) {
          this.unitType = res.content
        }
      })
      // getCourtInfoByType(params).then(async (res) => {
      //   if (res.state === 100) {
      //     const ary1 = res.data;
      //     const params1 = {
      //       pageNum: 1,
      //       pageSize: 1000,
      //       type: 2,
      //     };
      //     let ary2 = [];
      //     await getCourtInfoByType(params1).then((res) => {
      //       if (res.state === 100) {
      //         ary2 = res.data;
      //       }
      //     });
      //     this.unitType = [...ary1, ...ary2];
      //   }
      // });
      this.dialogVisible = true
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        const params = {
          ...this.form
        }
        console.log(this.form.disputeType)
        params.disputeType =
          this.form.disputeType && this.form.disputeType.length > 0
            ? this.form.disputeType.join('')
            : ''
        addMediator(params)
          .then((res) => {
            if (res.state === 100) {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.reset()
              this.$emit('done')
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    upload() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then((res) => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.form.icon = res.data.imgPath
          this.avator = `${res.data.imgPath}`
        }
      })
    },
    // 编辑
    edit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        const params = {
          ...this.form
        }
        params.phone = this.$refs.encryptInfo1.isdisabled ? this.$refs.encryptInfo1.input2 : params.phone
        params.mediaterId = this.mediaterId
        params.disputeType =
          this.form.disputeType && this.form.disputeType.length > 0
            ? this.form.disputeType.join('')
            : ''
        editMediator(params)
          .then((res) => {
            if (res.state === 100) {
              this.$message.success(res.message)
              this._getInfoById()
              this.dialogVisible = false
              this.$emit('done')
              this.isEdit = false
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    // 获取解纷员详情
    _getInfoById() {
      this.title = '查看解纷员'
      this.isEdit = false
      if (!this.mediaterId) {
        return
      }
      getInfoById({ mediaterId: this.mediaterId }).then((res) => {
        if (res.state === 100) {
          console.log(res)
          this.form = {
            name: res.info.name,
            courtIds: res.courtInfo.map((item) => {
              return item.courtId
            }),
            phone: res.info.phone,
            // sex: this.sexArr.find((item) => item.name == res.info.sex).index,
            sex: res.info.sex == '女' ? 1 : 0,
            scope: res.info.scope,
            icon: res.info.icon,
            disputeType: res.info.disputeType
              ? res.info.disputeType.split('')
              : '',
            introduction: res.info.introduction
          }
          this.caseNum = res.info.caseNum
          this.disputeTypeName = res.info.disputeType
            ? res.info.disputeType
              .split('')
              .map((item) => {
                return this.disputeMap[item]
              })
              .join(',')
            : ''
          console.log(this.form)
          this.formDetail = {
            courtName: res.courtInfo.map((item) => item.courtName).join(','),
            // sex: res.info.sex,
            sex: res.info.sex == '女' ? '女' : '男'
          }
          let imgUrl = res.info.icon ? `${res.info.icon}` : ''
          if (imgUrl && imgUrl.indexOf(HWYURL) == -1) {
            imgUrl = SERVICEURL + imgUrl
          }
          this.avator = imgUrl
          console.log(this.form)
        }
      })
    },
    // 编辑按钮
    editBtn() {
      this.title = '编辑解纷员'
      this.isEdit = true
      this.$refs.encryptInfo1?.init()
    },
    // 取消
    calcel() {
      this.title = '查看解纷员'
      this.isEdit = false
    }
  }
}
</script>

<style scoped lang = "scss">
.img-wrapper {
  width: 150px;
  height: 180px;
  margin: 0 auto;
  text-align: center;
  img {
    width: 100%;
    height: 100%;
  }
}
.upload-btn {
  margin: 10px auto;
}
</style>
