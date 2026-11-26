export type ItemKey = "newJar" | "filterJar" | "filter";
export type PayMethod = "COD" | "bKash" | "Nagad";
export type Status = "Pending" | "Scheduled" | "Received" | "Completed";
export type Role = "student" | "staff" | "admin";
export type SlotKey = "asap" | "morning" | "afternoon" | "evening";

export type Band = { label: string; labelBn: string; min: number; max: number; fee: number };

export type Company = {
  id: string; name: string; phone: string; bkash: string; nagad: string;
  areas: string[]; active: boolean; prices: Record<ItemKey, number>; bands: Band[];
};

export type User = {
  id: string; role: Role; name: string; email: string; password: string; phone: string;
  studentId?: string; building?: string; area?: string; floor?: number;
  companyId?: string; suspended?: boolean; pending?: boolean;
};

export type Order = {
  id: string; companyId: string; customerId: string; customer: string; phone: string;
  building: string; floor: number; item: ItemKey; qty: number; total: number;
  slot: SlotKey; pay: PayMethod; trxId?: string; senderPhone?: string; screenshot?: string;
  status: Status; eta?: string; rescheduled?: boolean;
  completedBy?: string; completedAt?: string; createdAt: string;
};

export const ADMIN_CODE = "FW-ADMIN-2026"; // demo only

export const ITEMS: { key: ItemKey; en: string; bn: string }[] = [
  { key: "newJar", en: "New Jar", bn: "নতুন জার" },
  { key: "filterJar", en: "New Filter + Jar", bn: "নতুন ফিল্টার + জার" },
  { key: "filter", en: "New Filter", bn: "নতুন ফিল্টার" },
];

export const SLOTS: { key: SlotKey; en: string; bn: string }[] = [
  { key: "asap", en: "ASAP", bn: "যত দ্রুত সম্ভব" },
  { key: "morning", en: "Morning 9 AM – 12 PM", bn: "সকাল ৯টা – দুপুর ১২টা" },
  { key: "afternoon", en: "Afternoon 2 PM – 5 PM", bn: "বিকাল ২টা – ৫টা" },
  { key: "evening", en: "Evening 6 PM – 9 PM", bn: "সন্ধ্যা ৬টা – রাত ৯টা" },
];

export const ROLE_INFO: Record<Role, { emoji: string; en: string; bn: string; subEn: string; subBn: string }> = {
  student: { emoji: "🎓", en: "Student", bn: "শিক্ষার্থী", subEn: "Order water jars & filters", subBn: "পানির জার ও ফিল্টার অর্ডার করুন" },
  staff: { emoji: "🚴", en: "Staff", bn: "স্টাফ", subEn: "Water company employee", subBn: "পানির কোম্পানির কর্মী" },
  admin: { emoji: "🛠️", en: "Admin", bn: "অ্যাডমিন", subEn: "Platform owner", subBn: "প্ল্যাটফর্মের মালিক" },
};

export const DEFAULT_BANDS: Band[] = [
  { label: "Ground Floor", labelBn: "নিচতলা", min: 0, max: 0, fee: 40 },
  { label: "1st – 2nd Floor", labelBn: "১ম – ২য় তলা", min: 1, max: 2, fee: 45 },
  { label: "3rd – 4th Floor", labelBn: "৩য় – ৪র্থ তলা", min: 3, max: 4, fee: 50 },
  { label: "5th+ Floor", labelBn: "৫ম+ তলা", min: 5, max: 99, fee: 60 },
];

/* ---------- helpers ---------- */
export const itemLabel = (k: ItemKey, bn: boolean) => {
  const i = ITEMS.find((x) => x.key === k)!;
  return bn ? i.bn : i.en;
};
export const slotLabel = (k: SlotKey, bn: boolean) => {
  const s = SLOTS.find((x) => x.key === k)!;
  return bn ? s.bn : s.en;
};
const STATUS_BN: Record<Status, string> = {
  Pending: "অপেক্ষমাণ", Scheduled: "সময় নির্ধারিত", Received: "গ্রহণ করা হয়েছে", Completed: "সম্পন্ন",
};
export const statusLabel = (s: Status, bn: boolean) => (bn ? STATUS_BN[s] : s);
export const payLabel = (p: PayMethod, bn: boolean) =>
  p === "COD" ? (bn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery") : p;
export const etaText = (eta: string, bn: boolean) =>
  /^\d+$/.test(eta) ? (bn ? `${eta} মিনিটের মধ্যে` : `in ${eta} mins`) : eta;

export const floorFee = (bands: Band[], f: number) =>
  (bands.find((b) => f >= b.min && f <= b.max) ?? bands[bands.length - 1]).fee;
export const floorLabel = (f: number, bn = false) =>
  f === 0 ? (bn ? "নিচতলা" : "Ground") : bn ? `${f} তলা` : `Floor ${f}`;
export const feeRange = (bands: Band[]): [number, number] => {
  const fees = bands.map((b) => b.fee);
  return [Math.min(...fees), Math.max(...fees)];
};

export const dashboardPath = (r: Role) =>
  r === "student" ? "/student" : r === "staff" ? "/staff" : "/admin";

/* ---------- demo data ---------- */
export const INITIAL_COMPANIES: Company[] = [
  {
    id: "c1", name: "Aqua Fresh", phone: "01711000001", bkash: "01711000001", nagad: "01811000001",
    areas: ["Mirpur", "Kafrul"], active: true, prices: { newJar: 350, filterJar: 2150, filter: 1800 },
    bands: DEFAULT_BANDS,
  },
  {
    id: "c2", name: "Pure Drop BD", phone: "01911000002", bkash: "01911000002", nagad: "",
    areas: ["Mirpur", "Pallabi"], active: true, prices: { newJar: 320, filterJar: 2050, filter: 1750 },
    bands: DEFAULT_BANDS,
  },
  {
    id: "c3", name: "Blue Spring", phone: "01511000003", bkash: "", nagad: "",
    areas: ["Dhanmondi"], active: false, prices: { newJar: 380, filterJar: 2250, filter: 1900 },
    bands: DEFAULT_BANDS,
  },
];

export const INITIAL_USERS: User[] = [
  { id: "u-admin", role: "admin", name: "Platform Admin", email: "admin@filterwala.com", password: "admin123", phone: "01700000001" },
  { id: "u-staff1", role: "staff", name: "Karim (Aqua Fresh)", email: "staff@aqua.com", password: "staff123", phone: "01722222222", companyId: "c1" },
  { id: "u-staff2", role: "staff", name: "Salam (Pure Drop)", email: "staff@pure.com", password: "staff123", phone: "01733333333", companyId: "c2" },
  {
    id: "u-s1", role: "student", name: "Rafiq Hasan", email: "student@mail.com", password: "student123",
    phone: "01700000000", studentId: "2021-1-60-045", building: "Mess 12", area: "Road 5, Mirpur", floor: 3,
  },
];