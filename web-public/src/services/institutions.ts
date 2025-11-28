import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Institution {
  id?: string;
  name: string;
  type: "school" | "college" | "university" | "coaching" | "society" | "vocational" | "preschool" | "online" | "special";
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  board?: string;
  affiliation?: string;
  established?: number;
  rating: number;
  reviewCount: number;
  etiScore: number;
  fees?: Record<string, string>;
  facilities?: string[];
  courses?: string[];
  achievements?: string[];
  images?: string[];
  status: "pending" | "verified" | "rejected";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION = "institutions";

// Get all institutions with optional filters
export async function getInstitutions(filters?: {
  type?: string;
  city?: string;
  state?: string;
  status?: string;
  limitCount?: number;
  lastDoc?: DocumentSnapshot;
}) {
  let q = query(collection(db, COLLECTION));

  if (filters?.type && filters.type !== "all") {
    q = query(q, where("type", "==", filters.type));
  }
  if (filters?.city) {
    q = query(q, where("city", "==", filters.city));
  }
  if (filters?.state) {
    q = query(q, where("state", "==", filters.state));
  }
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status));
  }

  q = query(q, orderBy("rating", "desc"));

  if (filters?.limitCount) {
    q = query(q, limit(filters.limitCount));
  }
  if (filters?.lastDoc) {
    q = query(q, startAfter(filters.lastDoc));
  }

  const snapshot = await getDocs(q);
  const institutions: Institution[] = [];
  snapshot.forEach((doc) => {
    institutions.push({ id: doc.id, ...doc.data() } as Institution);
  });

  return {
    institutions,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

// Get single institution by ID
export async function getInstitution(id: string): Promise<Institution | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Institution;
  }
  return null;
}

// Get top rated institutions
export async function getTopInstitutions(count: number = 6) {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "verified"),
    orderBy("rating", "desc"),
    limit(count)
  );

  const snapshot = await getDocs(q);
  const institutions: Institution[] = [];
  snapshot.forEach((doc) => {
    institutions.push({ id: doc.id, ...doc.data() } as Institution);
  });

  return institutions;
}

// Search institutions
export async function searchInstitutions(searchTerm: string) {
  // Note: Firestore doesn't support full-text search natively
  // For production, use Algolia, Elasticsearch, or Firebase Extensions
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "verified"),
    orderBy("name"),
    limit(20)
  );

  const snapshot = await getDocs(q);
  const institutions: Institution[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Institution;
    if (
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.city.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      institutions.push({ id: doc.id, ...data });
    }
  });

  return institutions;
}

// Add new institution (admin only)
export async function addInstitution(institution: Omit<Institution, "id">) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...institution,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update institution (admin only)
export async function updateInstitution(id: string, data: Partial<Institution>) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete institution (admin only)
export async function deleteInstitution(id: string) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

// Get institution stats
export async function getInstitutionStats() {
  const types = ["school", "college", "university", "coaching", "society", "vocational", "preschool", "online"];
  const stats: Record<string, number> = { total: 0 };

  for (const type of types) {
    const q = query(
      collection(db, COLLECTION),
      where("type", "==", type),
      where("status", "==", "verified")
    );
    const snapshot = await getDocs(q);
    stats[type] = snapshot.size;
    stats.total += snapshot.size;
  }

  return stats;
}
