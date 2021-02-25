<template>
  <el-col :key="item.id" :span="8">
    <div class="detailStaff">
      <el-row class="header">
        <el-col :span="24" :title="item.name">{{ item.name }}
          <img class="avator" :src="getImg(item.icon)">
        </el-col>
      </el-row>
      <div class="body">
        <el-row v-if="canEdit" class="bodyItem">
          <el-col :span="5">联络人</el-col>
          <el-col :span="19">
            <span>{{ item.linkInfo }}</span>
          </el-col>
        </el-row>
        <el-row class="bodyItem">
          <el-col :span="5">联系方式</el-col>
          <el-col :span="19">
            <!-- <span>{{ item.phone }}</span> -->
            <lookphone :id="item.id" :phone="item.phone" encrypt-type="mediater" :type="20" :mediater-id="item.id" />
          </el-col>
        </el-row>
        <el-row class="bodyItem">
          <el-col :span="5">专业领域</el-col>
          <el-col :span="19">
            <span>{{ item.scope }}</span>
          </el-col>
        </el-row>
        <el-row class="bodyItem">
          <el-col :span="5">隶属</el-col>
          <el-col :span="19">
            <span>{{ item.parentCourt }}</span>
          </el-col>
        </el-row>
        <el-row class="bodyItem">
          <el-col :span="5">解纷类型</el-col>
          <el-col :span="19">
            <span>{{ item.disputeType }}</span>
          </el-col>
        </el-row>
        <el-row class="bodyItem" style="border: none;">
          <el-col v-if="teamType === 0" :span="5">联动单位</el-col>
          <el-col v-if="teamType === 0" :span="6">{{ item.kids }}个</el-col>
          <el-col v-if="teamType === 1" :span="12">
            <el-col :span="5">解纷组织</el-col>
            <el-col :span="6">{{ item.kids }}个</el-col>
          </el-col>
          <el-col v-if="isMechanism" :span="10">
            <el-col :span="5">解纷员</el-col>
            <el-col :span="6">{{ item.mediatorCount }}个</el-col>
          </el-col>
          <el-col :span="5">累计解纷</el-col>
          <el-col :span="6">{{ item.caseNum }}个</el-col>
        </el-row>
      </div>
      <el-row class="footer">
        <el-col :span="8">
          <el-button type="text" @click="look">查看</el-button>
        </el-col>
        <el-col :span="8">
          <!-- <el-button v-hasPermi="['team:staff:relieve']" type="text" @click="releaseCourt">解除</el-button> -->
        </el-col>
      </el-row>
    </div>
    <addStaff ref="addStaff" :mediater-id="item.id" @done="done" />
  </el-col>
</template>

