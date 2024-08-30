import { Timestamp } from "@firebase/firestore";
import { User } from "./user";

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: Timestamp | undefined;
    taskType: "personal" | "professional" | "home";
    assignedTo?: Omit<User, "personalTasks" | "professionalTasks" | "homeId">[];
    homeId?: string;
    status: "pending" | "completed";
    createdBy: Omit<User, "personalTasks" | "professionalTasks" | "homeId">;
    recurrence?: "unique" | "daily" | "weekly" | "monthly";
}
