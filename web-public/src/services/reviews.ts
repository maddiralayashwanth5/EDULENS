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
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Review {
  id?: string;
  institutionId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  title?: string;
  text: string;
  pros?: string[];
  cons?: string[];
  helpful: number;
  reported: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION = "reviews";

// Get reviews for an institution
export async function getReviews(institutionId: string, limitCount: number = 10) {
  const q = query(
    collection(db, COLLECTION),
    where("institutionId", "==", institutionId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  const reviews: Review[] = [];
  snapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() } as Review);
  });

  return reviews;
}

// Get single review
export async function getReview(id: string): Promise<Review | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Review;
  }
  return null;
}

// Add a review
export async function addReview(review: Omit<Review, "id">) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...review,
    helpful: 0,
    reported: false,
    status: "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update review
export async function updateReview(id: string, data: Partial<Review>) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete review
export async function deleteReview(id: string) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

// Mark review as helpful
export async function markHelpful(id: string) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const currentHelpful = docSnap.data().helpful || 0;
    await updateDoc(docRef, { helpful: currentHelpful + 1 });
  }
}

// Report review
export async function reportReview(id: string) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { reported: true });
}

// Get user's reviews
export async function getUserReviews(userId: string) {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const reviews: Review[] = [];
  snapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() } as Review);
  });

  return reviews;
}

// Get pending reviews (admin)
export async function getPendingReviews() {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const reviews: Review[] = [];
  snapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() } as Review);
  });

  return reviews;
}

// Approve review (admin)
export async function approveReview(id: string) {
  await updateReview(id, { status: "approved" });
}

// Reject review (admin)
export async function rejectReview(id: string) {
  await updateReview(id, { status: "rejected" });
}
