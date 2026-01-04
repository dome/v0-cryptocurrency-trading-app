// Mock authentication for demo - ready for PocketBase integration
export interface User {
  id: string
  email: string
  name: string
  balance: {
    BTC: number
    USDT: number
    [key: string]: number
  }
}

// Mock user storage (replace with PocketBase)
let currentUser: User | null = null

export async function login(email: string, password: string): Promise<User> {
  // TODO: Replace with PocketBase authentication
  // const pb = new PocketBase('YOUR_POCKETBASE_URL')
  // const authData = await pb.collection('users').authWithPassword(email, password)

  await new Promise((resolve) => setTimeout(resolve, 500))

  currentUser = {
    id: "1",
    email,
    name: email.split("@")[0],
    balance: {
      BTC: 0.5,
      USDT: 50000,
      ETH: 2.5,
      BNB: 10,
    },
  }

  localStorage.setItem("user", JSON.stringify(currentUser))
  return currentUser
}

export async function register(email: string, password: string, name: string): Promise<User> {
  // TODO: Replace with PocketBase registration
  // const pb = new PocketBase('YOUR_POCKETBASE_URL')
  // const record = await pb.collection('users').create({ email, password, passwordConfirm: password, name })

  await new Promise((resolve) => setTimeout(resolve, 500))

  currentUser = {
    id: "2",
    email,
    name,
    balance: {
      BTC: 0,
      USDT: 10000,
      ETH: 0,
      BNB: 0,
    },
  }

  localStorage.setItem("user", JSON.stringify(currentUser))
  return currentUser
}

export function logout(): void {
  // TODO: Replace with PocketBase logout
  // const pb = new PocketBase('YOUR_POCKETBASE_URL')
  // pb.authStore.clear()

  currentUser = null
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser

  const stored = localStorage.getItem("user")
  if (stored) {
    currentUser = JSON.parse(stored)
    return currentUser
  }

  return null
}
