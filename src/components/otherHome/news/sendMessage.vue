<template>
  <div class="message-box">
    <el-row class="header">
      <el-input v-model="form.title" style="width: 500px;" placeholder="公告标题" />
    </el-row>
    <!-- <el-row class="header">
      <el-date-picker
        v-model="form.sendDate"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间"
        default-time="14:00:00"
        style="width: 500px;"
      />
    </el-row> -->
    <el-row class="header">
      <el-button style="margin-right:20px" @click="showCourtInfo">请选择机构</el-button>
      <el-tag v-if="form.courtInfo.length>0">已选</el-tag>
      <el-tag v-if="form.courtInfo.length==0" type="danger">未选(默认发送对象为本单位)</el-tag>
    </el-row>
    <el-row class="header" style="height: 350px;">
      <div id="wangeditor">
        <div ref="editorElem" style="text-align:left;" />
      </div>
    </el-row>
    <el-row class="header" style="margin-top: 10px;">
      <el-button type="success" size="mini" :loading="isLoading" @click="send">发送</el-button>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
      <el-button type="primary" size="mini" @click="upFile">上传文件</el-button>
      <input ref="uploadFile" type="file" style="display:none" @change="fileChange">
      <div v-for="(item,index) in form.files" :key="index">
        <span>{{ item.fileName }}</span><i style="margin-left:10px" class="el-icon-error" @click="delFile(index)" />
      </div>
    </el-row>
    <el-dialog
      title="请选择机构"
      :visible.sync="videoVisible"
      width="750px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div style="width:100%;height: 400px; overflow-y: auto;">
        <div class="btnBox">
          <el-button size="small" @click="CheckedAll">全 选</el-button>
          <el-button size="small" @click="CheckedNo">取消全选</el-button>
          <el-button size="small" @click="CheckedFalse">全选本单位</el-button>
          <el-button size="small" @click="CheckedTrue">全选本单位及下属机构</el-button>
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="courtId"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.label }}</span>
            <span>
              <el-radio v-model="data.child" label="false">本单位</el-radio>
              <el-radio v-model="data.child" label="true">本单位及下属机构</el-radio>
            </span>
          </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAffiche } from '@/api/otherHome/otherHome'
import { listCourtByCourId } from '@/api/team/team'
import { mapGetters } from 'vuex'
import { affiche_uploadFile } from '@/api/news/news'
import { limitFileSize } from '@/utils/tools.js'
import E from 'wangeditor'
export default {
  name: 'SendMessage',
  components: {

  },
  props: {
    getCount: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      videoVisible: false,
      isLoading: false,
      form: {
        title: '',
        content: '',
        courtInfo: [],
        files: [] // 上传文件数组
      },
      nowTreeData: [], // 机构选择临时改变存储
      editor: null,
      treeData: [{
        id: 1,
        label: '一级 1',
        child: false
      }, {
        id: 2,
        label: '一级 2',
        child: false
      }, {
        id: 3,
        label: '一级 3',
        child: false
      }]
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    this.getCount()
    this.editor = new E(this.$refs.editorElem)
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.form.content = html
    }
    this.editor.customConfig.menus = [
      // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.create() // 创建富文本实例
    this.listCourtByCourId()
  },
  methods: {
    getRadio() {},
    back() {
      this.$emit('backList')
    },
    send() {
      this.isLoading = true
      this.form.afficheType = 1 // 1公告、2系统消息
      addAffiche(this.form).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          this.form = {
            title: '',
            content: '',
            files: [],
            courtInfo: []
          }
          this.$emit('backList')
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    upFile() {
      this.$refs.uploadFile.dispatchEvent(new MouseEvent('click'))
    },
    // 上传文件
    fileChange(event) {
      const loading = this.$loading({
        lock: true,
        text: '文件上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (event.target.files.length < 1) return
      const fileList = Object.values(event.target.files)
      if (limitFileSize(fileList[0])) { // 限制文件大小不能超过20M|文件名不可包含特殊字符
        loading.close()
        return
      }
      const last = fileList[0].name.substring(fileList[0].name.lastIndexOf('.') + 1)
      const fileArr = ['doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'pdf', 'PDF', 'txt']
      if (fileArr.indexOf(last) == -1) {
        this.$message.error('请上传pdf/doc/docx/xls/xlsx/text格式文件!')
        loading.close()
        return
      }
      const formData = new FormData()
      formData.append('file', fileList[0])
      affiche_uploadFile(formData).then(res => {
        loading.close()
        if (res.state == 100) {
          this.$message.success(res.message)
          this.form.fileUrl = res.url
          this.form.fileName = res.name
          const obj = {
            fileUrl: res.url,
            fileName: res.name
          }
          this.form.files.push(obj)
        }
      })
    },
    // 删除上传文件
    delFile(index) {
      this.form.files.splice(index, 1)
    },
    // 获取备选机构
    listCourtByCourId() {
      const params = {
        courtId: this.getUserInfo.courtId,
        type: 2,
        pageSize: 1000,
        dept: 1,
        courtType: '0,1,2'
      }
      listCourtByCourId(params).then(res => {
        if (res.state == 100) {
          this.treeData = res.content.map(item => {
            const obj = {
              courtId: item.id,
              label: item.name,
              child: 'false'
            }
            return obj
          })
        }
      })
    },
    showCourtInfo() {
      this.nowTreeData = JSON.parse(JSON.stringify(this.treeData))
      this.videoVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.form.courtInfo)
      })
    },
    // 关闭机构弹窗
    close(done) {
      this.treeData = JSON.parse(JSON.stringify(this.nowTreeData))
      done()
    },
    // 点击取消关闭机构弹窗
    cancel() {
      this.treeData = JSON.parse(JSON.stringify(this.nowTreeData))
      this.videoVisible = false
    },
    // 确认选择的机构
    getCheckedNodes() {
      this.form.courtInfo = this.$refs.tree.getCheckedNodes()
      this.videoVisible = false
    },
    // 机构全选
    CheckedAll() {
      this.$refs.tree.setCheckedNodes(this.treeData)
    },
    // 取消机构全选
    CheckedNo() {
      this.$refs.tree.setCheckedNodes([])
    },
    // 全选本单位
    CheckedFalse() {
      this.radioCheckedChange('false')
    },
    // 全选本单位及下属机构
    CheckedTrue() {
      this.radioCheckedChange('true')
    },
    //  全选本单位/全选本单位及下属机构勾选取反
    radioCheckedChange(state) {
      const CheckedKeys = this.$refs.tree.getCheckedKeys()
      this.treeData = this.treeData.map(item => {
        item.child = state
        return item
      })
      this.$refs.tree.setCheckedKeys(CheckedKeys)
    }

  }
}
</script>

<style scoped lang = "scss">
  .message-box {
    padding: 25px;
    .header {
      height: 50px;
      line-height: 50px;
    }
  }
   .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .btnBox{
    margin-bottom: 20px;
  }
</style>
