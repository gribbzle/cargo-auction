import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = '/api/v1'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public traceId?: string | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  public errors: Array<{ field: string; message: string; code?: string }>

  constructor(
    errors: Array<{ field: string; message: string; code?: string }>,
    message: string,
    traceId?: string | null,
  ) {
    super(422, 'validation_failed', message, traceId)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

const MAX_RETRIES = 2
const INITIAL_RETRY_DELAY = 1000

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryable(error: AxiosError): boolean {
  return !error.response || error.response.status === 503
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number } | undefined

    if (config && isRetryable(error) && (config._retryCount ?? 0) < MAX_RETRIES) {
      config._retryCount = (config._retryCount ?? 0) + 1
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, config._retryCount - 1)
      await sleep(delay)
      return client.request(config)
    }

    if (error.response?.status === 401) {
      toast.error('Сессия истекла')
    }

    return Promise.reject(error)
  },
)

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await client.request<T>(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const body = error.response.data as Record<string, unknown>
      const errors = body.errors as Array<{ field: string; message: string; code?: string }> | undefined
      throw new ValidationError(
        errors ?? [],
        (body.message as string) ?? 'Validation failed',
        (body.trace_id as string) ?? null,
      )
    }
    throw error
  }
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'GET', url })
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: 'POST', url, data })
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: 'PATCH', url, data })
}

export { client }
