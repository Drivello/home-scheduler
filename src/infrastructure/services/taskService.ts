import { Task } from "@/core/entities/task";
import { BasicRepository } from "@/core/ports/basicRepositoryInterface";
import { Timestamp } from "@firebase/firestore";

export class TaskService {
    constructor(private taskRepository: BasicRepository<Task>) {}

    async getTasks(): Promise<Task[]> {
        return this.taskRepository.getAll();
    }

    async getTaskById(id: string): Promise<Task | null> {
        return this.taskRepository.getById(id);
    }

    async addTask(task: Task): Promise<Task | null> {
        const taskData = {
            ...task,
            dueDate: task.dueDate
                ? Timestamp.fromDate(task.dueDate.toDate())
                : null,
            assignedTo: task.assignedTo,
            createdBy: {
                id: task.createdBy.id,
                name: task.createdBy.name,
                email: task.createdBy.email,
            },
            recurrence: task.recurrence ?? "unique",
        };
        return await this.taskRepository.create(taskData);
    }

    async updateTask(user: Task): Promise<void> {
        await this.taskRepository.update(user);
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }
}
