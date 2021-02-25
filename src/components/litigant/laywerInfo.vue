<template>
  <div>
    <el-dialog
      title="代理人信息"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <!-- 代理人 -->
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="代理人类型:" prop="agentType">
              <div class="label">{{ agentTypeMap[form.agentType] }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="当事人:" prop="litigantId">
              <div class="label">{{ form.litigantName }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="姓名:" prop="name">
              <div class="label">{{ form.agentName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="民族:">
              <div class="label">{{ form.nation }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="证件号码:" prop="agentIdentiCard">
              <div class="label">{{ form.agentIdentiCard }}<i class="el-icon-view" @click="lookInfo(form.id, 'agentIdentiCard')" /></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="性别:">
              <div class="label">{{ sexMap[form.sex] }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="年龄:">
              <div class="label">{{ form.years }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="手机号码:" prop="agentMobile">
              <div class="label">{{ form.agentMobile }}<i class="el-icon-view" @click="lookInfo(form.id, 'agentMobile')" /></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="地址:" prop="address">
              <div class="label">{{ form.address }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="工作单位或职务:">
              <div class="label">{{ form.unitInfo }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="form.agentType == 1" :span="20">
            <el-form-item label="律师证件号:" prop="lawyerNum">
              <div class="label">{{ form.lawyerNum }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="form.agentType == 4" :span="20">
            <el-form-item label="亲属关系:" prop="partyRelationString">
              <div class="label">{{ form.partyRelationString }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="相关资料:">
            <el-tag
              v-for="(item, index) in form.imgAry"
              :key="index"
              style="cursor: pointer;"
              type="success"
              @click="preview(item.url)"
            >{{ item.name }}</el-tag>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="代理相关事项:" prop="">
            <ul>
              <li v-for="(item, index) in form.delegatedAuthority" :key="index">{{ authorityMap[item] }}</li>
            </ul>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col v-if="isShowTextarea" :span="20">
            <el-form-item label="其他委托事项:" prop="">
              <div class="label">{{ form.otherAuthority }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <preview ref="preview" :file-list="form.fileList" :file-url="fileUrl" />
  </div>
</template>

<script>
import { detailById } from '@/api/case/index.js'
import preview from '@/components/preview'
import { getEncryptInfoLawyer } from '@/api/case/index'
import { AGENTTYPEMAP, SERVICEURL } from '@/utils/constVal.js'
export default {
  components: {
    preview
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      agentTypeMap: AGENTTYPEMAP,
      fileUrl: '',
      sexMap: {
        0: '男',
        1: '女'
      },
      authorityMap: {
        1: '代为申请解纷或者要求终止解纷',
        2: '代为收集、提供证据',
        3: '代为选择或者接受人民解纷员',
        4: '代为承认、变更和放弃解纷请求',
        5: '代为参加解纷，签署调查记录、解纷记录、权利义务告知书、人民解纷协议书等法律文书',
        6: '代为领取相关法律文书等',
        7: '其他委托事项'
      },
      serviceUrl: SERVICEURL
    }
  },
  computed: {
    isShowTextarea() {
      return this.form.delegatedAuthority && this.form.delegatedAuthority.indexOf(7)
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    getlaywer(id) {
      detailById({ lawyerId: id }).then(res => {
        if (res.state === 100) {
          this.form = { ...res.data }
          this.form.delegatedAuthority = res.data.delegatedAuthority ? res.data.delegatedAuthority.split(',') : []
          this.form.litigantName = res.litigantList[0] ? res.litigantList[0].name : ''
          const ary = []
          if (res.data.frontImage) {
            const obj = {
              name: res.data.frontImage.split('/').pop(),
              url: res.data.frontImage
            }
            ary.push(obj)
          }
          this.fileUrl = res.data.frontImage
          if (res.data.backImage) {
            const obj = {
              name: res.data.backImage.split('/').pop(),
              url: res.data.backImage
            }
            ary.push(obj)
          }
          this.form.imgAry = ary
          this.form.fileList = ary.map(item => item.url)
        }
      })
    },
    show(id) {
      this.dialogVisible = true
      this.getlaywer(id)
    },
    // 预览
    preview(url) {
      this.$refs.preview.show(url)
    },
    // 查看密文
    lookInfo(e, type) {
      const params = {
        lawyerId: e,
        type
      }
      getEncryptInfoLawyer(params).then(res => {
        if (res.state === 100) {
          this.form[type] = res[type]
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-form-item {
  margin-bottom: 0px;
}
.info-img {
  max-width: 200px;
}
.el-icon-view {
  cursor: pointer;
  margin-left: 10px;
}
</style>
