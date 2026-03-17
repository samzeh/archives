import { auth, db } from "./firebase";
import { doc, setDoc, deleteDoc, getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, EmailAuthProvider, 
  reauthenticateWithCredential, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  getAuth
 } from "firebase/auth";
import type { User } from "firebase/auth";
import type { ProfileBook } from "../type/books";


export async function signup (email: string, password: string, username: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {username, email})
  return user;
}

export async function login(identifier: string, password: string): Promise<User> {
  let email = identifier;
  if (!identifier.includes("@")) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", identifier));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }
    email = querySnapshot.docs[0].data().email;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}


export async function logout() {
  try {
    await signOut(auth);
  } catch (err: any) {
    console.error("Logout error:", err.message);
  }
}

export async function deleteAccount(password: string) {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user!.email!, password);
  try {
    await reauthenticateWithCredential(user!, credential);
    await deleteDoc(doc(db, "users", user!.uid));
    await user!.delete();
  } catch (err: any) {
    console.error("Delete account error:", err.message);
  }
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export function isLoggedIn(): Promise<boolean> {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

export function getCurrentUserId(): string | null {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

export async function addBookToProfile(userId: string, book: ProfileBook) {
  const bookRef = doc(db, "users", userId, "saved_books", String(book.book_id));
  await setDoc(bookRef, {
    book_id: book.book_id,
    your_ratings: book.your_ratings,
    comment: book.comment,
    status: book.status
  }, { merge: true })
}

export async function removeBookFromProfile(userId: string, bookId: number) {
  const bookRef = doc(db, "users", userId, "saved_books", String(bookId));
  await deleteDoc(bookRef);
}

export async function addComment(userId: string, bookId: number, comment: string) {
  const commentRef = doc(db, "users", userId, "saved_books", String(bookId));
  await setDoc(commentRef, { comment }, { merge: true });
}

export async function addRating(userId: string, bookId: string, rating: number) {
  const bookRef = doc(db, "users", userId, "saved_books", String(bookId));
  await setDoc(bookRef, { your_ratings: rating}, { merge: true });
}