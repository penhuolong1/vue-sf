<!-- 申请协同  -->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      width="800px"
      title="发起协同"
      append-to-body
      :visible.sync="modalVisible"
    >
      <div class="wrapper">
        <div class="wrapper-left">
          <div class="search-wrapper1">
            <i class="el-icon-search" />
            <input v-model="secVal" type="text" placeholder="请输入名字搜索">
            <div class="search-btn" @click="search">搜索</div>
          </div>
          <div class="menu-wrapper">
            <ul>
              <li v-for="(item, index) in menuList" :key="index" :class="{'active': index === selectMenuIndex}" @click="selectMenu(index)">{{ item }}</li>
            </ul>
          </div>
          <div class="content">
            <transition name="el-fade-in-linear">
              <el-tree v-show="selectMenuIndex === 0" ref="tree" :props="props" :data="treeData" node-key="id" show-checkbox :check-strictly="true" @node-click="getNode" />
            </transition>
            <transition name="el-fade-in-linear">
              <el-tree v-show="selectMenuIndex === 1" ref="tree1" :props="props" :data="orgData" node-key="id" show-checkbox :check-strictly="true" @node-click="getNode" />
            </transition>
            <transition name="el-fade-in-linear">
              <el-tree v-show="selectMenuIndex === 2" ref="tree2" :props="props" :data="mediatorData" node-key="id" :filter-node-method="filterNode" show-checkbox :check-strictly="true" @node-click="getNode" @check-change="checkChange" />
            </transition>
          </div>
        </div>
        <div class="wrapper-btn">
          <el-tooltip effect="dark" content="添加左侧已选单位" placement="top" :hide-after="1500">
            <div class="btn-item" @click="getSelectData">
              <i class="el-icon-arrow-right" />
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="移除右侧已选单位" placement="top" :hide-after="1500">
            <div class="btn-item" @click="removeSelectData">
              <i class="el-icon-arrow-left" />
            </div>
          </el-tooltip>
        </div>
        <div class="wrapper-right">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item, index) in selectListData" :key="index" :label="item.id" class="my-check">
              <div class="name">{{ item.name }}<span v-if="item.parent">({{ item.parent.name }})</span></div>
              <div class="type">
                <ul style="width: 200px">
                  <li :class="{'active': item.type == 1}" @click.stop.prevent="selectType(index, 1)">主要办案员</li>
                  <li :class="{'active': item.type == 2}" @click.stop.prevent="selectType(index, 2)">案件协助员</li>
                </ul>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="400px"
      title="选择机构"
      append-to-body
      :visible.sync="courtVisible"
    >
      <div class="wrapper">
        <el-radio-group v-model="radio">
          <el-radio v-for="item in medCourtList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
      <tip text="默认选择第一个机构" style="margin-top: 10px;" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="courtVisible == false">取 消</el-button>
        <el-button type="primary" @click="selectMedCourt">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCourtInfoByType,
  listCourtByCourId,
  listCourtsByMediater,
  treeForTeam
} from '@/api/team/team'
import tip from '@/components/tip/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    tip
  },
  props: {

  },
  data() {
    return {
      modalVisible: false,
      form: {},
      isLoading: false,
      selectMenuIndex: 0,
      menuList: ['协同单位', '协同组织', '协同员'],
      // 懒加载数据
      props: {
        label: 'name',
        children: 'child'
      },
      secVal: '',
      orgData: [], // 协同组织数据
      mediatorData: [], // 协同员数据
      checkList: [],
      selectListData: [],
      elTree: true,
      radio: null, // 选择的调解员的机构
      courtVisible: false,
      medCourtList: [], // 所选调解员的父级机构
      medAndCourtList: null, // 调解员和机构的关系数组
      nowMedId: null, // 当前选择的解纷员id
      treeData: []
    }
  },
  computed: {
    ...mapGetters(['getselectUnitList', 'getUserInfo'])
  },
  watch: {
    getselectUnitList() {
      this.selectListData = this.getselectUnitList
      const selectId = this.selectListData.map(item => item.id)
      this.$refs.tree.setCheckedKeys(selectId)
      this.$refs.tree1.setCheckedKeys(selectId)
      this.$refs.tree2.setCheckedKeys(selectId)
    }
  },
  created() {
    this.getorgData()
    this.getMediatorData()
    this.getTreeForTeam()
  },
  mounted() {
  },
  methods: {
    // 获取联动单位数据
    getTreeForTeam() {
      treeForTeam({ courtName: this.secVal }).then(({ state, infoList }) => {
        if (state === 100) {
          let list = []
          list = infoList && infoList.length > 0 && this.getList(infoList)
          this.treeData = list
        }
      })
    },
    getList(list) {
      if (!list || list.length === 0) {
        return
      }
      return list.map(item => {
        return {
          name: item.courtName || item.flowCourtName,
          id: item.courtUid || item.flowCourtUid,
          child: this.getList(item.child)
        }
      })
    },
    // 调解员名字查询
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选择调解员的机构
    selectMedCourt() {
      const obj = this.medCourtList.find(item => item.id == this.radio)
      this.medAndCourtList[this.nowMedId] = { // 替换当前调解员的机构id
        name: obj.name,
        id: obj.id
      }
      this.courtVisible = false
    },
    // 判断调解员是否有多机构
    checkChange(item, node, self) {
      console.log('-----------99----------')
      listCourtsByMediater({ mediaterId: item.id }).then(res => {
        if (res.state === 100) {
          this.medCourtList = res.courts
          this.radio = res.courts[0].id
          if (node) {
            this.nowMedId = item.id
            const obj = {
              [item.id]: {
                name: res.courts[0].name,
                id: res.courts[0].id
              }
            }
            this.medAndCourtList = {
              ...this.medAndCourtList,
              ...obj
            }
          } else {
            delete this.medAndCourtList[item.id]
            this.nowMedId = null
          }
          if (node && this.medCourtList.length > 1) { // 解纷员有多个机构时才需要弹出模态框选择
            this.courtVisible = true
          }
        }
      })
    },
    // 显示模态框
    show() {
      this.modalVisible = true
    },
    // 取消
    cancel() {
      this.modalVisible = false
    },
    // 搜索
    search() {
      if (this.selectMenuIndex === 0) {
        this.getTreeForTeam()
      } else if (this.selectMenuIndex === 1) {
        this.getorgData()
      } else if (this.selectMenuIndex === 2) {
        this.getMediatorData()
        // this.$refs.tree2.filter(this.secVal)
      }
    },
    // 提交
    submit() {
      console.log(this.selectListData)
      if (!this.selectListData || this.selectListData.length == 0) {
        this.$message.error('请选择协同单位')
        return
      }
      console.log(this.selectListData)
      this.$store.commit('SET_SELECTUNITLIST', this.selectListData)
      this.$emit('done')
      this.modalVisible = false
    },
    // 选择菜单
    selectMenu(index) {
      this.selectMenuIndex = index
    },
    // 选择主要办案员和案件协助员
    selectType(index, num) {
      this.selectListData.forEach(item => {
        item.type = 2
      })
      this.selectListData[index].type = num
    },
    // 点击节点触发
    getNode({ name, id, selfCourtId }) {
    },
    // 选择协同单位
    getSelectData(node) {
      const tree = this.$refs.tree.getCheckedNodes().map(item => {
        return {
          id: item.id,
          name: item.name,
          type: 2,
          court: true
        }
      })
      const tree1 = this.$refs.tree1.getCheckedNodes().map(item => {
        return {
          id: item.id,
          name: item.name,
          type: 2,
          court: true
        }
      })
      const tree2 = this.$refs.tree2.getCheckedNodes().map(item => {
        return {
          id: item.id,
          name: item.name,
          type: 2,
          court: false
        }
      })
      // this.selectListData = [...tree, ... tree1, ...tree2]
      const trees = [...tree, ... tree1, ...tree2]
      if (!trees || trees.length == 0) {
        this.$message.error('请先选择协同单位')
        return
      }
      if (this.selectListData && this.selectListData.length > 0) {
        var hash = {}
        const newAry = [...this.selectListData, ...trees].reduce(function(item, next) {
          hash[next.id] ? '' : hash[next.id] = true && item.push(next)
          return item
        }, [])
        console.log(newAry)
        this.selectListData = [...newAry]
      } else {
        this.selectListData = trees
      }
      if (this.medAndCourtList) { // 假如 选了调解员冲调解员和机构的关系中拿到该调解员父级的数据
        this.selectListData = this.selectListData.map(item => {
          return {
            ...item,
            parent: this.medAndCourtList[item.id]
          }
        })
      }
      console.log(this.selectListData)
    },
    // 移除
    removeSelectData() {
      console.log(this.selectListData)
      this.selectListData = [...this.selectListData].filter(item => {
        return this.checkList.findIndex(v => v == item.id) == -1
      })
      const selectId = this.selectListData.map(item => item.id)
      this.$refs.tree.setCheckedKeys(selectId)
      this.$refs.tree1.setCheckedKeys(selectId)
      this.$refs.tree2.setCheckedKeys(selectId)
    },
    // 获取协同员
    getMediatorData() {
      const params = {
        pageSize: 1000,
        type: 20,
        name: this.secVal
      }
      getCourtInfoByType(params).then((res) => {
        if (res.state === 100) {
          this.mediatorData = res.data.content.map((item) => {
            // if (item.id == this.getUserInfo.mediaterId) {
            //   return
            // }
            const obj = {
              name: item.name,
              cId: item.cId,
              id: item.id
            }
            return obj
          }).filter(item => {
            return item.id != this.getUserInfo.mediaterId
          })
        }
      })
    },
    // 协同组织获取数据
    getorgData() {
      const params = {
        pageSize: 1000,
        type: 2,
        courtName: this.secVal
      }
      // 找一级
      getCourtInfoByType(params).then((res) => {
        if (res.state === 100) {
          this.orgData = res.data.map((item) => {
            // if (item.id == this.getUserInfo.courtUid) {
            //   return
            // }
            const obj = {
              name: item.name,
              cId: item.cId,
              id: item.id,
              selfCourtId: item.selfCourtId
            }
            return obj
          }).filter(item => {
            if (this.getUserInfo.roleType == 2) { // 假如是调解员则不剔除机构id
              return true
            } else {
              return item.id != this.getUserInfo.courtUid
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  .wrapper-left,.wrapper-right {
    width: calc((100% - 84px)/2);
    height: 500px;
    border: 1px solid rgba(218,219,230,1);
  }
  .search-wrapper1 {
    display: flex;
    position: relative;
    padding: 10px 10px;
    border-bottom: 1px solid #dadbe6;
    input {
      border: none;
      outline: none;
      line-height: 40px;
      font-size: 14px;
      width: 100%;
      padding: 0px 60px 0px 30px;
    }
    .el-icon-search {
      position: absolute;
      display: inline-flex;
      width: 30px;
      height: 40px;
      justify-content: center;
      align-items: center;
    }
    .search-btn {
      display: inline-block;
      position: absolute;
      right: 10px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background-color: #0097fe;
      padding: 0px 10px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .menu-wrapper {
    line-height: 60px;
    padding: 0px 10px;
    border-bottom: 1px solid rgba(218,219,230,1);
    ul {
      display: flex;
      li {
        margin-right: 15px;
        font-size: 15px;
        font-weight: bold;
        color: #000;
        cursor: pointer;
        &.active {
          color: #007aff;
          border-bottom: 3px solid #007aff;
        }
      }
    }
  }
  .content {
    height: calc(100% - 140px);
    overflow: auto;
  }
  .wrapper-btn {
    width: 80px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .btn-item {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,151,254,1);
      margin-bottom: 10px;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      i {
        font-size: 20px;
      }
      &:last-child {
        background-color: #F5F5F5;
        color: #C6C6C6;
        border: 1px solid #C6C6C6;
      }
    }
  }
  .wrapper-right {
    padding: 20px;
    overflow: auto;
    .my-check {
      margin-bottom: 10px;
      ::v-deep.el-checkbox__inner {
        top: -39px;
      }
      .name {
        font-size: 16px;
        line-height: 25px;
        margin-bottom: 10px;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ul {
        display: flex;
        border: 1px solid rgba(0,151,254,0.5);
        height: 35px;
        border-radius: 5px;
        li {
          width: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgba(0,151,254,1);
          &.active {
            background-color: rgba(0,151,254,0.1);
          }
        }
      }
    }
  }
  ::v-deep.el-tree-node__content {
    color: #000;
    line-height: 30px;
    height: 30px;
    font-size: 15px;
    .el-tree-node__label {
      font-size: 16px;
    }
  }
}
</style>
