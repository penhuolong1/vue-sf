// ///////////////////////////////////////////////////////////////////////
var uMaxID = 64
var uPlayFileID = new Array(64)
var uRecordID = new Array(64)
var uCCSessID = -1
var vConfID = 0
var g_interval = 0// 定时器全局变量
var g_msg = false
var isFirefox = !!navigator.userAgent.toUpperCase().indexOf('FIREFOX')
var isIE = !!navigator.userAgent.toUpperCase().indexOf('MSIE')
var isChrome = !!navigator.userAgent.toUpperCase().indexOf('CHROME')
var saveFileSrc = 'd'
var recordTime = {}

// //////////////////////////////////////////////////////////////////////
//
// js脚本调用在IE10以上需要IE10兼容模式如例子html否则js脚本会失效，
// 当然开发者可以重新构造IE10调用activex的js脚本。
//
function T_WaitForWin (vWin) {
  var vTimeout = 5000
  var vBegintime = new Date()
  var vEndtime = new Date()
  while (vWin.vInit != 1 && vEndtime.getTime() - vBegintime.getTime() < (vTimeout * 2))// ns超时
  {
    if (vEndtime.getTime() - vBegintime.getTime() > vTimeout)// 1s还没有完成，使用等待方式
    {
      Sleep(100)// 等待100ms
    }
    vEndtime = new Date()
  }
}

function I_CheckActiveX () {
  var iVer = 1// 第一个版本
  check_ver(iVer, function (nRet) {
    var szHint = ''
    switch (nRet) {
      case W_OK:// 检查成功
        szHint = '安装成功'
        break
      case W_TRY:// 试用
        szHint = '试用版本已安装成功'
        break
      case W_NO_FOUND:// 没有找到校验服务器
        szHint = '没有找到校验服务器'
        break
      case W_EXCEED_NUM:
        szHint = '校验服务器超过用户数了'
        break
      default:
        szHint = '没有安装本地驱动，请下载'
        break
    }
    AppendStatus(szHint)
    alert(szHint)
  })
}

function TV_Initialize () {
// 检测是否安装中间件
  // var qnv = document.getElementById('qnviccub');
  //	qnv.attachEvent("OnQnvEvent", T_GetEvent);
  DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (nResult) {
    if (nResult <= 0) {
      OpenDevice(0, function (nResult) {
        DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (channels) {
          if (channels > 0) { // 初始化变量
            for (i = 0; i < uMaxID; i = i + 1) {
              uPlayFileID[i] = -1
              uRecordID[i] = -1
            }
            for (j = 0; j < channels; j++) {
              // SetParam(j,QNV_PARAM_DTMFVOL,5);
              SetParam(j, QNV_PARAM_AM_LINEIN, 5, null)// 把输入能量增益调为5
            }
            DevInfo(0, QNV_DEVINFO_GETSERIAL, function (sn) {
              DevInfo(0, QNV_DEVINFO_GETTYPE, function (type) {
                DevInfo(0, QNV_DEVINFO_FILEVERSION, function (ver) {
                  AppendStatus('打开设备成功 通道数:' + channels + ' 序列号:' + sn + ' 设备类型:' + type + ' ver:' + ver)
                })
              })
            })
          } else {
            AppendStatus('打开设备失败,请检查设备是否已经插入并安装了驱动,并且没有其它程序已经打开设备')
          }
        })
      })// OpenDevice
    }// if(nResult <= 0)
    else {
      AppendStatus('设备已经被打开，不需要重复打开')
    }
  })
}

