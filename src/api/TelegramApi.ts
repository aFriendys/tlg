import { TelegramClient, Api } from 'telegram'
import { type UserAuthParams } from 'telegram/client/auth'
import { RPCError } from 'telegram/errors'
import { StringSession } from 'telegram/sessions'
import { type TStartClientResult } from 'types'

class TelegramApi {
  readonly session: StringSession
  private apiId: number
  private apiHash: string
  private client: TelegramClient | undefined
  constructor () {
    this.session = new StringSession('')
    this.apiId = 0
    this.apiHash = ''
  }

  async createClient (apiId: number, apiHash: string): Promise<void> {
    this.apiId = Number(apiId)
    this.apiHash = apiHash
    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, { connectionRetries: 3 })
    await this.client.connect()
  }

  async tryToStartClient (): Promise<TStartClientResult> {
    try {
      this.client = new TelegramClient(new StringSession(JSON.parse(localStorage.getItem('session') as string)), Number(JSON.parse(localStorage.getItem('apiId') as string) as number), JSON.parse(localStorage.getItem('apiHash') as string), { connectionRetries: 3 })
      await this.client.connect()

      const userInfo: { users: any } = await this.client.invoke(
        new Api.users.GetFullUser({
          id: 'me'
        })
      )

      return [true, userInfo.users[0]]
    } catch (error) {
      if (error instanceof RPCError) return [false, error]
    }
    return [false, { firstName: undefined }]
  }

  async sendCode (phone: string): Promise<void> {
    await this.client?.sendCode({
      apiId: this.apiId,
      apiHash: this.apiHash
    }, phone)
  }

  async startClient ({ phoneNumber, password, phoneCode }: { phoneNumber: UserAuthParams['phoneNumber'], password: UserAuthParams['password'], phoneCode: string }): Promise<TStartClientResult> {
    await this.client?.start({
      phoneNumber,
      password,
      phoneCode: async () => { return await new Promise(resolve => { resolve(phoneCode) }) },
      onError: () => {}
    })
      .then(() => {
        localStorage.setItem('session', JSON.stringify(this.client?.session.save()))
      }).catch((e) => {
        console.log('ERROR', e.toString())
      })
    try {
      const userInfo: { users: any } | undefined = await this.client?.invoke(
        new Api.users.GetFullUser({
          id: 'me'
        })
      )
      return [true, userInfo?.users[0]]
    } catch (error) {
      if (error instanceof RPCError) return [false, error]
    }
    return [false, { firstName: undefined }]
  }

  async sendMessage (user: string, message: string): Promise<void> {
    await this.client?.invoke(
      new Api.messages.SendMessage({
        peer: user,
        message
      }
      )
    )
  }

  async getChannelParticipants (channel: string, offset: number = 0): Promise<string[]> {
    const usersResult = []

    try {
      const result: any = await this.client?.invoke(
        new Api.channels.GetParticipants({
          channel,
          filter: new Api.ChannelParticipantsRecent(),
          offset,
          limit: 200
        }))

      if (result?.count > 0) {
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
