import dotenv from 'dotenv'
import { Client } from './struct/Client.js'
import msgListener from './listener.js'

dotenv.config()

const token = process.env.BOT_TOKEN || ''

const clientOptions = {
  activity: process.env.ACTIVITY || 'to you monkaW',
  activityType: process.env.ACTIVITY_TYPE || 'LISTENING',
}

const client = new Client(clientOptions)

client.on('message', (msg) => msgListener(msg, client.user))

client.loginClient(token).then(() => console.log('Bot is now online!'))