// 配置设备参数函数
// nChannel通道号
// paramName//参数名
// nValue参数值
function TV_SetParam (nChannel, paramName, nValue, nextFunc) {
  if (nChannel >= 0) {
    SetParam(nChannel, paramName, nValue, nextFunc)// 设置参数
  }
}
// 控制设备参数函数
// nChannel通道号
// paramName//参数名
// nValue参数值
function TV_SetDevCtrl (nChannel, paramName, nValue, nextFunc) {
  return SetDevCtrl(nChannel, paramName, nValue, nextFunc)
}
function TV_StopConference (nextFunc) {
  if (vConfID > 0) {
    Conference(-1, vConfID, QNV_CONFERENCE_DELETECONF, 0, 0, function (nResult) {
      nextFunc(nResult)
      vConfID = 0
      AppendStatus('会议停止')
    })// 删除会议
  }
}
function TV_StartConference () {
  OpenDevice(ODT_SOUND, 0, 0, function (nResult) {
    if (nResult <= 0) {
      AppendStatus('打开声卡模块失败')
    } else {
      TV_StopConference(function (nResult) {
        Conference(-1, 0, QNV_CONFERENCE_CREATE, 0, '', function (vConfID) {
          if (vConfID <= 0) { AppendStatus('创建会议失败') } else {
            Conference(SOUND_CHANNELID, vConfID, QNV_CONFERENCE_ADDTOCONF, 0, '', function (vRet) {
              AppendStatus('加入会议完成,Ret=' + vRet)
              DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (chammels) {
                for (i = 0; i < chammels; i = i + 1) {
                  Conference(i, vConfID, QNV_CONFERENCE_ADDTOCONF, 0, '', function (nRet) {
                    AppendStatus('加入会议完成,Ret=' + nRet)
                  })
                }
                AppendStatus('会议创建完成,会议ID=' + vConfID)
              })
            })// Conference(SOUND_CHANNELID
          }
        })// Conference-1
      })// TV_StopConference
    }
  })
}

function TV_InitCCModule () {
  OpenDevice(ODT_CC, 0, QNV_CC_LICENSE, function (nResult) {
    if (nResult > 0) {
      AppendStatus('加载CC网络模块成功')
    } else { AppendStatus('加载CC网络模块失败') }
  })
}
function TV_Disable () {
  g_msg = true
  CloseDevice(ODT_ALL, function (nResult) {
    AppendStatus('关闭设备完成.')
  })// 关闭所有设备
}

// ---------------------------------------
// function TV_EnableHook (uID, bEnable) {
//   TV_SetDevCtrl(uID, QNV_CTRL_DOHOOK, bEnable, function (nResult) {
//     AppendStatusEx(uID, bEnable ? '软摘机' : '软挂机')
//   })
// }
// ---------------------------------------
// 开始拨号：
function TV_EnableHook (uID, bEnable, phoneNum) {
  // AppendStatusEx(uID, bEnable ? "软摘机" : "软挂机2" +phoneNum);
  TV_SetDevCtrl(uID, QNV_CTRL_DOHOOK, bEnable, function (nResult) {
    AppendStatusEx(uID, bEnable ? '软摘机' : '软挂机' + phoneNum)
    if (bEnable == TRUE) {	// 摘机
      var numss = phoneNum
      AppendStatusEx(uID, '1秒后开始录音')
      window.setTimeout(function () {
        TV_StartRecordFile(uID, numss)// 开启录音
      }, 1000)
    } else if (bEnable == FALSE) {	// 挂机
      AppendStatusEx(uID, '1秒后停止录音')
      var nums = phoneNum
      window.setTimeout(function () {
        TV_StopRecordFile(uID, nums)// 停止录音
      }, 1000)
    }
  })
}

function TV_OffHookCtrl (uID) {
  TV_EnableHook(uID, TRUE)
}

function TV_HangUpCtrl (uID) {
  var callphone = $('#dialcode').val()
  TV_EnableHook(uID, FALSE, callphone)
}
// ----------------------------------------
function TV_EnableMic2Line (uID, bEnable) {
  // SetDevCtrl(uID,QNV_CTRL_DOMICTOLINE,bEnable);
  TV_SetDevCtrl(uID, QNV_CTRL_DOMICTOLINE, bEnable)
}
function TV_EnableMic (uID, bEnable) {
  TV_EnableMic2Line(uID, bEnable)
}
// ----------------------------------------
function TV_EnableDoPhone (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPHONE, bEnable)
}
function TV_EnableRing (uID, bEnable) {
  TV_EnableDoPhone(uID, bEnable)
}
function TV_StartRing (uID, bEnable) {
  if (bEnable) { General(uID, QNV_GENERAL_STARTRING, 0, '1234', null) } else { General(uID, QNV_GENERAL_STOPRING, 0, '', null) }
}
// --------------------------------------

