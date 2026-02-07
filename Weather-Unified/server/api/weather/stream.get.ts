import type { Forecasts } from '~/types/weather'
import * as signalR from '@microsoft/signalr'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.WUREQUEST_API_URL

  // Set headers for Server-Sent Events
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no') // Disable nginx buffering

  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let signalRConnection: signalR.HubConnection | null = null

      // Function to send data to client
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Send initial forecast data
      try {
        const initialForecast = await $fetch<Forecasts>(`${backendUrl}/api/forecasts`)
        sendEvent({
          type: 'initial',
          data: initialForecast,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error fetching initial forecast:', error)
        sendEvent({
          type: 'error',
          message: 'Failed to fetch initial forecast data'
        })
      }

      // Connect to SignalR hub for real-time event-driven updates
      try {
        signalRConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${backendUrl}/weatherhub`)
          .withAutomaticReconnect()
          .build()

        signalRConnection.on('ReceiveForecastUpdate', (forecast: Forecasts) => {
          console.log('📡 SignalR: New forecast received via SignalR')
          sendEvent({
            type: 'update',
            data: forecast,
            timestamp: new Date().toISOString()
          })
        })

        await signalRConnection.start()
        console.log('✅ SignalR connection established for forecasts')
        
        sendEvent({
          type: 'info',
          message: '⚡ Real-time SignalR updates active (event-driven)'
        })
      } catch (signalRError) {
        console.error('❌ SignalR connection failed:', signalRError)
        
        sendEvent({
          type: 'error',
          message: 'SignalR connection failed. Real-time updates unavailable. Please check CORS configuration.'
        })
      }

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        sendEvent({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        })
      }, 30000)

      // Cleanup when client disconnects
      event.node.req.on('close', async () => {
        clearInterval(heartbeatInterval)
        if (signalRConnection) {
          await signalRConnection.stop()
          console.log('SignalR connection closed')
        }
        controller.close()
      })
    }
  })

  return stream
})
