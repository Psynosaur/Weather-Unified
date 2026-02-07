import type { Observation } from '~/types/weather'
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
      let lastObservationTime: string | null = null
      let signalRConnection: signalR.HubConnection | null = null

      // Function to send data to client
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Send initial observation data
      try {
        const initialObservations = await $fetch<Observation[]>(`${backendUrl}/api/observations`)
        const latest = initialObservations[0]
        lastObservationTime = latest?.obsTime
        
        sendEvent({
          type: 'initial',
          data: latest,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error fetching initial observations:', error)
        sendEvent({
          type: 'error',
          message: 'Failed to fetch initial observation data'
        })
      }

      // Connect to SignalR hub for real-time event-driven updates
      try {
        signalRConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${backendUrl}/weatherhub`)
          .withAutomaticReconnect()
          .build()

        signalRConnection.on('ReceiveObservationUpdate', (observation: Observation) => {
          console.log('📡 SignalR: New observation received via SignalR', observation.obsTime)
          if (observation && observation.obsTime !== lastObservationTime) {
            lastObservationTime = observation.obsTime
            sendEvent({
              type: 'update',
              data: observation,
              timestamp: new Date().toISOString()
            })
          }
        })

        await signalRConnection.start()
        console.log('✅ SignalR connection established for observations')
        
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
