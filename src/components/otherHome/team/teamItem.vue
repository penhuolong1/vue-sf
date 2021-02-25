<template>

  <el-col :key="item.id" :span="8">
    <div class="teamItem">
      <el-row class="header">
        <el-col :span="24" :title="item.name">{{ item.name }}</el-col>
        <!-- <el-col v-if="item.orgSign" :span="6" style="text-align: right;">
          <img
            :src="item.orgSign"
            style="width: 35px;height: 35px;"
            alt=""
          >
        </el-col> -->
      </el-row>
      <div class="body">
        <el-row v-if="canEdit" class="bodyItem">
          <el-col :span="5">联络人</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.linkInfo }}</span>
            <el-input v-show="isEdit" v-model="from.linkMan" placeholder="请输入姓名" style="width: 100px;" />
            <span v-show="isEdit">/</span>
            <el-input v-show="isEdit" v-model="from.phone" placeholder="请输入号码" style="width: 100px;" />
          </el-col>
        </el-row>
        <el-row v-if="isMediator" class="bodyItem">
          <el-col :span="5">联系方式</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.phone }}</span>
            <el-input v-show="isEdit" v-model="from.phone" placeholder="请输入号码" style="width: 100px;" />
          </el-col>
        </el-row>
        <el-row v-if="isMediator" class="bodyItem">
          <el-col :span="5">性别</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.sex }}</span>
            <el-select v-show="isEdit" v-model="from.sex" placeholder="请选择性别">
              <el-option
                v-for="item2 in sexArr"
                :key="item2.index"
                :label="item2.name"
                :value="item2.index"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="canEdit" class="bodyItem">
          <el-col :span="5">地址</el-col>
          <el-col :span="19">
            <span v-show="!isEdit" :title="item.address">{{ item.address }}</span>
            <el-input v-show="isEdit" v-model="from.address" />
          </el-col>
        </el-row>
        <el-row v-if="teamType === 1" class="bodyItem">
          <el-col :span="5">解纷类型</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.mediateTypeStr }}</span>
            <el-select v-show="isEdit" v-model="from.mediateType" placeholder="请选择解纷类型">
              <el-option
                v-for="item2 in disputeArr"
                :key="item2.index"
                :label="item2.name"
                :value="item2.index"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="teamType === 2 || teamType === 20" class="bodyItem">
          <el-col :span="5">隶属</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.parentCourt }}</span>
            <span v-show="isEdit && teamType === 2">{{ item.parentCourt }}</span>
            <!-- <el-input v-show="isEdit" v-model="from.parentCourt" /> -->
            <el-select v-show="isEdit && teamType === 20" v-model="from.cId" placeholder="请选择隶属">
              <el-option
                v-for="item2 in listCourt"
                :key="item2.id"
                :label="item2.courtName"
                :value="item2.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="isMechanism" class="bodyItem">
          <el-col :span="5">组织类型</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.orgTypeStr }}</span>
            <el-select v-show="isEdit" v-model="from.orgType" placeholder="请选择解纷类型">
              <el-option
                v-for="item2 in organizationArr"
                :key="item2.index"
                :label="item2.name"
                :value="item2.index"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="teamType === 0" class="bodyItem">
          <el-col :span="5">成立时间</el-col>
          <el-col :span="19">
            <span v-show="!isEdit">{{ item.date }}</span>
            <el-date-picker
              v-show="isEdit"
              v-model="item.date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
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
          <el-col v-if="isMediator" :span="5">累计解纷</el-col>
          <el-col v-if="isMediator" :span="6">{{ item.kidCount }}个</el-col>
        </el-row>
      </div>
      <el-row class="footer">
        <el-col v-if="teamType !== 0" :span="8">
          <el-button v-show="!isEdit" v-permission="[1,4,6]" type="text" @click="edit">编辑</el-button>
          <el-button v-show="isEdit" v-permission="[1,4,6]" type="text" @click="comfirm">确认编辑</el-button>
        </el-col>
        <el-col v-if="canRelease" :span="8">
          <!-- <el-button v-permission="[1,4,6]" type="text" @click="releaseCourt">解除</el-button> -->
        </el-col>
        <el-col v-if="!isMediator" :span="8">
          <el-button type="text" @click="connect(item.id)">联络</el-button>
        </el-col>
      </el-row>
    </div>
  </el-col>
</template>

<script>
import { editCourtInfo, editMediator, delCourt } from '@/api/otherHome/otherHome'
import teamData from './team'
export default {
  name: 'TeamItem',
  mixins: [teamData], // 一些可以复用的数据放mixins里
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
      isEdit: false,
      from: {},
      sexArr: [
        { name: '男', index: 0 },
        { name: '女', index: 1 },
        { name: '未知', index: 2 }
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
    isMediator() {
      return this.teamType === 20
    },
    isMechanism() {
      return this.teamType === 1 || this.teamType === 2
    },
    canEdit2() {
      return this.teamType === 2 || this.teamType === 20
    }
  },
  watch: {
    item(cur, old) {
      this.from = cur // 赋值
    }
  },
  mounted() {
  },
  methods: {
    edit() { // 编辑
      this.from = {
        ...this.item,
        linkMan: '',
        phone: ''
      }
      if (this.item.sex === '男') {
        this.from.sex = 0
      } else if (this.item.sex === '女') {
        this.from.sex = 1
      } else {
        this.from.sex = 2
      }
      if (this.item.linkInfo) {
        const [name, phone] = this.item.linkInfo.split('/') // 将联络人和联系方式进行处理
        this.from.linkMan = name
        this.from.phone = phone
      } else {
        this.from.phone = this.item.phone
      }
      this.isEdit = !this.isEdit
    },
    comfirm() { // 提交编辑内容
      if (this.unitArr.some(item => this.teamType === item)) { // 编辑机构走这里
        this.from.courtId = this.from.id
        editCourtInfo(this.from).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.isEdit = !this.isEdit
            this.$emit('done') // 编辑成功后触发父组件事件刷新列表
          }
        })
      } else { // 编辑当事人走这里
        this.from.mediaterId = this.from.id
        this.from.courtId = this.from.cId
        // if (isNaN(this.from)) {
        //   this.from.sex = this.from.sex === '男' ? 0 : 1
        // }
        editMediator(this.from).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.isEdit = !this.isEdit
            this.$emit('done') // 编辑成功后触发父组件事件刷新列表
          }
        })
      }
    },
    releaseCourt() {
      const data = {
        courtId: this.item.id,
        confirm: true
      }
      delCourt(data).then(res => {
        if (res.state === 100) {
          if (res.message.includes('删除成功')) {
            this.$message.success(res.message)
            this.$emit('done')
            return
          }
          this.$confirm(res.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delCourt(data).then(res => {
              if (res.state === 100) {
                this.$message.success(res.message)
                this.$emit('done')
              }
            })
          }).catch(() => {})
        }
      })
    },
    // 视频连接
    connect(id) {
      this.$store.commit('SET_MENUINDEX', 12)
      this.$store.commit('SET_COURTID', id)
      this.$store.commit('SET_PATH', this.$route.fullPath)
      this.$router.push({ path: '/visualization/index', query: { path: this.$route.fullPath }})
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
  @import './teamItem.scss';
</style>
