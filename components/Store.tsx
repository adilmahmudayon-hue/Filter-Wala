
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  Order,
  Company,
  User,
  Status,
  Role,
  SlotKey,
  DEFAULT_BANDS,
  INITIAL_COMPANIES,
  INITIAL_USERS,
} from "@/lib/data";

import { createClient } from "@/lib/supabase/client";

type State = {
  orders: Order[];
  companies: Company[];
  users: User[];
  sessionId: string | null;
};

type Store = {
  ready: boolean;
  user: User | null;
  orders: Order[];
  companies: Company[];
  users: User[];

  login: (email: string, password: string, role: Role) => Promise<string | null>;
  requestOtp: (identifier: string, role: Role) => Promise<string | null>;
  verifyOtp: (identifier: string, token: string, role: Role) => Promise<string | null>;

  logout: () => void;
  register: (u: Omit<User, "id" | "role">) => Promise<string | null>;
  signup: (u: Omit<User, "id">) => Promise<string | null>;
  updateUser: (id: string, p: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  changePassword: (id: string, oldPw: string, newPw: string) => string | null;

  addCompany: (name: string, phone: string, areas: string[]) => void;
  updateCompany: (id: string, p: Partial<Company>) => void;

  addOrder: (o: Omit<Order, "id" | "status" | "createdAt">) => Promise<void>;
  sendEta: (id: string, eta: string) => Promise<void>;
  markReceived: (id: string) => Promise<void>;
  reschedule: (id: string, slot: SlotKey) => Promise<void>;
  complete: (id: string, byUserId: string) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export const useStore = () => useContext(Ctx)!;

const KEY = "fw-demo-v3";
const now = () => new Date().toISOString();

const initial: State = {
  companies: INITIAL_COMPANIES,
  users: INITIAL_USERS,
  sessionId: null,
  orders: [
    {
      id: "FW-1001",
      companyId: "c1",
      customerId: "x1",
      customer: "Tanvir Ahmed",
      phone: "01755555555",
      building: "Hostel B, Room 4B",
      floor: 4,
      item: "newJar",
      qty: 1,
      total: 400,
      slot: "asap",
      pay: "COD",
      status: "Pending",
      createdAt: now(),
    },
    {
      id: "FW-1002",
      companyId: "c1",
      customerId: "x2",
      customer: "Nusrat Jahan",
      phone: "01866666666",
      building: "Mess 7, Road 3",
      floor: 1,
      item: "filter",
      qty: 1,
      total: 1845,
      slot: "evening",
      pay: "bKash",
      trxId: "9K3L2M1X",
      senderPhone: "01866666666",
      status: "Pending",
      createdAt: now(),
    },
    {
      id: "FW-1003",
      companyId: "c1",
      customerId: "u-s1",
      customer: "Rafiq Hasan",
      phone: "01700000000",
      building: "Mess 12, Road 5, Mirpur",
      floor: 3,
      item: "newJar",
      qty: 1,
      total: 400,
      slot: "morning",
      pay: "COD",
      status: "Completed",
      completedBy: "u-staff1",
      completedAt: now(),
      createdAt: now(),
    },
  ],
};

function profileToUser(profile: any): User {
  return {
    id: profile.id,
    role: profile.role as Role,
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    password: "",
    studentId: profile.student_id ?? undefined,
    building: profile.building ?? undefined,
    area: profile.area ?? undefined,
    floor: profile.floor ?? 0,
    companyId: profile.company_id ?? undefined,
    suspended: profile.suspended ?? false,
    pending: profile.pending ?? false,
  };
}

function databaseCompanyToCompany(row: any): Company {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    bkash: row.bkash ?? "",
    nagad: row.nagad ?? "",
    areas: row.areas ?? [],
    active: row.active ?? true,
    prices: row.prices ?? {
      newJar: 350,
      filterJar: 2150,
      filter: 1800,
    },
    bands: row.bands ?? DEFAULT_BANDS,
  };
}

function databaseOrderToOrder(row: any, screenshotUrl?: string): Order {
  return {
    id: row.code,
    dbId: row.id,
    code: row.code,
    companyId: row.company_id,
    customerId: row.customer_id,
    customer: row.customer_name,
    phone: row.customer_phone,
    building: row.building,
    floor: row.floor,
    item: row.item,
    qty: row.qty,
    unitPrice: Number(row.unit_price),
    floorFee: Number(row.floor_fee),
    total: Number(row.total),
    slot: row.slot,
    pay: row.pay,
    trxId: row.trx_id ?? undefined,
    senderPhone: row.sender_phone ?? undefined,
    screenshotPath: row.screenshot_path ?? undefined,
    screenshot: screenshotUrl,
    status: row.status,
    eta: row.eta ?? undefined,
    rescheduled: row.rescheduled ?? false,
    completedBy: row.completed_by ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());

  const [s, setS] = useState<State>(initial);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const [storeReady, setStoreReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [databaseLoaded, setDatabaseLoaded] = useState(false);

  const ready = storeReady && authReady;

  // Restore temporary demo data.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        setS({
          ...initial,
          ...parsed,
          sessionId: null,
        });
      }
    } catch (error) {
      console.error("Could not load local demo data:", error);
    }

    setStoreReady(true);
  }, []);

  // Keep the original demo backup until Supabase data loads successfully.
  useEffect(() => {
    if (!storeReady || databaseLoaded) return;

    try {
      const safeState = {
        ...s,
        sessionId: null,
        users: s.users.map(({ password, ...user }) => ({
          ...user,
          password: "",
        })),
      };

      localStorage.setItem(KEY, JSON.stringify(safeState));
    } catch (error) {
      console.error("Could not save local demo data:", error);
    }
  }, [s, storeReady, databaseLoaded]);

  // Load one profile.
  const loadProfile = async (
    userId: string,
    email?: string
  ): Promise<User | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("Profile loading failed:", error);
      return null;
    }

    const profile = profileToUser(data);

    if (!profile.email && email) {
      profile.email = email;
    }

    return profile;
  };

  // Load profiles. Admin RLS policies control which profiles are visible.
  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load profiles:", error);
      return;
    }

    setS((x) => ({
      ...x,
      users: (data ?? []).map(profileToUser),
    }));
  };

  // Load companies and orders from Supabase.
  const loadDatabaseData = async (userId: string | null) => {
    const companyResult = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: true });

    if (companyResult.error) {
      console.error("Could not load companies:", companyResult.error);
      return;
    }

    const databaseCompanies = (companyResult.data ?? []).map(
      databaseCompanyToCompany
    );

    if (!userId) {
      setS((x) => ({
        ...x,
        companies: databaseCompanies,
        orders: [],
      }));

      setDatabaseLoaded(true);
      return;
    }

    const orderResult = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (orderResult.error) {
      console.error("Could not load orders:", orderResult.error);
      return;
    }

    const rows = orderResult.data ?? [];

    // Generate temporary signed URLs for payment screenshots.
    const screenshotPaths = rows
      .map((row: any) => row.screenshot_path)
      .filter((path: string | null) => Boolean(path)) as string[];

    const screenshotUrls: Record<string, string> = {};

    if (screenshotPaths.length > 0) {
      const { data, error } = await supabase.storage
        .from("payment-screenshots")
        .createSignedUrls(screenshotPaths, 3600);

      if (error) {
        console.error("Could not load payment screenshots:", error);
      }

      (data ?? []).forEach((item: any) => {
        if (item.path && item.signedUrl) {
          screenshotUrls[item.path] = item.signedUrl;
        }
      });
    }

    const databaseOrders = rows.map((row: any) =>
      databaseOrderToOrder(
        row,
        row.screenshot_path
          ? screenshotUrls[row.screenshot_path]
          : undefined
      )
    );

    setS((x) => ({
      ...x,
      companies: databaseCompanies,
      orders: databaseOrders,
    }));

    setDatabaseLoaded(true);
  };

  // Validate an authenticated user's actual database profile.
  const validateAuthenticatedUser = async (
    userId: string,
    email: string | undefined,
    role: Role
  ): Promise<string | null> => {
    const profile = await loadProfile(userId, email);

    if (!profile) {
      await supabase.auth.signOut();
      return "profile_missing";
    }

    if (profile.role !== role) {
      await supabase.auth.signOut();
      return "role_mismatch";
    }

    if (profile.pending) {
      await supabase.auth.signOut();
      return "pending";
    }

    if (profile.suspended) {
      await supabase.auth.signOut();
      return "suspended";
    }

    setAuthUser(profile);

    await loadDatabaseData(userId);

    if (profile.role === "admin") {
      await loadProfiles();
    }

    return null;
  };

  // Restore the Supabase session after refresh.
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session restoration failed:", error);
      }

      if (data.session?.user) {
        const profile = await loadProfile(
          data.session.user.id,
          data.session.user.email
        );

        if (active) {
          setAuthUser(profile);

          if (profile) {
            await loadDatabaseData(data.session.user.id);
          }

          if (profile?.role === "admin") {
            await loadProfiles();
          }
        }
      } else {
        if (active) {
          setAuthUser(null);
          await loadDatabaseData(null);
        }
      }

      if (active) setAuthReady(true);
    };

    void restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (active) setAuthUser(null);
        return;
      }

      // Do database work outside the Auth callback.
      window.setTimeout(() => {
        void (async () => {
          const profile = await loadProfile(
            session.user.id,
            session.user.email
          );

          if (!active) return;

          setAuthUser(profile);

          if (profile) {
            await loadDatabaseData(session.user.id);
          }

          if (profile?.role === "admin") {
            await loadProfiles();
          }
        })();
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Find the database UUID for an order.
  const getDatabaseOrderId = async (id: string): Promise<string> => {
    const existing = s.orders.find(
      (order) =>
        order.dbId === id ||
        order.id === id ||
        order.code === id
    );

    if (existing?.dbId) {
      return existing.dbId;
    }

    // Also allow an order code such as FW-1004.
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("code", id)
      .single();

    if (error || !data) {
      throw new Error(
        error?.message ?? "Could not find this order in the database."
      );
    }

    return data.id;
  };

  // Common helper for order RPC calls.
  const runOrderRpc = async (
    functionName: string,
    args: Record<string, unknown>
  ) => {
    const { error } = await supabase.rpc(functionName, args);

    if (error) {
      console.error(`${functionName} failed:`, error);
      throw new Error(error.message);
    }

    const currentUser = authUser?.id ?? null;
    await loadDatabaseData(currentUser);
  };

  const patchOrder = (id: string, p: Partial<Order>) =>
    setS((x) => ({
      ...x,
      orders: x.orders.map((o) =>
        o.id === id || o.dbId === id
          ? { ...o, ...p }
          : o
      ),
    }));

  const value: Store = {
    ready,
    user: authUser,
    orders: s.orders,
    companies: s.companies,
    users: s.users,

    // Password login.
    login: async (email, password, role) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return "login_wrong";
      }

      return validateAuthenticatedUser(
        data.user.id,
        data.user.email,
        role
      );
    },

    // Request OTP without creating a new account.
    requestOtp: async (identifier, role) => {
      const value = identifier.trim();

      if (!value) return "missing_identifier";

      const isEmail = value.includes("@");

      if (role !== "student" && isEmail) {
        return "phone_required";
      }

      if (!isEmail && !/^\+[1-9]\d{7,14}$/.test(value)) {
        return "phone_format";
      }

      if (isEmail) {
        const { error } = await supabase.auth.signInWithOtp({
          email: value,
          options: {
            shouldCreateUser: false,
          },
        });

        if (error) {
          console.error("Email OTP request failed:", error);
          return error.message;
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: value,
          options: {
            shouldCreateUser: false,
          },
        });

        if (error) {
          console.error("SMS OTP request failed:", error);
          return error.message;
        }
      }

      return null;
    },

    // Verify OTP.
    verifyOtp: async (identifier, token, role) => {
      const value = identifier.trim();
      const code = token.trim();

      if (!value || !code) return "missing_otp_details";

      const isEmail = value.includes("@");

      if (role !== "student" && isEmail) {
        return "phone_required";
      }

      let userId: string | undefined;
      let userEmail: string | undefined;

      if (isEmail) {
        const { data, error } = await supabase.auth.verifyOtp({
          email: value,
          token: code,
          type: "email",
        });

        if (error || !data.user) {
          console.error("Email OTP verification failed:", error);
          return error?.message ?? "otp_invalid";
        }

        userId = data.user.id;
        userEmail = data.user.email;
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: value,
          token: code,
          type: "sms",
        });

        if (error || !data.user) {
          console.error("SMS OTP verification failed:", error);
          return error?.message ?? "otp_invalid";
        }

        userId = data.user.id;
        userEmail = data.user.email;
      }

      return validateAuthenticatedUser(userId, userEmail, role);
    },

    // Supabase logout.
    logout: () => {
      setAuthUser(null);
      void supabase.auth.signOut();
    },

    // Public registration creates students only.
    register: async (u) => {
      const { data, error } = await supabase.auth.signUp({
        email: u.email.trim(),
        password: u.password,
        options: {
          data: {
            name: u.name,
            phone: u.phone,
            student_id: u.studentId ?? "",
            building: u.building ?? "",
            area: u.area ?? "",
            floor: String(u.floor ?? 0),
          },
        },
      });

      if (error) {
        console.error("Registration failed:", error);
        return error.message;
      }

      if (data.session && data.user) {
        const profile = await loadProfile(
          data.user.id,
          data.user.email
        );

        if (profile) {
          setAuthUser(profile);
          await loadDatabaseData(data.user.id);
        }
      }

      return data.session ? null : "email_confirmation_required";
    },

    // Staff/admin signup is disabled.
    signup: async () => {
      return "role_signup_disabled";
    },

    // Update a real Supabase profile.
    updateUser: async (id, p) => {
      const dbPatch: Record<string, unknown> = {};

      if (p.name !== undefined) dbPatch.name = p.name;
      if (p.phone !== undefined) dbPatch.phone = p.phone;
      if (p.studentId !== undefined) dbPatch.student_id = p.studentId;
      if (p.building !== undefined) dbPatch.building = p.building;
      if (p.area !== undefined) dbPatch.area = p.area;
      if (p.floor !== undefined) dbPatch.floor = p.floor;
      if (p.companyId !== undefined) dbPatch.company_id = p.companyId;
      if (p.suspended !== undefined) dbPatch.suspended = p.suspended;
      if (p.pending !== undefined) dbPatch.pending = p.pending;

      if (Object.keys(dbPatch).length === 0) return;

      const { data, error } = await supabase
        .from("profiles")
        .update(dbPatch)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Profile update failed:", error);
        throw new Error(error.message);
      }

      const updatedUser = profileToUser(data);

      setS((x) => ({
        ...x,
        users: x.users.map((u) =>
          u.id === id ? updatedUser : u
        ),
      }));

      if (authUser?.id === id) {
        setAuthUser(updatedUser);
      }
    },

    // Reject an account by suspending it.
    removeUser: async (id) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          pending: false,
          suspended: true,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Could not reject staff account:", error);
        throw new Error(error.message);
      }

      const updatedUser = profileToUser(data);

      setS((x) => ({
        ...x,
        users: x.users.map((u) =>
          u.id === id ? updatedUser : u
        ),
      }));
    },

    // Password change is not migrated yet.
    changePassword: () => "password_change_not_migrated",

    // Temporary local company creation.
    addCompany: (name, phone, areas) =>
      setS((x) => ({
        ...x,
        companies: [
          ...x.companies,
          {
            id: `c${Date.now()}`,
            name,
            phone,
            bkash: "",
            nagad: "",
            areas,
            active: true,
            prices: {
              newJar: 350,
              filterJar: 2150,
              filter: 1800,
            },
            bands: DEFAULT_BANDS,
          },
        ],
      })),

    // Temporary local company updates.
    updateCompany: (id, p) =>
      setS((x) => ({
        ...x,
        companies: x.companies.map((c) =>
          c.id === id ? { ...c, ...p } : c
        ),
      })),

    // Create a real customer order through the secure RPC.
    addOrder: async (o) => {
      if (!authUser) {
        throw new Error("Please log in before placing an order.");
      }

      const { error } = await supabase.rpc("create_customer_order", {
        p_company_id: o.companyId,
        p_item: o.item,
        p_qty: o.qty,
        p_slot: o.slot,
        p_pay: o.pay,
        p_trx_id: o.trxId ?? null,
        p_sender_phone: o.senderPhone ?? null,
        p_screenshot_path: o.screenshotPath ?? null,
      });

      if (error) {
        console.error("Order creation failed:", error);
        throw new Error(error.message);
      }

      await loadDatabaseData(authUser.id);
    },

    // Staff schedules an order and sets its ETA.
    sendEta: async (id, eta) => {
      const orderId = await getDatabaseOrderId(id);

      await runOrderRpc("update_order_status", {
        p_order_id: orderId,
        p_status: "Scheduled",
        p_eta: eta,
        p_rescheduled: false,
      });
    },

    // Customer confirms that the order has been received.
    markReceived: async (id) => {
      const orderId = await getDatabaseOrderId(id);

      await runOrderRpc("customer_confirm_order_received", {
        p_order_id: orderId,
      });
    },

    // Customer requests a new delivery time.
    reschedule: async (id, slot) => {
      const orderId = await getDatabaseOrderId(id);

      await runOrderRpc("customer_reschedule_order", {
        p_order_id: orderId,
        p_slot: slot,
      });
    },

    // Staff completes an order.
    complete: async (id, _byUserId) => {
      const orderId = await getDatabaseOrderId(id);

      await runOrderRpc("update_order_status", {
        p_order_id: orderId,
        p_status: "Completed",
        p_eta: null,
        p_rescheduled: false,
      });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
