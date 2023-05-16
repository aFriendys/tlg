import { TelegramClient, Api } from 'telegram'
import { StringSession } from 'telegram/sessions'

class TelegramApi {
  constructor () {
    this.client = undefined
    this.session = new StringSession('')
  }

  createClient (apiId, apiHash) {
    this.client = new TelegramClient(this.session, Number(apiId), apiHash, { connectionRetries: 3 })
  }

  startClient (phoneCallback, passwordCallback, codeCallback) {
    this.client.start({
      phoneNumber: phoneCallback,
      password: passwordCallback,
      phoneCode: codeCallback
    })
      .then(() => {
        this.client.session.save()
      }).catch((e) => {
        console.log(e.toString())
      })
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

    const result = await this.client.invoke(
      new Api.channels.GetParticipants({
        channel,
        filter: new Api.ChannelParticipantsRecent({}),
        offset,
        limit: 200
      }))

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
    return usersResult.filter(user => user !== 'no info' && !user.toLowerCase().endsWith('bot'))
  }
}

export const telegramClient = new TelegramApi()