function TV_EnableDoPlay (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAY, bEnable, null)
}
function TV_OpenDoPlay (uID) {
  TV_EnableDoPlay(uID, TRUE)
}
function TV_CloseDoPlay (uID) {
  TV_EnableDoPlay(uID, FALSE)
}
// ----------------------------------------------
// 线路声音到耳机，用耳机通话时
function TV_EnableLine2Spk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOLINETOSPK, bEnable, null)
}
// 播放的语音到耳机
function TV_EnableMicSpk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAYTOSPK, bEnable)
}
// ----------------------------------------------

function TV_EnablePlay2Spk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAYTOSPK, bEnable)
}

function TV_EnableRingPower (uID, bEnable) {
  GetDevCtrl(uID, QNV_CTRL_DOPHONE, function (nRet) {
    if (nRet && bEnable) {
      alert('请先断开电话机')
    } else {
      SetDevCtrl(uID, QNV_CTRL_RINGPOWER, bEnable, null)
    }
  })
}

function TV_RefuseCallIn (uID) {
  GetDevCtrl(uID, QNV_CTRL_RINGTIMES, function (nRet) {
    if (nRet <= 0) {
      alert('没有来电,无效的拒接')
    } else {
      General(uID, QNV_GENERAL_STARTREFUSE, 0, 0, null)
    }
  })
}
function TV_StartFlash (uID) {
  GetDevCtrl(uID, QNV_CTRL_DOHOOK, function (nCon) {
    GetDevCtrl(uID, QNV_CTRL_PHONE, function (nRet) {
      if (nCon <= 0 && nRet <= 0) {
        alert('没有摘机状态，无效的拍插簧')
      } else {
        General(uID, QNV_GENERAL_STARTFLASH, FT_ALL, '', function (nRetCall) {
          if (nRetCall <= 0) {
            alert('拍插簧失败')
          }
        })
      }
    })
  })
}

function TV_EnablePhoneRing (uID, bEnable) {
  if (bEnable) {
    GetDevCtrl(uID, QNV_CTRL_DOPHONE, function (nRet) {
      if (nRet) {
        alert('请先断开电话机')
      } else {
        var szCallID = '1234567890'
        SetParam(uID, QNV_PARAM_RINGCALLIDTYPE, DIALTYPE_FSK, function (n) {
          General(uID, QNV_GENERAL_STARTRING, 0, szCallID, function (k) {
            AppendStatusEx(uID, '开始内线模拟间隔震铃 -> 模拟来电号码：' + szCallID)
          })
        })// 设置送码方式为一声后FSK模式,默认为一声前dtmf模式//DIALTYPE_DTMF
      }
    })
  } else {
    General(uID, QNV_GENERAL_STOPRING, 0, 0, function (h) {
      AppendStatusEx(uID, '停止内线震铃')
    })
  }
}

function TV_StartPlayFile (uID, szFile) {
  vFilePath = 'c:\\test.wav'
  alert('播放文件路径为:' + vFilePath)
  if (vFilePath.length > 0) {
    //    AppendStatus("选择文件:"+vFilePath);
	 //   TV_StopPlayFile(uID);//先停止上次播放的句柄
    var vmask = PLAYFILE_MASK_REPEAT// 循环播放
    PlayFile(uID, QNV_PLAY_FILE_START, 0, vmask, vFilePath, function (id) {
      uPlayFileID[uID] = id
      if (id <= 0) {
        AppendStatusEx(uID, '播放失败:' + vFilePath)
      } else {
        AppendStatusEx(uID, '开始播放文件:' + vFilePath)
      }
    })
  } else {
    AppendStatus('没有选择文件')
  }
}

