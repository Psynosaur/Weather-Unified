import * as signalR from '@microsoft/signalr'
import type { Observation, Forecasts } from '~/types/weather'

export const useSignalR = () => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.WUREQUEST_API_URL

  let connection: signalR.HubConnection | null = null

  const connect = async (
    onObservationUpdate?: (observation: Observation) => void,
    onForecastUpdate?: (forecast: Forecasts) => void
  ) => {
    try {
      // Create SignalR connection
      connection = new signalR.HubConnectionBuilder()
        .withUrl(`${backendUrl}/weatherhub`, {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Set up observation event handler if provided
      if (onObservationUpdate) {
        connection.on('ReceiveObservationUpdate', (observation: Observation) => {
          console.log('📡 SignalR: New observation received', observation.obsTime)
          onObservationUpdate(observation)
        })
      }

      // Set up forecast event handler if provided
      if (onForecastUpdate) {
        connection.on('ReceiveForecastUpdate', (forecast: Forecasts) => {
          console.log('📡 SignalR: Forecast update received')
          onForecastUpdate(forecast)
        })
      }

      connection.onreconnecting(() => {
        console.log('🔄 SignalR reconnecting...')
      })

      connection.onreconnected(() => {
        console.log('✅ SignalR reconnected')
      })

      connection.onclose((error) => {
        console.log('❌ SignalR connection closed', error)
      })

      // Start connection
      await connection.start()
      console.log('✅ SignalR connection established')

      return connection
    } catch (error) {
      console.error('❌ SignalR connection failed:', error)
      throw error
    }
  }

  const disconnect = async () => {
    if (connection) {
      await connection.stop()
      connection = null
      console.log('SignalR connection closed')
    }
  }

  return {
    connect,
    disconnect,
    connection
  }
}