<script>
import addStaff from './addStaff'
import { editCourtInfo, editMediator, delCourt, delMediators } from '@/api/team/team'
import { SERVICEURL, HWYURL } from '@/utils/constVal.js'
import lookphone from './lookPhone'
export default {
  name: 'DetailStaff',
  components: {
    addStaff,
    lookphone
  },
  props: {
    teamType: { // 机构类型，0：分流中心，1：联动单位，2：解纷阻止，3：解纷员
      type: Number,
      default: 1
    },
    item: { // 父组件传入表单
      type: Object,
      default: () => ({})
    },
    listCourt: { // 父组件传入的隶属的组织
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      disputeArr: [
        { name: '调解', index: 1 },
        { name: '仲裁', index: 2 },
        { name: '公证', index: 3 },
        { name: '行政复议', index: 4 },
        { name: '行政裁决', index: 5 }
      ],
      disputeMap: {
        1: '调解',
        2: '仲裁',
        3: '公证',
        4: '行政复议',
        5: '行政裁决'
      },
      organizationArr: [
        { name: '法院特邀调解', index: 1 },
        { name: '人民调解', index: 2 },
        { name: '行业调解', index: 3 },
        { name: '商事调解', index: 4 },
        { name: '行政调解', index: 5 }
      ],
      isEdit: false,
      from: {},
      sexArr: [
        { name: '男', index: 0 },
        { name: '女', index: 1 }
      ],
      unitArr: [0, 1, 2]
    }
  },
  computed: {
    canRelease() {
      return this.teamType !== 0 && this.teamType !== 20
    },
    canEdit() {
      return this.unitArr.includes(this.teamType)
    },
    isMechanism() {
      return this.teamType === 1 || this.teamType === 2
    },
    canEdit2() {
      return this.teamType === 2 || this.teamType === 20
    },
    getImg() {
      return function(src) {
        if (!src) {
          return require('@/assets/images/no.png')
        } else {
          if (src.indexOf(HWYURL) == -1) {
            src = SERVICEURL + src
          }
          return `${src}`
        }
      }
    }
  },
  watch: {
    item(cur, old) {
      this.from = cur // 赋值
      this.item.disputeType = this.item.disputeType ? this.item.disputeType.split('').map(item => {
        return this.disputeMap[item]
      }).join(',') : ''
    }
  },
  mounted() {
    this.item.disputeType = this.item.disputeType ? this.item.disputeType.split('').map(item => {
      return this.disputeMap[item]
    }).join(',') : ''
  },
  methods: {
    // 解除
    releaseCourt() {
      const params = {
        mediaterId: this.item.id
      }
      this.$confirm('是否解除该调解员', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMediators(params).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.$emit('done')
          }
        })
      }).catch(() => {})
    },
    // 视频连接
    connect(id) {
      this.$store.commit('SET_MENUINDEX', 12)
      this.$store.commit('SET_COURTID', id)
      this.$store.commit('SET_PATH', this.$route.fullPath)
      this.$router.push({ path: '/visualization/index', query: { path: this.$route.fullPath }})
    },
    // 查看
    look() {
      this.$refs.addStaff.show(this.teamType)
      this.$refs.addStaff._getInfoById()
    },
    done() {
      this.$emit('done')
    }
  }
}
</script>

<style lang = "scss">
.bodyItem{
  .el-input__inner {
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    text-align: right;
  }
}
</style>
<style scoped lang = "scss">
$basicColor:#ffffff;
$basic-border: 1px solid #dadbe6;
$basic-shadow: 0px 3px 5px 0px rgba(218, 219, 230, 0.6);
$basic-weight: 700;
.detailStaff {
  width: 360px;
  height: 320px;
  display: inline-block;
  margin-bottom:40px;
}
.header{
  width: 360px;
  height: 72px;
  line-height: 60px;
  background: $basicColor;
  border: $basic-border;
  border-radius: 10px 10px 0px 0px;
  color: #128bf1;
  font-weight: $basic-weight;
  box-shadow: $basic-shadow;
  vertical-align: middle;
  padding: 10px 27px;
  .el-col-24{
    @extend .ellipsis;
  }
}
.body{
  padding: 10px 20px;
  height: auto;
  background: rgba(179,214,254,0.25);
  border: $basic-border;
  .bodyItem{
    height: 40px;
    line-height: 40px;
    border-bottom: $basic-border;
    font-size: 12px;
    .el-col{
      color: #757575;
    }
    .el-col-19 {
      text-align: right;
      @extend .ellipsis;
    }
    .el-col-9 {
      background: $basicColor;
      border: $basic-border;
      border-radius: 16px;
      width: 60px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      margin-top: 5px;
    }
    .el-col-5 {
      width: 60px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      margin-top: 5px;
    }
    .el-col-6 {
      background: $basicColor;
      border: $basic-border;
      border-radius: 16px;
      width: 60px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      margin-top: 5px;
    }
  }
}
.footer{
  width: 360px;
  height: 50px;
  line-height: 50px;
  background: $basicColor;
  border: $basic-border;
  border-radius: 0px 0px 10px 10px;
  color: #128bf1;
  font-weight: $basic-weight;
  box-shadow: $basic-shadow;
  vertical-align: middle;
  padding: 0px 27px;
  .el-col-8 {
    text-align: center;
  }
  .el-button--text {
    color: #545871;
    font-weight: $basic-weight;
  }
}
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}
.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-move {
  transition: all .5s;
}
.avator {
  float: right;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: relative;
  z-index: 100;
}
</style>
