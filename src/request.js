import request from 'got'

export async function requestTTS(payload) {
  const { body } = await request.post('https://streamlabs.com/polly/speak', {
    json: {
      voice: payload.voice,
      text: payload.text,
    },
    responseType: 'json',
  })

  return body
}
