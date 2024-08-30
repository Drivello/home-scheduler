import { HomeService } from "@/infrastructure/services/homeService";
import { User } from "../entities/user";
import { UserService } from "@/infrastructure/services/userService";
import { homeService, userService } from "@/infrastructure/services/services";

interface JoinHomeInput {
    homeId: string;
    user: User;
}

class JoinHomeUseCase {
    private homeService: HomeService;
    private userService: UserService;

    constructor(homeService: HomeService, userService: UserService) {
        this.homeService = homeService;
        this.userService = userService;
    }

    public async execute(input: JoinHomeInput): Promise<User | null> {
        const { homeId, user } = input;

        const home = await this.homeService.getHomeById(homeId);
        if (!home) {
            throw new Error("El hogar no existe.");
        }

        if (!home.members.some((email) => email === user.email)) {
            home.members.push(user.email);

            await this.homeService.updateHome(home);
        }

        return await this.userService.updateUser({ ...user, homeId: homeId });
    }
}

const joinHomeUseCase = new JoinHomeUseCase(homeService, userService);

export default joinHomeUseCase;
