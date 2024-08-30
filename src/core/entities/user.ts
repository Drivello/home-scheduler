import { Task } from "./task";

export interface User {
    id: string;
    name: string;
    email: string;
    homeId: string;
    personalTasks: Task[];
    professionalTasks: Task[];
}
