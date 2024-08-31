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
        let taskData = {
            ...task,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo,
            createdBy: {
                id: task.createdBy.id,
                name: task.createdBy.name,
                email: task.createdBy.email,
            },
            recurrence: task.recurrence,
        };
        if (taskData.dueDate === undefined) delete taskData.dueDate;
        return await this.taskRepository.create(taskData);
    }

    async updateTask(task: Task): Promise<void> {
        await this.taskRepository.update(task);
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }

    async getMultipleTasks(tasks: string[]): Promise<Task[]> {
        const taskPromises = [];
        try {
            for (const taskId of tasks) {
                const taskPromise = this.getTaskById(taskId);
                taskPromises.push(taskPromise);
            }
            const results = await Promise.all(taskPromises);
            return results.filter(
                (result) => result !== null && result !== undefined
            );
        } catch (error) {
            console.error("error obtaining tasks: ", error);
            return [];
        }
    }
}
