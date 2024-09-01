import { Task, taskTypeEnum } from "@/core/entities/task";
import { TaskService } from "@/infrastructure/services/taskService";
import { UserService } from "@/infrastructure/services/userService";
import { HomeService } from "@/infrastructure/services/homeService";
import { User } from "../entities/user";
import {
    homeService,
    taskService,
    userService,
} from "@/infrastructure/services/services";

interface EditTaskUseCaseProps {
    taskService: TaskService;
    userService: UserService;
    homeService: HomeService;
}

export class EditTaskUseCase {
    private taskService: TaskService;
    private userService: UserService;
    private homeService: HomeService;

    constructor({
        taskService,
        userService,
        homeService,
    }: EditTaskUseCaseProps) {
        this.taskService = taskService;
        this.userService = userService;
        this.homeService = homeService;
    }

    async execute(updatedTask: Task, user: User): Promise<void> {
        try {
            if (updatedTask && updatedTask.id) {
                const originalTask = await this.taskService.getTaskById(
                    updatedTask.id
                );
                if (!originalTask)
                    throw new Error(
                        "[EditTask UseCase]: Original task not found"
                    );

                if (
                    updatedTask.taskType === taskTypeEnum.home &&
                    user.homeId === ""
                )
                    throw new Error(
                        "[EditTask UseCase]: Cannot change to home task without a home id"
                    );

                await this.taskService.updateTask(updatedTask);

                if (originalTask.taskType !== updatedTask.taskType) {
                    await this.handleTaskReassignment(
                        originalTask,
                        updatedTask
                    );
                }
            }
        } catch (error) {
            console.error("Error editing task: ", error);
            throw error;
        }
    }

    private async handleTaskReassignment(
        originalTask: Task,
        updatedTask: Task
    ) {
        // Remove task from old assignments
        await this.removeTaskFromAssignments(originalTask);

        // Add task to new assignments
        await this.addTaskToAssignments(updatedTask);
    }

    private async removeTaskFromAssignments(originalTask: Task) {
        switch (originalTask.taskType) {
            case taskTypeEnum.home:
                await this.homeService.deleteHomeTask(
                    originalTask.homeId!,
                    originalTask.id
                );
                break;
            case taskTypeEnum.personal:
                await this.userService.deletePersonalTask(
                    originalTask.createdBy.id,
                    originalTask.id
                );
                break;
            case taskTypeEnum.professional:
                await this.userService.deleteProfessionalTask(
                    originalTask.createdBy.id,
                    originalTask.id
                );
        }
    }

    private async addTaskToAssignments(updatedTask: Task) {
        
        let updatedUser = await this.userService.getUserById(
            updatedTask.createdBy.id
        );
        if (!updatedUser) throw new Error("Cannot reassing without a user");

        switch (updatedTask.taskType) {
            case taskTypeEnum.personal:
                updatedUser.personalTasks.push(updatedTask.id);

                await this.userService.updateUser(updatedUser);
                break;

            case taskTypeEnum.professional:
                updatedUser.professionalTasks.push(updatedTask.id);
                await this.userService.updateUser(updatedUser);
                break;

            case taskTypeEnum.home:
                if (updatedUser.homeId) {
                    const home = await this.homeService.getHomeById(
                        updatedUser.homeId
                    );
                    if (home) {
                        home.tasks.push(updatedTask.id);
                        await this.homeService.updateHome(home);
                    }
                }
                break;
        }
    }
}

const editTaskUseCase = new EditTaskUseCase({
    taskService,
    userService,
    homeService,
});

export default editTaskUseCase;
