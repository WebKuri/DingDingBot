import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import crypto from 'crypto'


type Text = {
  msg: string;
  isAtAll?: boolean;
  atMobiles?: string[];
  atDingTalkIds?: string[];
};
type Link = {
  /** 链接标题 */
  text: string;
  title: string;
  picUrl?: string,
  messageUrl: string,
}

type Markdown = {
  title: string;
  text: string;
  atMobiles?: string[];
  atDingTalkIds?: string[];
  isAtAll?: boolean;
}

type FeedCard = {
  title: string
  messageURL: string
  picURL: string
}


type ActionCardItem = {
  title: string;
  actionURL: string
}


type ActionCard = {
  headers: string
  text: string
  btnOrientation?: '0' | '1'
  btns: ActionCardItem[]
}


/**
 * FeedCard的构造函数
 * @param title 标题
 * @param messageURL  链接
 * @param picURL  图片
 * @constructor FeedCard
 */
export function CardItem(title: string, messageURL: string, picURL: string) {
  return {
    title: title,
    messageURL: messageURL,
    picURL: picURL
  }
}

/**
 * ActionCard的构造函数
 * @param title 标题
 * @param actionURL 链接
 * @constructor ActionCard构造器
 */
export function ActionCardItem(title: string, actionURL: string) {
  return {
    title: title,
    actionURL: actionURL
  }
}

/**
 *  钉钉群自定义机器人（每个机器人每分钟最多发送20条），支持文本（text）、连接（link）、markdown三种消息类型！
 */
export class DingDingBot {
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
  sendText({ msg, isAtAll = false, atMobiles = [], atDingTalkIds = [] }: Text): Promise<any> {
    const data = {
      'msgtype': 'text',
      'at': { 'isAtAll': false, 'atMobiles': [''], 'atUserIds': [''] },
      'text': {}
    }
    if (this.isNotNullAndBlankString(msg as String)) {
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

  /**
   * 发送Link消息类型
   * @param link
   */
  sendLink(link: Link): Promise<any> {
    const data = {
      'msgtype': 'link',
      'link': {
        'text': '',
        'title': '',
        'picUrl': '',
        'messageUrl': ''
      }
    }
    if (this.isNotNullAndBlankString(link.text as String)) {
      data['link']['text'] = link.text
    } else {
      console.error('Link消息内容不能为空!')
      throw new Error('Link消息内容不能为空!')
    }
    if (this.isNotNullAndBlankString(link.title as String)) {
      data['link']['title'] = link.title
    } else {
      console.error('Link消息标题不能为空!')
      throw new Error('Link消息标题不能为空!')
    }
    if (this.isNotNullAndBlankString(link.messageUrl as String)) {
      data['link']['messageUrl'] = link.messageUrl
    } else {
      console.error('Link消息链接不能为空!')
      throw new Error('Link消息链接不能为空!')
    }
    if (this.isNotNullAndBlankString(link.picUrl as String)) {
      if (link.picUrl != null) {
        data['link']['picUrl'] = link.picUrl
      }
    }
    return this._post(data)
  }

  sendMarkdown({
                 title,
                 text,
                 isAtAll = false,
                 atMobiles = [],
                 atDingTalkIds = []
               }: Markdown): Promise<any> {
    const data = {
      'msgtype': 'markdown',
      'markdown': {
        'title': '',
        'text': ''
      },
      'at': {
        'isAtAll': isAtAll,
        'atMobiles': [''],
        'atUserIds': ['']
      }
    }
    if (this.isNotNullAndBlankString(title as String)) {
      data['markdown']['title'] = title
    } else {
      console.error('Markdown消息标题不能为空!')
      throw new Error('Markdown消息标题不能为空!')
    }
    if (this.isNotNullAndBlankString(text as String)) {
      data['markdown']['text'] = text
    } else {
      console.error('Markdown消息内容不能为空!')
      throw new Error('Markdown消息内容不能为空!')
    }
    if (isAtAll) {
      data['at']['isAtAll'] = isAtAll
    }
    if (atMobiles?.length > 0) {
      data['at']['atMobiles'] = atMobiles
      data['markdown']['text'] = `${text}\n\n@${atMobiles.join(' @')}`
    }
    if (atDingTalkIds?.length > 0) {
      data['at']['atUserIds'] = atDingTalkIds
    }
    return this._post(data)
  }

  sendFeedCard(feedCardItems: FeedCard[]): Promise<any> {
    const data = {
      'msgtype': 'feedCard',
      'feedCard': {}
    }
    data['feedCard'] = {
      'links': feedCardItems
    }
    return this._post(data)
  }


  sendActionCard({ headers, text, btnOrientation = '0', btns }: ActionCard): Promise<any> {
    const data = {
      'msgtype': 'actionCard',
      'actionCard': {}
    }
    data['actionCard'] = {
      'title': headers,
      'text': text,
      'btnOrientation': btnOrientation,
      'btns': btns
    }
    return this._post(data)
  }

  /**
   * 利用axios发送请求，并设置每分钟最多发送20条
   * @param data
   */
  async _post(data: any): Promise<any> {
    const MAX_REQUEST_PER_SECONDS = 10
    const MAX_REQUEST_PER_MINUTES = 20
    const http = rateLimit(axios.create(), {
      maxRequests: MAX_REQUEST_PER_SECONDS,
      perMilliseconds: 1000,
      maxRPS: MAX_REQUEST_PER_MINUTES
    })
    try {
      const response = await http(this.webhook, {
        method: 'POST',
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      })
      return response.data
    } catch (e) {
      console.log(e)
    }
  }
}