function TV_StopPlayFile (uID) {
  if (uPlayFileID[uID] > 0) {
    PlayFile(uID, QNV_PLAY_FILE_STOP, uPlayFileID[uID], 0, 0, function (nRet) {
      AppendStatusEx(uID, '停止播放')
      uPlayFileID[uID] = 0
    })
  } else {
    AppendStatusEx(uID, '未播放的句柄')
    uPlayFileID[uID] = 0
  }
}
function TV_StopPlayFileEx (uID, nextFunc) {
  if (uPlayFileID[uID] > 0) {
    PlayFile(uID, QNV_PLAY_FILE_STOP, uPlayFileID[uID], 0, 0, function (nRet) {
      uPlayFileID[uID] = 0
      nextFunc()
      AppendStatusEx(uID, '停止播放')
    })
  } else {
    uPlayFileID[uID] = 0
    nextFunc()
    AppendStatusEx(uID, '未播放的句柄')
  }
}
// 录音功能
function TV_StartRecordFile (uID, phoneNum) {
  var dates = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '').replace('-', '').replace('-', '').replace(':', '').replace(':', '')	// 当前时间
  var stry = localStorage.getItem('phoneNums') + '-' + dates + '.wav'// localStorage.getItem("caseNo") + "-"+
  localStorage.setItem('recordName', stry)
  vFilePath = `${saveFileSrc}:\\phoneRecord` + '\\' + stry// 文件路径
  AppendStatus('录音文件路径为:' + vFilePath)
  console.log('开始录音拉')
  // vFilePath ="E:\\test.wav";  //有些操作系统c盘保护，保存到c盘可能会失败，可以换到其它盘符

  if (vFilePath.length > 0) {
    TV_StopPlayFileEx(uID, function () {
      var vFormatID = BRI_WAV_FORMAT_PCM8K16B// 选择使用8K16bit采样
      var vmask = RECORD_MASK_ECHO | RECORD_MASK_AGC// 使用回音抵消后并且自动增益的
      // console.log('录音文件路径为:' + vFilePath)
      RecordFile(uID, QNV_RECORD_FILE_START, vFormatID, vmask, vFilePath, function (hRec) {
        // console.log('录音返回:' + hRec)
        uRecordID[uID] = hRec
        if (uRecordID[uID] <= 0) {
          AppendStatusEx(uID, '录音失败:' + vFilePath)
        } else {
          AppendStatusEx(uID, '开始录音文件: id=' + uRecordID[uID] + '  ' + vFilePath)
        }
      })
    })
  } else {
    AppendStatus('没有选择文件')
  }
}

// function TV_StopRecordFile (uID) {
//   if (uRecordID[uID] > 0) {
//     // var vRecPath=GetRecFilePath(uID,uRecordID[uID]);
//     RecordFile(uID, QNV_RECORD_FILE_PATH, uRecordID[uID], 0, 0, function (vRecPath) {
//       RecordFile(uID, QNV_RECORD_FILE_ELAPSE, uRecordID[uID], 0, 0, function (vElapse) {
//         RecordFile(uID, QNV_RECORD_FILE_STOP, uRecordID[uID], 0, 0, function (nRet) {
//           AppendStatusEx(uID, '停止录音:' + vRecPath + '  录音时间:' + vElapse)
//           uRecordID[uID] = 0
//         })
//       })
//     })
//   }
// }
// 停止录音
function TV_StopRecordFile (uID, phoneNum) {
  if (uRecordID[uID] > 0) {
    // var vRecPath=GetRecFilePath(uID,uRecordID[uID]);
    RecordFile(uID, QNV_RECORD_FILE_PATH, uRecordID[uID], 0, 0, function (vRecPath) {
      RecordFile(uID, QNV_RECORD_FILE_ELAPSE, uRecordID[uID], 0, 0, function (vElapse) {
        RecordFile(uID, QNV_RECORD_FILE_STOP, uRecordID[uID], 0, 0, function (nRet) {
          localStorage.setItem('endTime', formatDate(new Date()))
          AppendStatusEx(uID, '停止录音:' + vRecPath + '  录音时间:' + vElapse + '【1秒后开始上传文件】')
          uRecordID[uID] = 0
          window.setTimeout(function () {
            const stamps = localStorage.getItem('phoneNums') + new Date().getTime()
            const litigantId = localStorage.getItem('litigantId')
            localStorage.setItem('codes', stamps)
            // TV_uploadFile('http://192.168.86.60:9003/api/file/upload?username=w&type=1')
            if (location.host === 'localhost:8083') {
              TV_uploadFile('http://sftest.olcourt.cn/api/main/uploadCallWav.jhtml?code=' + stamps + '&litigantId=' + litigantId, phoneNum)
            } else {
              TV_uploadFile('http://' + location.host + '/api/main/uploadCallWav.jhtml?code=' + stamps + '&litigantId=' + litigantId, phoneNum)
            }
            AppendStatusEx(uID, '【开始存储】:' + vRecPath + '  code:' + stamps)
            localStorage.setItem('uprecorder', 'ing')
          }, 1000)
        })
      })
    })
  }
}

