import { store } from '../store'
import { logout } from '../store/slices/authSlice'

// Base URL — reads from Vite env var in production, falls back to localhost in dev
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(/\/$/, '')

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
  role?: 'customer' | 'vendor' | 'admin'
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: 'customer' | 'vendor' | 'admin'
}

export interface OrderData {
  orderItems: Array<{
    product: string
    title: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
}

export interface ProductFilters {
  keyword?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  rating?: number
  seller?: string
  store?: string
  sortBy?: 'latest' | 'priceAsc' | 'priceDesc' | 'topRated'
  page?: number
  limit?: number
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(`Unable to connect to the API at ${API_BASE_URL}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`
    const err = new Error(message) as Error & { status: number }
    err.status = response.status

    if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
      store.dispatch(logout())
    }

    throw err
  }

  return data
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

class ApiService {
  // Auth
  async login(credentials: LoginCredentials) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return result.data
  }

  async register(data: RegisterData) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return result.data
  }

  async getMe() {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/auth/me')
    return result.data
  }

  // ─── Products ───────────────────────────────────────────────────────────────

  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams()
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
    if (filters.brand) params.set('brand', filters.brand)
    if (filters.rating !== undefined) params.set('rating', String(filters.rating))
    if (filters.seller) params.set('seller', filters.seller)
    if (filters.store) params.set('store', filters.store)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))

    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch<{ success: boolean; data: unknown[]; pagination: unknown }>(`/products${query}`)
  }

  async getProduct(id: string) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/products/${id}`)
    return result.data
  }

  async createProduct(data: Record<string, unknown>) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return result.data
  }

  async updateProduct(id: string, data: Record<string, unknown>) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return result.data
  }

  async deleteProduct(id: string) {
    return apiFetch<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' })
  }

  // ─── Orders ─────────────────────────────────────────────────────────────────

  async createOrder(orderData: OrderData) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
    return result.data
  }

  async getOrders() {
    const result = await apiFetch<{ success: boolean; data: unknown[] }>('/orders/my-orders')
    return result.data
  }

  async getOrder(id: string) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/orders/${id}`)
    return result.data
  }

  async cancelOrder(id: string) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/orders/${id}/cancel`, {
      method: 'PUT',
    })
    return result.data
  }

  // ─── Vendor Orders ──────────────────────────────────────────────────────────

  async getVendorOrders(page = 1, limit = 20) {
    const result = await apiFetch<{ success: boolean; data: unknown[]; pagination: unknown }>(
      `/orders/vendor?page=${page}&limit=${limit}`,
    )
    return result
  }

  async updateVendorOrderStatus(orderId: string, status: string) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(
      `/orders/vendor/${orderId}/status`,
      { method: 'PUT', body: JSON.stringify({ status }) },
    )
    return result.data
  }

  // ─── Store ──────────────────────────────────────────────────────────────────

  async getMyStore() {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/stores/my-store')
    return result.data
  }

  async updateStore(id: string, data: Record<string, unknown>) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return result.data
  }

  async createStore(data: Record<string, unknown>) {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return result.data
  }

  // ─── Analytics ──────────────────────────────────────────────────────────────

  async getVendorAnalytics() {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/analytics/vendor')
    return result.data
  }

  async getAdminAnalytics() {
    const result = await apiFetch<{ success: boolean; data: Record<string, unknown> }>('/analytics/admin')
    return result.data
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  async getCategories() {
    const result = await apiFetch<{ success: boolean; data: unknown[] }>('/categories')
    return result.data
  }

  // ─── Users (admin) ───────────────────────────────────────────────────────────

  async getUsers() {
    const result = await apiFetch<{ success: boolean; data: unknown[] }>('/users')
    return result.data
  }
}

export const api = new ApiService()
