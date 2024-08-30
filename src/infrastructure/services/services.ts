import {
    homeRepository,
    taskRepository,
    userRepository,
} from "../repositories/repositories";
import { HomeService } from "./homeService";
import { TaskService } from "./taskService";
import { UserService } from "./userService";

const homeService = new HomeService(homeRepository);
const taskService = new TaskService(taskRepository);
const userService = new UserService(userRepository);

export { homeService, taskService, userService };
