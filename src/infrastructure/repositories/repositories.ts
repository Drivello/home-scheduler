import { HomeRepository } from "./homeRepository";
import { TaskRepository } from "./taskRepository";
import { UserRepository } from "./userRepository";

const homeRepository = new HomeRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();

export { homeRepository, taskRepository, userRepository}