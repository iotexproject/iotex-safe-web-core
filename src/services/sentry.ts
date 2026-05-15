import * as Sentry from '@sentry/react'
import type { BrowserOptions } from '@sentry/react'
import { SENTRY_DSN } from '@/config/constants'
import packageJson from '../../package.json'

const sentryOptions: BrowserOptions = {
  dsn: SENTRY_DSN,
  release: `safe-wallet-web@${packageJson.version}`,
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      showBranding: false,
      buttonLabel: 'Feedback',
      formTitle: 'Send feedback',
      messageLabel: 'Feedback',
      messagePlaceholder: 'What should we know?',
      submitButtonLabel: 'Send',
      cancelButtonLabel: 'Cancel',
      successMessageText: 'Thanks for the feedback.',
    }),
  ],
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  autoSessionTracking: false,
  sendClientReports: false,
  // ignore MetaMask errors we don't control
  ignoreErrors: ['Internal JSON-RPC error', 'JsonRpcEngine', 'Non-Error promise rejection captured with keys: code'],

  beforeSend: (event) => {
    if (event.type === 'feedback') {
      return event
    }

    if (!event.exception?.values?.length) {
      return null
    }

    // Remove sensitive URL query params
    const query = event.request?.query_string
    if (event.request && query) {
      const appUrl = typeof query !== 'string' && !Array.isArray(query) ? query.appUrl : ''
      if (appUrl) {
        event.request.query_string = { appUrl }
      } else {
        delete event.request.query_string
      }
    }
    return event
  },

  beforeSendTransaction: () => null,
}

if (SENTRY_DSN) {
  Sentry.init(sentryOptions)
}

export default Sentry
