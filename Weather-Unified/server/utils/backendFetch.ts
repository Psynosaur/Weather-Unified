/**
 * Server-side utility to fetch from WURequest API with authentication
 * Automatically adds X-API-Key header for server-to-server requests
 */
export const backendFetch = async <T>(endpoint: string): Promise<T> => {
  const config = useRuntimeConfig()
  const backendUrl = config.WUREQUEST_API_URL_INTERNAL || config.public.WUREQUEST_API_URL
  const apiKey = config.WUREQUEST_API_KEY

  const url = `${backendUrl}${endpoint}`

  const response = await $fetch<T>(url, {
    headers: {
      'X-API-Key': apiKey
    }
  })

  return response as T
}