import { db } from "../../lib/firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";

import { Task } from "../../core/entities/task";
import { User } from "../../core/entities/user";
import { BasicRepository } from "@/core/ports/basicRepositoryInterface";

const taskCollection = collection(db, "tasks");

export class TaskRepository implements BasicRepository<Task> {
    async getAll(): Promise<Task[]> {
        try {
            const querySnapshot = await getDocs(taskCollection);
            const tasks: Task[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const task: Task = {
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    dueDate: data.dueDate as Timestamp,
                    taskType: data.taskType,
                    assignedTo: data.assignedTo.map(
                        (userId: string) => ({ id: userId } as User)
                    ),
                    homeId: data.homeId,
                    status: data.status,
                    createdBy: data.createdBy,
                    recurrence: data.recurrence,
                };
                tasks.push(task);
            });

            return tasks;
        } catch (e) {
            console.error("Error getting tasks: ", e);
            throw e;
        }
    }

    async getById(id: string): Promise<Task | null> {
        try {
            const docRef = doc(db, "tasks", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Task;
            }
            return null;
        } catch (e) {
            console.error("Error getting task: ", e);
            throw e;
        }
    }

    async create(task: Task): Promise<Task> {
        const { id, ...taskWithoutId } = task;
        try {
            const docRef = await addDoc(taskCollection, taskWithoutId);

            return { id: docRef.id, ...taskWithoutId };
        } catch (e) {
            console.error("Error adding task: ", e);
            throw e;
        }
    }

    async update(task: Task): Promise<void> {
        const { id, ...taskWithoutId } = task;
        try {
            const docRef = doc(db, "tasks", task.id);

            await updateDoc(docRef, taskWithoutId);
        } catch (e) {
            console.error("Error updating task: ", e);
            throw e;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, "tasks", id);
            await deleteDoc(docRef);
        } catch (e) {
            console.error("Error deleting task: ", e);
            throw e;
        }
    }
}
