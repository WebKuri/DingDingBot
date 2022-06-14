import fetch from 'node-fetch'
import crypto from 'crypto'


type props = {
  msg: string;
  isAtAll?: boolean;
  atMobiles?: string[];
  atDingTalkIds?: string[];
};

/**
 *  钉钉群自定义机器人（每个机器人每分钟最多发送20条），支持文本（text）、连接（link）、markdown三种消息类型！
 */
export default class DingDingBot {
  private webhook: string
  private readonly secret: string

  /**
   *
   * @param webhook 钉钉群自定义机器人webhook地址
   * @param secret 机器人安全设置页面勾选“加签”时需要传入的密钥
   */
  constructor(webhook: string, secret: string = '') {
    this.webhook = webhook
    this.secret = secret
    if ((secret !== '') && secret.startsWith('SEC')) {
      this.signContent()
    }

  }

  /**
   *  自定义机器人安全设置
   *   - 加签名校验
   *  钉钉群自定义机器人安全设置加签时，签名中的时间戳与请求时不能超过一个小时，所以每个1小时需要更新签名
   */
  signContent() {
    const timestamp = new Date().getTime()
    const content = `${timestamp}\n${this.secret}`
    const sign = crypto.createHmac('sha256', this.secret).update(content).digest().toString('base64')
    this.webhook = `${this.webhook}&timestamp=${timestamp}&sign=${sign}`
  }

  isNotNullAndBlankString(content: String) {
    return content != null && content.trim().length > 0
  }

  /**
   * 发送Text消息类型
   * @param msg 消息内容
   * @param isAtAll 是否@所有人
   * @param atMobiles 被@的手机号
   * @param atDingTalkIds 被@的钉钉用户id
   */
  sendText({ msg, isAtAll = false, atMobiles = [], atDingTalkIds = [] }: props) {
    const data = {
      'msgtype': 'text',
      'at': { 'isAtAll': false, 'atMobiles': [''], 'atUserIds': [''] },
      'text': {}
    }
    if (this.isNotNullAndBlankString(<String>msg)) {
      data['text'] = { 'content': msg }
    } else {
      console.error('Text消息内容不能为空!')
      throw new Error('Text消息内容不能为空!')
    }
    if (isAtAll) {
      data['at']['isAtAll'] = true
    }
    if (atMobiles.length > 0) {
      data['at']['atMobiles'] = atMobiles
    }
    if (atDingTalkIds.length > 0) {
      data['at']['atUserIds'] = atDingTalkIds
    }
    console.error('Text消息发送内容: ' + JSON.stringify(data))
    return this._post(data)

  }

  async _post(data: any) {
    try {
      const response = await fetch(this.webhook, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      })
      return response.json()
    } catch (e) {
      console.log(e)
    }
  }
}






