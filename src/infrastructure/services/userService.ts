import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/userRepositoryInterface";

export class UserService {
    constructor(private userRepository: UserRepositoryInterface) {}

    async getUsers(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    async getUserById(id: string): Promise<User | null> {
        if (!id) throw new Error("[UserService - GetUserById]: ID is required")
        return await this.userRepository.getById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        if (!email) throw new Error("[UserService - GetUserByEmail]: Email is required")
        return await this.userRepository.getByEmail(email);
    }

    async getUsersFromEmails(emails: string[]): Promise<User[]> {
        if (emails.length === 0 ) throw new Error("[UserService - GetUsersFromEmails]: Provided array is empty")
        const promises = emails.map((email) => this.getUserByEmail(email));
        const results = (await Promise.all(promises)) as User[];
        return results.filter((user): user is User => user !== null);
    }

    async getOrCreateUser(user: User): Promise<void> {
        const userByEmail = await this.getUserByEmail(user.email);
        if (!userByEmail) await this.userRepository.create(user);
    }

    async updateUser(user: User): Promise<User | null> {
        if (!user || !user.id) throw new Error("[UserService - UpdateUser]: User ID is required")
        await this.userRepository.update(user);
        return await this.userRepository.getByEmail(user.email);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async deleteProfessionalTask(userId: string, taskId: string): Promise<void> {
        let user = await this.userRepository.getById(userId);
        if (user) user.professionalTasks = user?.professionalTasks.filter(task => task !== taskId)
        else throw new Error("[UserService - DeleteProfessionalTask]: User not found")
        await this.updateUser(user)
    }

    async deletePersonalTask(userId: string, taskId: string): Promise<void> {
        let user = await this.userRepository.getById(userId);
        if (user) user.personalTasks = user?.personalTasks.filter(task => task !== taskId)
        else throw new Error("[UserService - DeletePersonalTask]: User not found")
        await this.updateUser(user)
    }
}