function TV_DeleteRecordFile (uID) {
  CallLog(uID, QNV_CALLLOG_DELRECFILE, '', 0, function (vRet) {
    if (vRet <= 0) {
      alert('删除失败:' + vRet)
    } else { alert('删除完成') }
  })
}

// function TV_StartDial (uID, szCode) { // 正常拨号必须使用 DIALTYPE_DTMF
//   General(uID, QNV_GENERAL_STARTDIAL, DIALTYPE_DTMF, szCode, function (nRet) {
//     if (nRet <= 0) {
//       AppendStatusEx(uID, '拨号失败:' + szCode)
//     } else {
//       AppendStatusEx(uID, '开始拨号:' + szCode)
//     }
//   })
// }
function TV_StartDial (uID, szCode) { // 正常拨号必须使用 DIALTYPE_DTMF
  localStorage.setItem('phoneNums', $('#dialcode').val())
  localStorage.setItem('litigantId', $('#litigantId').val())
  console.log(formatDate(new Date()))
  localStorage.setItem('startTime', formatDate(new Date()))
  console.log(uID, szCode)
  // AppendStatusEx(uID, '拨号失败:' + szCode)
  General(uID, QNV_GENERAL_STARTDIAL, DIALTYPE_DTMF, szCode, function (nRet) {
    if (nRet <= 0) {
      AppendStatusEx(uID, '拨号失败:' + szCode)// 提示拨号失败
    } else {
      AppendStatusEx(uID, '开始拨号:' + szCode + '【1秒后开始摘机】')
      window.setTimeout(function () {
        TV_EnableHook(uID, TRUE, szCode)
      }, 1000)
    }
  })
}

function TV_GetDiskList () {
  Tool(QNV_TOOL_DISKLIST, 0, 0, 0, function (vDiskList) {
    AppendStatus('按逗号分隔的盘符列表:' + vDiskList)
  })
}
function TV_GetFreeSpace (szDiskname) {
  Tool(QNV_TOOL_DISKFREESPACE, 0, szDiskname, 0, function (vFreeSpace) {
    AppendStatus(szDiskname + ' 空闲大小为:' + vFreeSpace + '(M)')
  })
}
function TV_GetTotalSpace (szDiskname) {
  Tool(QNV_TOOL_DISKTOTALSPACE, 0, szDiskname, 0, function (vTotalSpace) {
    AppendStatus(szDiskname + ' 总共大小为:' + vTotalSpace + '(M)')
  })
}
function TV_BrowerPath () {
  Tool(QNV_TOOL_SELECTDIRECTORY, 0, '选择目录', 0, function (vPath) {
    AppendStatus('选择目录:' + vPath)
  })
}
function TV_SelectFile () {
  Tool(QNV_TOOL_SELECTFILE, 0, 'wav files|*.wav|all files|*.*||', 0, function (vFilePath) {
    AppendStatus('选择文件:' + vFilePath)
  })
}

// 上传文件
function TV_uploadFile (uploadUrl, phoneNum) {
  // 上传文件
  // vFilePath = "e:\\test.wav";
  var stry = localStorage.getItem('recordName')
  // vFilePath = "e:\\phoneRecord\\" + stry;
  vFilePath = `${saveFileSrc}:\\phoneRecord` + '\\' + stry
  // vFilePath = "d:\\phoneRecord\\" + stry;
  // vFilePath = "e:\\test.mp3";
  // vFilePath = 'd:\\phoneRecord\\918650175610-20201230105421.wav'
  AppendStatus('上传文件路径为:' + vFilePath)
  Remote(QNV_REMOTE_UPLOAD_START, 0, uploadUrl, vFilePath, 0, 0, function (nRet) {
    // nRet <=0表示失败
    console.log(nRet)
    console.log(uploadUrl, vFilePath)
    if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else {
      AppendStatus('上传文件:' + vFilePath + '成功 ' + 'code:' + localStorage.getItem('codes') + '请保存本次通话记录')
      localStorage.setItem('uprecorder', 'ok')
      // CHECK_uploadFile(phoneNum)
    }
  })
}
// function TV_uploadFile (uploadUrl, vFilePath) {
//   // 上传文件
//   console.log('上传路径' + vFilePath)
//   setTimeout(() => {
//     Remote(QNV_REMOTE_UPLOAD_START, 0, uploadUrl, vFilePath, 0, 0, function (nRet) {
//       // nRet <=0表示失败wenj
//       if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else { AppendStatus('上传文件:' + vFilePath + '成功') }
//     })
//   }, 1000)
// }
/**
 * 检测上传成功与否
 */
