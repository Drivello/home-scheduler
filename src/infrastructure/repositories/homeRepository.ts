import { db } from "../../lib/firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { BasicRepository } from "../../core/ports/basicRepositoryInterface";
import { Home } from "../../core/entities/home";
import { User } from "../../core/entities/user";
import { Task } from "../../core/entities/task";

const homeCollection = collection(db, "homes");

export class HomeRepository implements BasicRepository<Home> {
    async getAll(): Promise<Home[]> {
        try {
            const querySnapshot = await getDocs(homeCollection);
            const homes: Home[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const home: Home = {
                    id: doc.id,
                    name: data.name,
                    members: data.members.map(
                        (userId: string) => ({ id: userId } as User)
                    ),
                    tasks: data.tasks.map(
                        (taskId: string) => ({ id: taskId } as Task)
                    ),
                };
                homes.push(home);
            });

            return homes;
        } catch (e) {
            console.error("Error getting homes: ", e);
            throw e;
        }
    }

    async getById(id: string): Promise<Home | null> {
        try {
            const docRef = doc(db, "homes", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const home: Home = {
                    id: docSnap.id,
                    name: data.name,
                    members: data.members,
                    tasks: data.tasks,
                };
                return home;
            } else {
                return null;
            }
        } catch (e) {
            console.error("Error getting home: ", e);
            throw e;
        }
    }

    async create(home: Home): Promise<Home> {
        try {
            let { id, ...homeWithoutId } = home;

            let docRef = await addDoc(homeCollection, homeWithoutId);

            return { id: docRef.id, ...homeWithoutId };
        } catch (e) {
            console.error("Error adding home: ", e);
            throw e;
        }
    }

    async update(home: Home): Promise<void> {
        try {
            const docRef = doc(db, "homes", home.id);

            const updatedData = {
                name: home.name,
                members: home.members,
                tasks: home.tasks,
            };

            await updateDoc(docRef, updatedData);
        } catch (e) {
            console.error("Error updating home: ", e);
            throw e;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, "homes", id);
            await deleteDoc(docRef);
        } catch (e) {
            console.error("Error deleting home: ", e);
            throw e;
        }
    }
}
