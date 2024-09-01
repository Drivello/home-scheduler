import { Home } from "@/core/entities/home";
import { Task } from "@/core/entities/task";

import { BasicRepository } from "@/core/ports/basicRepositoryInterface";

export class HomeService {
    constructor(private homeRepository: BasicRepository<Home>) {}

    async getHomes(): Promise<Home[]> {
        return this.homeRepository.getAll();
    }

    async getHomeById(id: string): Promise<Home | null> {
        return this.homeRepository.getById(id);
    }

    async addHome(home: Home): Promise<Home | null> {
        home.id = "";
        home.tasks = [] as string[];
        return await this.homeRepository.create(home);
    }

    async updateHome(home: Home): Promise<Home | null> {
        await this.homeRepository.update(home);
        return await this.homeRepository.getById(home.id);
    }

    async deleteHome(id: string): Promise<void> {
        await this.homeRepository.delete(id);
    }

    async getHomeUsersEmailsById(id: string): Promise<string[]> {
        let home = await this.getHomeById(id);
        if (home === null) throw new Error("Home not found");
        return home !== null ? home.members : new Array<string>();
    }

    async deleteHomeTask(homeId: string, taskId: string): Promise<void> {
        let home = await this.getHomeById(homeId);
        if (home === null) throw new Error("Home not found");
        home.tasks = home.tasks.filter((task) => task !== taskId);
        await this.updateHome(home);
    }
}
