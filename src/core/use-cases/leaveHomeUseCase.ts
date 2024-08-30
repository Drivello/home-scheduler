import { HomeService } from "@/infrastructure/services/homeService";
import { UserService } from "@/infrastructure/services/userService";
import { User } from "@/core/entities/user";
import { homeService, userService } from "@/infrastructure/services/services";

interface LeaveHomeUseCaseParams {
    user: User;
}

export class LeaveHomeUseCase {
    constructor(
        private homeService: HomeService,
        private userService: UserService
    ) {}

    async execute({ user }: LeaveHomeUseCaseParams): Promise<User | null> {
        if (!user.homeId) {
            throw new Error("User is not part of any home.");
        }

        const home = await this.homeService.getHomeById(user.homeId);
        if (!home) {
            throw new Error("Home not found.");
        }

        const updatedMembers = home.members.filter(
            (email) => email !== user.email
        );

        if (updatedMembers.length === 0) {
            await this.homeService.deleteHome(home.id);
        } else {
            await this.homeService.updateHome({
                ...home,
                members: updatedMembers,
            });
        }

        return await this.userService.updateUser({ ...user, homeId: "" });
    }
}

const leaveHomeUseCase = new LeaveHomeUseCase(homeService, userService);

export default leaveHomeUseCase;
