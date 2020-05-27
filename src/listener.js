import { requestTTS } from './network/request.js'
import { voices, nationalities } from './util/constants.js'
import { capitalizeFirstLetter } from './util/string.js'

const prefix = process.env.PREFIX || 'tts!'

export default async function msgHandler(
  { author, content, channel, member },
  user
) {
  if (author == user) return
  if (content.startsWith(prefix)) {
    const text = content.slice(prefix.length).split(' ')

    const voice = capitalizeFirstLetter(text[0].toLowerCase())
    const textArg = text.join(' ').slice(voice.length + 1)

    for (const nationality of nationalities) {
      if (voices[nationality].includes(voice)) {
        if (!textArg) {
          return channel.send({
            embed: {
              color: '#ce6666',
              title: 'Missing Text',
              description: 'Please provide text for the text to speech command',
            },
          })
        }

        if (member.voice.channel) {
          try {
            const connection = await member.voice.channel.join()
            const response = await requestTTS({
              voice,
              text: textArg,
            })

            return connection.play(response.speak_url)
          } catch (error) {
            if (error.response && error.response.statusCode === 429) {
              return channel.send({
                embed: {
                  color: '#ce6666',
                  title: 'Too many attempts',
                  description: 'Please try again soon.',
                },
              })
            }
            return channel.send({
              embed: {
                color: '#ce6666',
                title: 'Streamlabs API error :cry:',
                description:
                  'It appears streamlabs tts service is down, Please try again later.',
                footer: `Code: ${error.response.statusCode}`,
              },
            })
          }
        }
        return channel.send({
          embed: {
            color: '#ce6666',
            title: 'You have to be in a voice channel to use this command.',
          },
        })
      }
    }
    const fields = []
    for (const nationality of nationalities) {
      fields.push({
        name: capitalizeFirstLetter(nationality),
        value: voices[nationality],
        inline: true,
      })
    }
    return channel.send({
      embed: {
        color: '#ce6666',
        title: 'Unknown voice',
        description:
          'You have to specify the voice for the tts bot. Available voices:',
        fields,
        footer: {
          text: 'Usage tts!brian hello world',
        },
      },
    })
  }
}
