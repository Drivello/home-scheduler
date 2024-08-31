import { Task } from "@/core/entities/task";

import { TaskService } from "@/infrastructure/services/taskService";
import { UserService } from "@/infrastructure/services/userService";
import { HomeService } from "@/infrastructure/services/homeService";
import { homeService, taskService, userService } from "@/infrastructure/services/services";

interface AddTaskUseCaseProps {
    taskService: TaskService;
    userService: UserService;
    homeService: HomeService;
}

class AddTaskUseCase {
    private taskService: TaskService;
    private userService: UserService;
    private homeService: HomeService;

    constructor({
        taskService,
        userService,
        homeService,
    }: AddTaskUseCaseProps) {
        this.taskService = taskService;
        this.userService = userService;
        this.homeService = homeService;
    }

    async execute(newTask: Task): Promise<void> {
        try {
            if (
                newTask !== null &&
                newTask.assignedTo &&
                newTask.assignedTo.length > 0
            ) {
                for (const assignedUser of newTask.assignedTo) {
                    const user = await this.userService.getUserById(
                        assignedUser.id
                    );
                    if (user === null) throw new Error("User not found");

                    const createdTask = await this.taskService.addTask(newTask);

                    if (createdTask === null)
                        throw new Error("Task was not created");

                    switch (createdTask.taskType) {
                        case "personal":
                            user!.personalTasks.push(createdTask.id);
                            await this.userService.updateUser(user!);
                            break;

                        case "professional":
                            user!.professionalTasks.push(createdTask.id);
                            await this.userService.updateUser(user!);
                            break;

                        case "home":
                            if (user.homeId === "") {
                                // TODO: We should do a connection to allow the user to set his home before failing
                                throw new Error(
                                    "User doesnt have a home set yet"
                                );
                            }
                            const home = await this.homeService.getHomeById(
                                user.homeId
                            );
                            home!.tasks.push(createdTask.id);
                            await this.homeService.updateHome(home!);
                            break;

                        default:
                            throw new Error("Task doesnt have a allowed type");
                    }
                }
            }
        } catch (error) {
            console.error("Error adding task: ", error);
            throw error;
        }
    }
}

const addTaskUseCase = new AddTaskUseCase({
    taskService,
    userService,
    homeService,
});

export default addTaskUseCase;
