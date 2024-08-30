// src/core/ports/userRepositoryInterface.ts
import { BasicRepository } from "./basicRepositoryInterface";
import { User } from "../entities/user";

export interface UserRepositoryInterface extends BasicRepository<User> {
    getByEmail(email: string): Promise<User | null>;
}
