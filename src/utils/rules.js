import { validIDCard, validPhone } from './validate'
const checkNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入纠纷金额'))
  } else if (isNaN(value)) {
    return callback(new Error('请输入正确的金额'))
  } else {
    callback()
  }
}
const checkType = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择申请类型'))
  } else {
    callback()
  }
}
const checkIdCard = (rule, value, callback) => {
  if (!validIDCard(value)) {
    return callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}
const checkPhone = (rule, value, callback) => {
  if (!validPhone(value)) {
    return callback(new Error('请输入正确的号码'))
  } else {
    callback()
  }
}
const rules = {
  data() {
    return {
      rules: {
        identityType: [
          { required: true, message: '请选择类型', trigger: ['change', 'blur'] }
        ],
        name: [
          { required: true, message: '请输入姓名或单位名称', trigger: ['change', 'blur'] }
        ],
        litigantPhone: [
          { required: true, message: '请输入手机号码', trigger: ['change', 'blur'] }
          // { validator: checkPhone, trigger: ['change', 'blur'] }
        ],
        // identityCard: [
        //   {
        //     required: true,
        //     message: '请输入证件号码',
        //     trigger: ['change', 'blur']
        //   },
        //   { validator: checkIdCard, trigger: ['change', 'blur'] }
        // ],
        legalManId: [
          { required: true, message: '请输入证件号', trigger: ['change', 'blur'] }
          // { validator: checkIdCard, trigger: ['change', 'blur'] }
        ],
        legalManPhone: [
          { required: true, message: '请输入手机号码', trigger: ['change', 'blur'] }
          // { validator: checkPhone, trigger: ['change', 'blur'] }
        ],
        legalManName: [
          { required: true, message: '请输入姓名', trigger: ['change', 'blur'] }
        ]
      },
      step1rules: {
        applyType: [{ validator: checkType, trigger: ['change', 'blur'] }],
        centerCourtId: [{ required: true, message: '请选择分流中心', trigger: ['change', 'blur'] }],
        briefId: [{ required: true, message: '请选择纠纷事由', trigger: ['change', 'blur'] }],
        applyStandard: [{ required: true, message: '请输入金额', trigger: ['change', 'blur'] }],
        mediateRequest: [{ required: true, message: '请输入请求事项', trigger: ['change', 'blur'] }],
        reason: [{ required: true, message: '请输入事实与理由', trigger: ['change', 'blur'] }]
      },
      stpe2rules: {
        mediateRequest: [{ required: true, message: '请输入请求事项', trigger: ['change', 'blur'] }],
        reason: [{ required: true, message: '请输入事实与理由', trigger: ['change', 'blur'] }]
      },
      lawyerRules: {
        name: [{ required: true, message: '请输入代理人姓名', trigger: ['change', 'blur'] }],
        agentType: [{ required: true, message: '请选择代理人类型', trigger: ['change', 'blur'] }],
        agentIdentiCard: [{ validator: checkIdCard, trigger: ['change', 'blur'] }],
        address: [{ required: true, message: '请填写代理人地址', trigger: ['change', 'blur'] }]
      },
      eviRules: {
        litigantId: [{ required: true, message: '请选择当事人', trigger: ['blur'] }],
        eviName: [{ required: true, message: '请输入证据名称', trigger: ['blur'] }],
        provideDate: [{ required: true, message: '请选择提供时间', trigger: ['blur'] }]
        // objectOfProof: [{ required: true, message: '请输入证据对象', trigger: ['change', 'blur'] }],
        // count: [{ required: true, message: '请输入份数', trigger: ['change', 'blur'] }],
        // source: [{ required: true, message: '请输入证据来源', trigger: ['change', 'blur'] }]
      }
    }
  }
}

export default rules
