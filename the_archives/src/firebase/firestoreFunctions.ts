import { auth, db } from "./firebase";
import { doc, setDoc, deleteDoc, getDocs, collection, query, where, getDoc, runTransaction, updateDoc } from "firebase/firestore";
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
  const normalizedUsername = username.trim().toLowerCase();
  
  if (!normalizedUsername) {
    throw new Error("Username cannot be empty");
  }

    let user: User | null = null;

    try {

      await runTransaction(db, async (transaction) => {
        const usernameRef = doc(db, "usernames", normalizedUsername);
        const usernameDoc = await transaction.get(usernameRef);

        if (usernameDoc.exists()) {
          throw new Error("Username already taken");
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        user = userCredential.user;

        const userRef = doc(db, "users", user.uid);

        transaction.set(usernameRef, {
          uid: user.uid,
          createdAt: new Date()
        });

        transaction.set(userRef, {
          username: normalizedUsername,
          email: email,
          createdAt: new Date()
        });
      }
    );

    if (!user) throw new Error("User creation failed");

    return user;

  } catch (error) {
    // Cleanup if auth user was created
    if (user) {
      await (user as User).delete().catch(() => {});
    }
    throw error;
  }
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Logout error:", err.message);
    } else {
      console.error("Logout error:", err);
    }
  }
}

export async function deleteAccount(password: string) {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user!.email!, password);
  try {
    await reauthenticateWithCredential(user!, credential);

    const userDoc = await getDoc(doc(db, "users", user!.uid));
    const username = userDoc.data()?.username;

    if (username) {
      await deleteDoc(doc(db, "usernames", username));
    }

    await deleteDoc(doc(db, "users", user!.uid));
    await user!.delete();

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Delete account error:", err.message);
    } else {
      console.error("Delete account error:", err);
    }
    throw err;
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

export async function getRating(userId: string, bookId: number): Promise<number> {
  const bookRef = doc(db, "users", userId, "saved_books", String(bookId));
  const bookDoc = await getDoc(bookRef);
  return bookDoc.exists() ? bookDoc.data().your_ratings : 0;
}

export async function getComment(userId: string, bookId: number): Promise<string> {
  const bookRef = doc(db, "users", userId, "saved_books", String(bookId));
  const bookDoc = await getDoc(bookRef);
  return bookDoc.exists() ? bookDoc.data().comment : '';
}

export async function getUserProfileBooks(userId: string): Promise<ProfileBook[]> {
  const booksRef = collection(db, "users", userId, "saved_books")
  const querySnapshot = await getDocs(booksRef)
  const books: ProfileBook[] = [];
  querySnapshot.forEach((doc) => {
    books.push(doc.data() as ProfileBook)
  })
  return books;
}

export async function getUsername(userId: string) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().username : null;
}

export async function changeUsername(userId: string, newUsername: string) {
  const normalizedUsername = newUsername.trim().toLowerCase();
  
  if (!normalizedUsername) {
    throw new Error("Username cannot be empty");
  }

  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", normalizedUsername);
    const usernameDoc = await transaction.get(usernameRef);
    
    if (usernameDoc.exists()) {
      throw new Error("Username already taken");
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await transaction.get(userRef);
    const oldUsername = userDoc.data()?.username;

    // delete old username reservation
    if (oldUsername) {
      const oldUsernameRef = doc(db, "usernames", oldUsername);
      transaction.delete(oldUsernameRef);
    }

    // reserve new username
    transaction.set(usernameRef, { uid: userId, createdAt: new Date() });

    // update user profile
    transaction.update(userRef, { username: normalizedUsername });
  });
}

export async function changeDisplayName(userId: string, displayName: string) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { displayName: displayName.trim() });
}

export async function getDisplayName(userId: string): Promise<string | null> {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.displayName ?? userDoc.data()?.username ?? null;
}