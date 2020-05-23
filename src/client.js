import { Client as DiscordClient } from 'discord.js'

export class Client extends DiscordClient {
  constructor({ activity, activityType }) {
    super()

    this.clientActivity = activity
    this.clientActivityType = activityType
  }
  async loginClient(token) {
    try {
      const _token = await this.login(token)

      this.once('ready', () => {
        this.user.setActivity(this.clientActivity, {
          type: this.clientActivityType,
        })
      })

      return _token
    } catch (error) {
      console.error(error)
    }
  }
}
