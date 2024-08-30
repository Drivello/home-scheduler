import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/userRepositoryInterface";

export class UserService {
    constructor(private userRepository: UserRepositoryInterface) {}

    async getUsers(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.getByEmail(email);
    }

    async getUsersFromEmails(emails: string[]): Promise<User[]> {
        const promises = emails.map((email) => this.getUserByEmail(email));
        const results = (await Promise.all(promises)) as User[];
        return results.filter((user): user is User => user !== null);
    }

    async getOrCreateUser(user: User): Promise<void> {
        const userByEmail = await this.getUserByEmail(user.email);

        if (!userByEmail) await this.userRepository.create(user);
    }

    async updateUser(user: User): Promise<User | null> {
        await this.userRepository.update(user);
        return await this.userRepository.getByEmail(user.email);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
