import { Timestamp } from "@firebase/firestore";
import { User } from "./user";

export enum taskTypeEnum {
    personal = "personal",
    professional = "professional",
    home = "home",
}

export enum taskStatus {
    pending = "pending",
    completed = "completed",
}

export enum taskRecurrency {
    unique = "unique",
    daily = "daily",
    weekly = "weekly",
    monthly = "monthly",
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: Timestamp | undefined;
    taskType:
        | taskTypeEnum.personal
        | taskTypeEnum.professional
        | taskTypeEnum.home;
    assignedTo?: Omit<User, "personalTasks" | "professionalTasks" | "homeId">[];
    homeId?: string;
    status: taskStatus.pending | taskStatus.completed;
    createdBy: Omit<User, "personalTasks" | "professionalTasks" | "homeId">;
    recurrence?:
        | taskRecurrency.unique
        | taskRecurrency.daily
        | taskRecurrency.weekly
        | taskRecurrency.monthly;
}

