import fs from "fs";
import path from "path";
import { DatabaseState, DbUser, DbAccount, DbOrder } from "./schema";
import { generateOrderId } from "@/lib/utils";
import { OrderStatus } from "@/types";

// Seeded bcrypt hash for password "AuraLiving2026!"
const DEFAULT_DEMO_PASSWORD_HASH = "$2b$10$xfoyTQbok616ZEr1Gs0mpO/KGqSxVjz1V.3j1x1L2vU21Gi9lmMwi";

const INITIAL_DB: DatabaseState = {
  users: [
    {
      id: "usr_arif_01",
      name: "Arif Rahman",
      email: "arif@demo.aura",
      passwordHash: DEFAULT_DEMO_PASSWORD_HASH,
      role: "CUSTOMER",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      savedAddresses: [
        {
          fullName: "Arif Rahman",
          email: "arif@demo.aura",
          phone: "01711000001",
          division: "Dhaka",
          district: "Dhaka",
          area: "Gulshan-2",
          streetAddress: "Road 71, House 14, Block D",
          apartment: "Apt 4B",
          city: "Dhaka",
          state: "Dhaka",
          postalCode: "1212",
          country: "Bangladesh",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_nusrat_02",
      name: "Nusrat Jahan",
      email: "nusrat@demo.aura",
      passwordHash: DEFAULT_DEMO_PASSWORD_HASH,
      role: "CUSTOMER",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      savedAddresses: [
        {
          fullName: "Nusrat Jahan",
          email: "nusrat@demo.aura",
          phone: "01819000002",
          division: "Chattogram",
          district: "Chattogram",
          area: "Panchlaish",
          streetAddress: "GEC Circle, Nasirabad",
          apartment: "Suite 3A",
          city: "Chattogram",
          state: "Chattogram",
          postalCode: "4000",
          country: "Bangladesh",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_admin_03",
      name: "Aura Operations Admin",
      email: "admin@demo.aura",
      passwordHash: DEFAULT_DEMO_PASSWORD_HASH,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      savedAddresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  accounts: [],
  sessions: [],
  orders: [],
};

// In-memory fallback if file system is read-only in serverless
let memoryDb: DatabaseState | null = null;

function getDbFilePath(): string {
  return path.join(process.cwd(), "data", "db.json");
}

export function getDb(): DatabaseState {
  if (memoryDb) return memoryDb;

  const filePath = getDbFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      memoryDb = JSON.parse(data) as DatabaseState;
      return memoryDb;
    }
  } catch (err) {
    console.warn("[Database] Could not read db.json, using initial state:", err);
  }

  // Initialize with initial state
  memoryDb = JSON.parse(JSON.stringify(INITIAL_DB));
  saveDb(memoryDb!);
  return memoryDb!;
}

export function saveDb(state: DatabaseState): void {
  memoryDb = state;
  const filePath = getDbFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Database] Could not persist db.json to disk (using memory buffer):", err);
  }
}

// User DAO
export function getUserByEmail(email: string): DbUser | null {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function getUserById(id: string): DbUser | null {
  const db = getDb();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(userData: {
  name: string;
  email: string;
  passwordHash?: string | null;
  role?: "CUSTOMER" | "ADMIN";
  image?: string | null;
  phone?: string;
  savedAddresses?: DbUser["savedAddresses"];
}): DbUser {
  const db = getDb();
  const normalizedEmail = userData.email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const now = new Date().toISOString();
  const newUser: DbUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name.trim(),
    email: normalizedEmail,
    passwordHash: userData.passwordHash || null,
    role: userData.role || "CUSTOMER", // Strict default to CUSTOMER
    image: userData.image || null,
    savedAddresses: userData.savedAddresses || [],
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<DbUser>): DbUser | null {
  const db = getDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  // Never allow role to be modified through normal update
  const { role, passwordHash, ...safeUpdates } = updates;

  db.users[idx] = {
    ...db.users[idx],
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  };

  saveDb(db);
  return db.users[idx];
}

// OAuth Account Mapping DAO
export function getAccountByProvider(provider: string, providerAccountId: string): DbAccount | null {
  const db = getDb();
  return db.accounts.find((a) => a.provider === provider && a.providerAccountId === providerAccountId) || null;
}

export function linkOAuthAccount(accountData: {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
}): DbAccount {
  const db = getDb();
  const existing = db.accounts.find(
    (a) => a.provider === accountData.provider && a.providerAccountId === accountData.providerAccountId
  );
  if (existing) return existing;

  const newAccount: DbAccount = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: accountData.userId,
    type: accountData.type,
    provider: accountData.provider,
    providerAccountId: accountData.providerAccountId,
    createdAt: new Date().toISOString(),
  };

  db.accounts.push(newAccount);
  saveDb(db);
  return newAccount;
}

// Order Management DAO with Strict Ownership
export function createOrder(
  orderPayload: Omit<DbOrder, "id" | "orderNumber" | "createdAt" | "status" | "trackingNumber">
): DbOrder {
  const db = getDb();
  const orderId = generateOrderId();
  const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newOrder: DbOrder = {
    ...orderPayload,
    id: orderId,
    orderNumber: orderId,
    createdAt: new Date().toISOString(),
    status: "pending",
    trackingNumber,
  };

  db.orders.unshift(newOrder);
  saveDb(db);
  return newOrder;
}

export function getOrdersByUserId(userId: string): DbOrder[] {
  const db = getDb();
  return db.orders.filter((o) => o.userId === userId);
}

export function getOrderById(orderId: string, requestUserId?: string, userRole?: string): DbOrder | null {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  // If user is Admin, allow viewing
  if (userRole === "ADMIN") return order;

  // Authorization check: User can ONLY view their own order
  if (requestUserId && order.userId === requestUserId) {
    return order;
  }

  // Unauthorized access attempt
  return null;
}

export function getAllOrdersAdmin(): DbOrder[] {
  const db = getDb();
  return db.orders;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): DbOrder | null {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.status = status;
  saveDb(db);
  return order;
}
