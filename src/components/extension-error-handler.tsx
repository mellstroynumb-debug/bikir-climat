'use client'

import { useEffect } from 'react'

/**
 * Suppresses unhandled errors originating from browser extensions
 * (e.g. TronLink wallet extension setting properties on window proxy).
 * These errors are not caused by application code.
 */
export function ExtensionErrorHandler() {
  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const message =
        event.reason?.message || (typeof event.reason === 'string' ? event.reason : '')

      // Suppress errors from browser extensions injecting into the page
      if (
        message.includes('tronlinkParams') ||
        message.includes("'set' on proxy: trap returned falsish")
      ) {
        event.preventDefault()
      }
    }

    function handleError(event: ErrorEvent) {
      if (event.filename?.includes('chrome-extension://')) {
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
