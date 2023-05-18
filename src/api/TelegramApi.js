import { TelegramClient, Api } from 'telegram'
import { StringSession } from 'telegram/sessions'

class TelegramApi {
  constructor () {
    this.session = new StringSession('')
  }

  async createClient (apiId, apiHash) {
    this.apiId = Number(apiId)
    this.apiHash = apiHash
    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, { connectionRetries: 3 })
    await this.client.connect()
  }

  async tryToStartClient () {
    let userInfo = {}
    try {
      this.client = new TelegramClient(new StringSession(JSON.parse(localStorage.getItem('session'))), Number(JSON.parse(localStorage.getItem('apiId'))), JSON.parse(localStorage.getItem('apiHash')), { connectionRetries: 3 })
      await this.client.connect()

      userInfo = await this.client.invoke(
        new Api.users.GetFullUser({
          id: 'me'
        })
      )
    } catch {
      return [false, userInfo]
    }
    return [true, userInfo.users[0]]
  }

  async sendCode (phone) {
    await this.client.sendCode({
      apiId: this.apiId,
      apiHash: this.apiHash
    }, phone)
  }

  async startClient (phoneNumber, password, phoneCode) {
    let userInfo = {}
    await this.client.start({
      phoneNumber,
      password,
      phoneCode: () => { return new Promise(resolve => { resolve(phoneCode) }) }
    })
      .then(() => {
        localStorage.setItem('session', JSON.stringify(this.client.session.save()))
      }).catch((e) => {
        console.log('ERROR', e.toString())
      })
    try {
      userInfo = await this.client.invoke(
        new Api.users.GetFullUser({
          id: 'me'
        })
      )
    } catch {
      return [false, userInfo]
    }
    return [true, userInfo.users[0]]
  }

  async sendMessage (user, message) {
    await this.client.invoke(
      new Api.messages.SendMessage({
        peer: user,
        message
      }
      )
    )
  }

  async getChannelParticipants (channel, offset = 0) {
    const usersResult = []

    try {
      const result = await this.client.invoke(
        new Api.channels.GetParticipants({
          channel,
          filter: new Api.ChannelParticipantsRecent({}),
          offset,
          limit: 200
        }))

      if (result.count) {
        for (const user of result.users) {
          let info = 'no info'
          if (user.username !== null
          //  || user.phone !== null
          ) {
            info = user.username
            // info = user.username === null ? user.phone : `@${user.username}`
          }

          usersResult.push(info)
        }

        if (offset < result.count) {
          usersResult.push(...await this.getChannelParticipants(channel, offset + 200))
        }
      }
    } catch (e) {
      console.log('Error:', e)
    }

    return usersResult.filter(user => user !== 'no info' && !user.toLowerCase().endsWith('bot'))
  }
}

export const telegramClient = new TelegramApi()
