<template>
  <el-dialog
    title="当事人信息"
    :visible.sync="dialogVisible"
    width="50%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <!-- 自然人 -->
    <el-form v-if="form.litigantType === 0" ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="申请人类型">
            <div class="label">{{ litigantTypeMap[form.litigantType] }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="姓名">
            <div class="label">{{ form.litigantName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="民族">
            <div class="label">{{ form.nation }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别">
            <div class="label">{{ sexMap[form.litigantSex] }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="年龄">
            <div class="label">{{ form.age }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="证件类型">
            <div class="label">
              {{ identityMap[form.identityType] }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="证件号码">
            <div class="label">{{ form.identityCard }}<i class="el-icon-view" @click="lookInfo(form.id, 'identityCard')" /></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="手机号码">
            <div class="label">{{ form.litigantPhone }} <i class="el-icon-view" @click="lookInfo(form.id, 'litigantPhone')" /></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="地址">
            <div class="label">{{ form.address }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="工作单位或职务">
            <div class="label">{{ form.employer }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.frontImage" :gutter="20">
        <el-col :span="20">
          <el-form-item label="证件照片">
            <img v-if="form.frontImage" :src="form.frontImage" class="info-img" @click="preview(form.frontImage, form.imageAry1)">
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.backImage" :gutter="20">
        <el-col :span="20">
          <el-form-item label="证件照片">
            <img v-if="form.backImage" :src="form.backImage" class="info-img" @click="preview(form.backImage, form.imageAry1)">
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 法人 -->
    <el-form v-if="form.litigantType === 1" ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="申请人类型">
            <div class="label">{{ litigantTypeMap[form.litigantType] }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="公司名">
            <div class="label">{{ form.litigantName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系方式">
            <div class="label">{{ form.litigantPhone }}<i class="el-icon-view" @click="lookInfo(form.id, 'litigantPhone')" /></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="统一信用代码">
            <div class="label">{{ form.identityCard }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="公司注册地址">
            <div class="label">{{ form.address }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人姓名">
            <div class="label">{{ form.legalManName }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人手机号">
            <div class="label">{{ form.legalManPhone }}<i class="el-icon-view" @click="lookInfo(form.id, 'legalManPhone')" /></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人证件类型">
            <div class="label">{{ identityMap[form.identityType] }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人证件号码">
            <div class="label">{{ form.legalManId }}<i class="el-icon-view" @click="lookInfo(form.id, 'legalManId')" /></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="公司营业执照">
            <el-image
              v-if="form.companyImage"
              class="info-img"
              :src="form.companyImage"
              :preview-src-list="form.imageAry2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <preview ref="preview" />
  </el-dialog>
</template>

<script>
import preview from '@/components/preview/index'
import { getEncryptInfo } from '@/api/case/index'
import { selectLitigant } from '@/api/case/index.js'
import { LITIGANTTYPEMAP, SERVICEURL, IDENTITYMAP } from '@/utils/constVal.js'
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
      litigantTypeMap: LITIGANTTYPEMAP,
      sexMap: {
        0: '男',
        1: '女'
      },
      serviceUrl: SERVICEURL,
      identityMap: IDENTITYMAP
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    getLitigant(id) {
      selectLitigant({ litigantId: id }).then(res => {
        if (res.state === 100) {
          this.form = { ...res.litigant }
          this.form.imageAry = [this.form.frontImage]
          this.form.imageAry1 = [this.form.backImage]
          this.form.imageAry2 = [this.form.companyImage]
        }
      })
    },
    show(id) {
      this.dialogVisible = true
      this.getLitigant(id)
    },
    // 预览
    preview(url, urlList) {
      this.$refs.preview.show(url, urlList)
    },
    // 查看密文
    lookInfo(e, type) {
      const params = {
        litigantId: e,
        type
      }
      getEncryptInfo(params).then(res => {
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
