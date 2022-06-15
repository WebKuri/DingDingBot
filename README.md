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

```bash
npm install dingdingbot
```

#### 支持功能如下

-   支持Text消息；
-   支持Link消息；
-   支持Markdown消息；
-   支持ActionCard消息；
-   支持image表情消息；
-   支持钉钉官方消息发送频率限制限制：每个机器人每分钟最多发送20条；
-   支持最新版钉钉机器人加密设置密钥验证；

### Text文件类型发送

### DingDingBot机器人配置初始化

```javascript
const DingDingBot = require('dingdingbot')

// 不携带加密token
const bot = new DingDingBot('https://oapi.dingtalk.com/robot/send?access_token=eed4cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
// 携带加密token
const bot = new DingDingBot('https://oapi.dingtalk.com/robot/send?access_token=eed4cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
```

# 三、各消息类型使用示例

### Text消息

![image-20220615140552707](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615140552707.png)

```javascript
bot.sendText({ msg: 'Hello World!' }).then(r => console.log(r))
```
![image-20220615140733204](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615140733204.png)

```javascript
// @所有人
bot.sendText({ msg: 'Hello World!', isAtAll: true }).then(r => console.log(r))

```

![image-20220615141135608](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615141135608.png)



```javascript
// Text消息之@指定用户atMobiles: ['188xxxxx', '187xxxxx'] 改写手机号
bot.sendText({
  msg: 'Hello World!',
  isAtAll: false,
  atMobiles: ['188xxxxx', '187xxxxx'],
  atDingTalkIds: ['userid1', 'userid2']
}).then(r => console.log(r))
```



![image-20220615141257175](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615141257175.png)

### Image表情消息

```javascript
// Image表情消息
const catImageUrl = 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/18d8bc3eb13533facf73c7a1a9d3fd1f40345b73.jpg'
bot.sendImage(catImageUrl).then(r => console.log(r)).catch(e => console.log(e))
```

![image-20220615141433188](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615141433188.png)

### Link消息

```javascript
// Link消息
bot.sendLink({
  text: 'Hello World!',
  title: '万万没想到!',
  picUrl: 'https://pic.dmjnb.com/pic/cef5dd8fb7aaabb8bb116bb55f270ba9?imageMogr2/thumbnail/x380/quality/90!',
  messageUrl: 'https://www.baidu.com'
}).then(r => console.log(r)).catch(e => console.log(e))

```

![image-20220615141545661](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615141545661.png)

###  Markdown消息

```javascript
// Markdown消息@所有人
bot..sendMarkdown({
    title: '漢洲天機',
    text: '#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n',
    isAtAll: true
  }
).then(r => console.log(r)).catch(e => console.log(e))

// Markdown消息
.sendMarkdown({
    title: '漢洲天機',
    text: '#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n',
    isAtAll: false
  }
).then(r => console.log(r)).catch(e => console.log(e))

// @某个人
bot.sendMarkdown({
    title: '漢洲天機',
    text: '#### 漢洲天機 @18727792911 \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n',
    atMobiles: ['18871535971', ['18727792911'],['21312321123']]
  }
).then(r => console.log(r)).catch(e => console.log(e))
```

![image-20220615142007010](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615142007010.png)



### FeedCard消息

```javascript
// FeedCard消息
const card1 = CardItem('氧气美女',
  'https://www.dingtalk.com/',
  'https://pic.dmjnb.com/pic/cef5dd8fb7aaabb8bb116bb55f270ba9?imageMogr2/thumbnail/x380/quality/90'
)
const card2 = CardItem('氧气美女',
  'https://www.dingtalk.com/',
  'https://pic.dmjnb.com/pic/cef5dd8fb7aaabb8bb116bb55f270ba9?imageMogr2/thumbnail/x380/quality/90'
)
const card3 = CardItem('氧气美女',
  'https://www.dingtalk.com/',
  'https://pic.dmjnb.com/pic/cef5dd8fb7aaabb8bb116bb55f270ba9?imageMogr2/thumbnail/x380/quality/90'
)
bot.sendFeedCard(
  [card1, card2, card3]
).then(r => console.log(r)).catch(e => console.log(e))
```

![image-20220615142215447](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615142215447.png)

### ActionCard消息

```javascript
// ActionCard消息
const btns2 = [ActionCardItem('支持1+1', 'https://www.dingtalk.com/'), ActionCardItem('反对2+2', 'https://www.dingtalk.com/')]
bot.sendActionCard({
  headers: ['投票'],
  btns: btns2,
  text: `![选择](${catImageUrl}) \n### 故事是这样子的...`
}).then(r => console.log(r)).catch(e => console.log(e))
```

![image-20220615142404641](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220615142404641.png)

```javascript
// 选项卡换方向
d.sendActionCard({
  headers: ['投票'],
  btns: btns2,
  btnOrientation: '1',
  text: `![选择](${catImageUrl}) \n### 故事是这样子的...`
}).then(r => console.log(r)).catch(e => console.log(e))
```



## 
