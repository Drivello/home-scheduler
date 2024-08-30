import TaskList from "@/components/tasks/taskList";
import { Task } from "@/core/entities/task";
import { homeService } from "@/infrastructure/services/services";
import { RootState } from "@/lib/reduxStore";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const HomePage: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const [homeTasks, setHomeTasks] = React.useState([] as Task[]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchHomeTasks = async () => {
            try {
                if (currentUser?.homeId) {
                    const homeData = await homeService.getHomeById(
                        currentUser.homeId
                    );
                    homeData
                        ? setHomeTasks(homeData.tasks)
                        : setHomeTasks([] as Task[]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) {
            setLoading(false);
        }
        fetchHomeTasks();
    }, [currentUser]);

    if (!currentUser) {
        setLoading(true);
    }

    return (
        <div>
            {loading ? (
                <div>Loading user data...</div>
            ) : (
                <div>
                    <h1>Hola, {currentUser!.name}!</h1>

                    <TaskList
                        tasks={currentUser!.personalTasks}
                        title="Tareas Personales"
                    />
                    <TaskList
                        tasks={currentUser!.professionalTasks}
                        title="Tareas Profesionales"
                    />
                    {currentUser!.homeId ? (
                        <TaskList tasks={homeTasks} title="Tareas de Hogar" />
                    ) : (
                        <div>No Home</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
