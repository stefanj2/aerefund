import { Resend } from 'resend'

const _resend = new Resend(process.env.RESEND_API_KEY)

// Zet DISABLE_EMAILS=true in Vercel om alle uitgaande e-mails te blokkeren
const disabled = process.env.DISABLE_EMAILS === 'true'

export const resend = {
  emails: {
    send: async (params: Parameters<typeof _resend.emails.send>[0]) => {
      if (disabled) {
        console.log(`[email blocked] to=${Array.isArray(params.to) ? params.to.join(',') : params.to} subject="${params.subject}"`)
        return { data: { id: 'disabled' }, error: null }
      }
      return _resend.emails.send(params)
    },
  },
}
