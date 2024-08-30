import { HomeService } from "@/infrastructure/services/homeService";
import { User } from "../entities/user";
import { UserService } from "@/infrastructure/services/userService";
import { Home } from "../entities/home";

interface GenerateHomeParams {
    homeName: string;
    user: User;
}

export class GenerateHomeUseCase {
    constructor(
        private homeService: HomeService,
        private userService: UserService
    ) {}

    async execute(params: GenerateHomeParams): Promise<User | null> {
        const { homeName, user } = params;

        const newHome: Home = {
            id: "",
            name: homeName,
            members: [user.email],
            tasks: [],
        };

        try {
            const createdHome = await this.homeService.addHome(newHome);
            if (createdHome === null)
                throw new Error("Could not create a new home");
        
            return await this.userService.updateUser({
                ...user,
                homeId: createdHome.id,
            });
        } catch (error) {
            console.error("Error generating home and updating user:", error);
            throw error;
        }
    }
}