function CHECK_uploadFile (phoneNum) {
  // var litigantId = localStorage.getItem('litigantId')
  // var answer = 1
  // var callLogId = localStorage.getItem('codes')
  var answerPhone = $('#dialcode').val()
  console.log(phoneNum)
  $.ajax({
    type: 'post',
    // url: "http://court2.ptnetwork001.com/sq/sqmobile/telephoneRecord.jhtml",
    url: '/api/mediate/file/saveCallWav.jhtml?',
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify({
      // "lawCaseId":localStorage.getItem("lawcaseId"),
      // litigantId:localStorage.getItem("litigantId"),
      // lawCaseId:window.location.href.split('lawCaseId=')[1],
      // litigantId:(window.location.href.split('litigantId=')[1]).split('&&')[0],
      // dialPhone:"",
      // answerPhone:localStorage.getItem("phoneNums"),
      // startTime:"",
      // endTime:"",
      // isAnswer:1,
      // systemId:localStorage.getItem("systemId"),
      // noAnswerReason:"",
      litigantId: localStorage.getItem('litigantId'),
      answer: '1',
      code: localStorage.getItem('codes'),
      answerPhone: answerPhone,
      startTime: localStorage.getItem('startTime'),
      endTime: localStorage.getItem('endTime')
      // code:"135995082581568107711258"
    }),
    // timeout:1000,
    success: function (data) {
      // let msg = JSON.parse(data);
      // if(msg.state == 100){
      // 	AppendStatus("【录音文件校验成功】");
      // }else{
      // 	AppendStatus("【"+msg.message+"】");
      // 	// AppendStatus("【上传成功！】");
      // }
      console.log(data)
      AppendStatus('【' + data.message + '】')
    },
    error: function (err) {
      console.log(err)
    }
  })
}

function formatDate (time, formatStr) {
  if (!time) {
    return
  }
  const date = new Date(time)
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
  let h = date.getHours()
  h = h < 10 ? `0${h}` : h
  let m = date.getMinutes()
  m = m < 10 ? `0${m}` : m
  let s = date.getSeconds()
  s = s < 10 ? `0${s}` : s
  formatStr = formatStr || 'YYYY-MM-DD H:m:s'
  return formatStr.replace(/YYYY|MM|DD|H|m|s/ig, function (matches) {
    return ({
      YYYY: Y,
      MM: M,
      DD: D,
      H: h,
      m: m,
      s: s
    })[matches]
  })
}

/* 阿里云的URL
可以参照阿里云上传例子把其中的参数签名加密生成如下URL
http://post-test.oss-cn-hangzhou.aliyuncs.com/?name=message.wav&key=${filename}&policy=eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZ
*/
function ali_uploadFile (uploadUrl) {
  vFilePath = 'c:\\test.wav'
  alert('上传文件路径为:' + vFilePath)
  // 上传文件
  UploadFile(uploadUrl, vFilePath, function (nRet) {
    // nRet <=0表示失败
    if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else { AppendStatus('上传文件:' + vFilePath + '成功') }
  })
}
/*
//登陆CC
function TV_LoginCC(cc,pwd)
{
	if(CCCtrl(QNV_CCCTRL_ISLOGON,NULL,0) > 0)
         alert('已经登陆,请先离线');
	else
	{
		var v=cc+','+pwd;
		var vret=CCCtrl(QNV_CCCTRL_LOGIN,v,0);
		if(vret <= 0)//开始登陆
             alert('登陆CC失败:'+vret);
		else
			AppendStatus("开始登陆CC:"+cc);
	}
}
//CC离线
function TV_LogoutCC()
{
	CCCtrl(QNV_CCCTRL_LOGOUT,NULL,0);//离线
	AppendStatus("已离线");
}

function T_GetMsgValue(vmsg,vkey)
{
	var strs = vmsg.split("\r\n");
	for(var i = 0; i < strs.length; i++)
  	{
  		var vline=strs[i];
    		var vindex=vline.indexOf(vkey);
		if(vindex != -1)
		{
			return vline.slice(vkey.length+1);
		}
  	}
  	return "";
}
*/
