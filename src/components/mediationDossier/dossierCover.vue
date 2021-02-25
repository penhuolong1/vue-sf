<template>
  <div>
    <div class="title">
      <span v-if="myResultTypeFlag && getUserInfo.roleType != 3 && (getTeamData.caseFlag || getTeamData.type == 1)">
        <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1500">
          <img v-show="!editCoverFlag" class="file-img" src="@/assets/icon/edit.png" alt="" @click="setEdit">
        </el-tooltip>
        <el-tooltip effect="dark" content="保存" placement="top" :hide-after="1500">
          <img v-show="editCoverFlag" class="file-img" src="@/assets/icon/sure.png" alt="" @click="saveEdit">
        </el-tooltip>
        <el-tooltip effect="dark" content="返回" placement="top" :hide-after="1500">
          <img v-show="editCoverFlag" class="file-img" src="@/assets/icon/back.png" alt="" @click="back">
        </el-tooltip>
      </span>
    </div>
    <el-row class="form cover" type="flex">
      <el-col :span="24">
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">卷号</div>
          </el-col>
          <el-col :span="18">
            <div v-show="!editCoverFlag" class="item-data">{{ coverData.archiveNo }}</div>
            <div v-show="editCoverFlag" class="item-data">{{ tempCoverData.archiveNo }}</div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">卷宗类型</div>
          </el-col>
          <el-col :span="18">
            <div v-show="!editCoverFlag" class="item-data">{{ coverData.type }}</div>
            <div v-show="editCoverFlag" class="item-data">{{ tempCoverData.type }}</div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">立卷人</div>
          </el-col>
          <el-col :span="18">
            <div class="item-data">{{ coverData.creatName }}</div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">卷名</div>
          </el-col>
          <el-col :span="18">
            <div v-show="!editCoverFlag" class="item-data">{{ coverData.name }}</div>
            <div v-show="editCoverFlag" class="item-data">
              <el-input v-model="tempCoverData.name" placeholder="请输入内容" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item-title">人民解纷员</div>
          </el-col>
          <el-col :span="18">
            <div class="item-data">{{ coverData.mediater }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item-title">立卷日期</div>
          </el-col>
          <el-col :span="18">
            <div class="item-data">{{ coverData.createDate }}</div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">年度</div>
          </el-col>
          <el-col :span="18">
            <div v-show="!editCoverFlag" class="item-data">{{ coverData.year }}</div>
            <div v-show="editCoverFlag" class="item-data">
              <el-input v-model="tempCoverData.year" placeholder="请输入内容" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item-title">解纷日期</div>
          </el-col>
          <el-col :span="18">
            <div class="item-data">{{ coverData.mediateTerm }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item-title">保管期限</div>
          </el-col>
          <el-col :span="18">
            <div v-show="!editCoverFlag" class="item-data">{{ coverData.depositTerm }}</div>
            <div v-show="editCoverFlag" class="item-data">
              <el-input v-model="tempCoverData.depositTerm" placeholder="请输入内容" />
            </div>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <div class="item-title">备注</div>
          </el-col>
          <el-col :span="18">
            <!-- <el-tooltip class="item-textarea" v-show='!editCoverFlag' effect="dark" :content="coverData.remain" placement="left-start"> -->
            <div v-show="!editCoverFlag" class="item-data" style="padding:5px 15px">{{ coverData.remain }}</div>
            <!-- </el-tooltip> -->
            <div v-show="editCoverFlag" class="item-title">
              <el-input
                v-model="tempCoverData.remain"
                type="textarea"
                placeholder="请输入内容"
              />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addMediateFile,
  listSqCaseNo,
  getTableByCaseId
} from '@/api/dossier/dossier.js'
import { formatDate } from '@/lib/date'
import { mapGetters } from 'vuex'
export default {
  name: 'DossierEdit',
  components: {
  },
  props: ['showAction', 'menuList'],
  data() {
    return {
      archiveNoList: [],
      archiveNoList_type: [],
      onceDataFlag: false,
      bookUrl: '',
      loading: false,
      editCoverFlag: false, // 编辑封面
      editFlag: '', // 编辑内容
      actionData: {
        type: '',
        id: ''
      },
      coverData: {
        id: '',
        caseId: '',
        archiveNo: '',
        name: '',
        type: '',
        year: '',
        mediateTerm: '',
        passengerTransportation: '',
        createDate: '',
        creatName: '',
        remain: '',
        mediater: ''
      },
      tempCoverData: {}
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo', 'getTeamData']),
    // 卷宗类型
    dossierTypeAry() {
      return this.$store.getters.getBriefList
    },
    // 登录角色的身份权限
    myResultTypeFlag() {
      return this.$store.state.user.userInfo.roleType != 4
    }
  },
  watch: {
    'tempCoverData.archiveNo': {
      handler(newName, oldName) {
        console.log('**************', newName)
        if (this.archiveNoList.length) {
          console.log(1111)
          for (const i in this.archiveNoList) {
            if (this.archiveNoList[i] == newName) {
              this.tempCoverData.type = this.archiveNoList_type[i]
              console.log(this.tempCoverData)
            }
          }
        }
      },
      deep: true
    }
  },
  created() {
    // this.getTableByCaseId()
    this.init()
  },
  methods: {
    // 初始化
    init(coverData) {
      console.log(this.$route.name, '******************************')
      // if (this.getCaseInfo.process < 4) {
      //   this.$message.error('该案件还没进入调解过程不能生成卷宗')
      // }
      this.coverData.archiveNo = this.getCaseInfo.sqCaseNo || this.getCaseInfo.dCaseNo
      this.coverData.type = this.getCaseInfo.brief.name
      if (!coverData) {
        return
      }
      this.editCoverFlag = false
      this.coverData = coverData
    },
    // 添加卷号输入模糊搜索
    getArchiveNoList(val) {
      this.tempCoverData.archiveNo = val
      console.log(this.tempCoverData.archiveNo)
      listSqCaseNo({
        sqCaseNo: val,
        pageSize: 15,
        pageNum: 1
      }).then(res => {
        this.archiveNoList = res.sqCaseNos
        this.archiveNoList_type = res.briefs
      })
    },
    // 编辑封面
    setEdit() {
      this.editCoverFlag = true
      if (this.editCoverFlag) {
        this.tempCoverData = { ...this.coverData }
      }
    },
    // 返回
    back() {
      this.editCoverFlag = false
    },
    // 保存封面
    saveEdit() {
      this.coverData = { ...this.tempCoverData }
      console.log(this.coverData)
      addMediateFile({
        id: this.coverData.id,
        type: this.coverData.type,
        name: this.coverData.name,
        archiveNo: this.coverData.archiveNo,
        remain: this.coverData.remain,
        depositTerm: this.coverData.depositTerm,
        year: this.coverData.year
      }).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.$emit('done')
          this.coverData.id = res.tableId
          this.coverData.caseId = res.caseId
          this.editCoverFlag = false
        }
      })
    }
    // getTableByCaseId() {
    //   getTableByCaseId({ caseId: this.$store.state.cases.caseId }).then(res => {
    //     if (res.state === 100) {
    //       const data = res.table
    //       const obj = {
    //         archiveNo: data.archiveNo,
    //         createDate: data.createDate ? formatDate(new Date(data.createDate), 'yyyy-MM-dd') : '', // 立卷时间
    //         caseId: this.$store.state.cases.caseId,
    //         mediateTerm: res.mediaterTime ? formatDate(new Date(res.mediaterTime), 'yyyy-MM-dd') : '', // 解纷时间
    //         creatName: data.admin.name, // 立卷人
    //         mediater: res.mediater.name,
    //         passengerTransportation: data.court.name,
    //         type: data.type,
    //         name: data.name,
    //         depositTerm: data.depositTerm ? formatDate(new Date(data.depositTerm), 'yyyy-MM-dd') : '',
    //         remain: data.remain,
    //         id: data.id

    //       }
    //       this.init(obj)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.file-img {
  width: 40px;
  height: 40px;
}
.title {
    display: flex;
    font-size: 16px;
    color: #007AFF;
    font-weight: bold;
    ::v-deep .el-button {
    height: 30px;
    line-height: 30px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-left: 10px;
    &.edit {
      background-color: #1890FF;
    }
    &.save {
      background-color: #F4AA5A;
      border-color: #F4AA5A;
    }
  }
    span {
        line-height: 30px;
        color: #007AFF;
        font-weight: bold;
        img {
            margin-left: 15px;
            cursor: pointer;
        }
    }
}
.icon-edit {
    margin-left: 25px;
    color: #FF8A48;
    cursor: pointer;
}
.icon-claim {
    margin-left: 17px;
    color: rgb(36,117,254);
    cursor: pointer;
}
.form {
    margin-top: 33px;
    border: 1px solid #E7E8E8;
    border-bottom: none;
}
::v-deep .cover .el-input__inner{
    border: none;
    height: 38px;
}
.item-title {
    width: 100%;
    min-height: 60px;
    height: 100%;
    border-bottom: 1px solid #E7E8E8;
    border-right: 1px solid #E7E8E8;
    line-height: 60px;
    font-weight: bold;
    text-align: center;
}
.item-textarea {
    width: 100%;
    // height:80px;
    word-wrap:break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
::v-deep .cover .el-textarea__inner {
    min-height: 40px !important;
    border: none;
}
.item-data {
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #E7E8E8;
    line-height: 60px;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #707070;
}
.remark {
    text-align: center;
    background-color: #f3f3f3;
}
.menu {
    padding: 44px 0;
    background: #FAFBFB;
    box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
          -15px 0 15px -15px rgba(0, 0, 0, 0.16);
}
.menu-item {
    cursor: pointer;
}
.menu-title {
    padding: 10px 0;
}
.menu-val {
    display: flex;
    align-items: center;
    justify-content: center;
}
.menu-val div {
    width: 20px;
    height: 20px;
    color: #fff;
    background: #23EAA4;
    text-align: center;
}
.action {
    background: rgb(200,230,254);
}
.view-action {
    // padding: 30px 0;
    background: #fff;
    box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
          -15px 0 15px -15px rgba(0, 0, 0, 0.16);
}
.operation {
    position: relative;
    padding-top: 30px;
}
.operation p {
    margin-bottom: 25px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
}
.operation-bule {
    border: 1px solid #0093FF;
    color: #0093FF;
}
.operation-yellow {
    border: 1px solid #FEC500;
    color: #FEC500;
}
.view-action-btn {
    padding: 10px;
}
.img-box img{
    margin-left: 20px;
    cursor: pointer;
}
</style>
