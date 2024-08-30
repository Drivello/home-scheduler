import { User } from "../../core/entities/user";
import { db } from "../../lib/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import { UserRepositoryInterface } from "@/core/ports/userRepositoryInterface";

const usersCollection = collection(db, "users");

export class UserRepository implements UserRepositoryInterface {
    async getAll(): Promise<User[]> {
        try {
            const querySnapshot = await getDocs(usersCollection);
            return querySnapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as User)
            );
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    }

    async getById(id: string): Promise<User | null> {
        try {
            const userDoc = await getDoc(doc(db, "users", id));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() } as User;
            }
            return null;
        } catch (error) {
            console.error(`Error getting user by ID (${id}):`, error);
            throw error;
        }
    }

    async create(user: User): Promise<User> {
        const { id, ...userWithoutID } = user;
        try {
            let docRef = await addDoc(usersCollection, userWithoutID);

            return { id: docRef.id, ...userWithoutID };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async update(user: User): Promise<void> {
        const { id, ...userWithoutId } = user;
        try {
            const userRef = doc(db, "users", user.id);

            await updateDoc(userRef, userWithoutId);
        } catch (error) {
            console.error(`Error updating user (${user.id}):`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, "users", id));
        } catch (error) {
            console.error(`Error deleting user by ID (${id}):`, error);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<User | null> {
        try {
            const q = query(usersCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                return { id: userDoc.id, ...userDoc.data() } as User;
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error getting user by email (${email}):`, error);
            throw error;
        }
    }
}
