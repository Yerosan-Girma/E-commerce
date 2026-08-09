const API_BASE_URL = 'http://localhost:5000/api'

interface LoginCredentials {
  email: string
  password: string
  role: 'customer' | 'vendor' | 'admin'
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'customer' | 'vendor' | 'admin'
}

interface OrderData {
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

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) throw new Error('Login failed')
    const result = await response.json()
    return result.data
  }

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Registration failed')
    const result = await response.json()
    return result.data
  }

  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  }

  async getProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  }

  async createOrder(orderData: OrderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    })
    if (!response.ok) throw new Error('Failed to create order')
    const result = await response.json()
    return result.data
  }

  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch orders')
    const result = await response.json()
    return result.data
  }

  async getOrder(id: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch order')
    const result = await response.json()
    return result.data
  }
}

export const api = new ApiService()
