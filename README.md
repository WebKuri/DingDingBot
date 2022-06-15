## 一、钉钉自定义机器人介绍

钉钉机器人是钉钉群的一个高级扩展功能，但使用起来却非常简单，只需要注册一个钉钉账号，就可以将第三方服务信息聚合到钉钉群中，实现信息的自动同步。

常见的使用场景：

1、聚合Github、Gitlab等源码管理服务，实现源码更新同步；

2、聚合Trello、JIRA等项目协调服务，实现项目信息同步；

3、机器人支持Webhook自定义接入，就可以实现更多可能性，例如：将运维报警、自动化测试结果报告、工作&生活日程安排（上班打卡、下班吃饭、健身、读书、生日、纪念日...）的提醒；

目前自定义机器人支持文本（text）、链接（link）、markdown三种消息格式，五种消息类型，详细信息请参考[自定义机器人官方文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)

## 二、安装使用

这么好用的功能，只要在钉钉群中添加机器人，得到Webhoo地址即可。接下来，我们先在命令行终端一睹为快吧：

```bash
curl 'https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx' \
   -H 'Content-Type: application/json' \
   -d '
  {"msgtype": "text",
    "text": {
        "content": "我就是我, 是不一样的烟火"
     }
  }'
```

### 三、支持功能

### Text文件类型发送

```javascript
const DingDingBot = require('dingdingbot')

const d = new DingDingBot('https://oapi.dingtalk.com/robot/send?access_token=eed4cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

d.sendText({ msg: 'Hello World!' }).then(r => console.log(r))
d.sendText({ msg: 'Hello World!', isAtAll: true }).then(r => console.log(r))
d.sendText({
  msg: 'Hello World!',
  isAtAll: false,
  atMobiles: ['188xxxxx', '187xxxxx'],
  atDingTalkIds: ['userid1', 'userid2']
}).then(r => console.log(r))

```

