import TaskList from "@/components/tasks/taskList";
import { Task } from "@/core/entities/task";
import { homeService, taskService } from "@/infrastructure/services/services";
import { RootState } from "@/lib/reduxStore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HomePage: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const [homeTasks, setHomeTasks] = useState<Task[]>([]);
    const [personalTasks, setPersonalTasks] = useState<Task[]>([]);
    const [professionalTasks, setProfessionalTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const taskPromises: Promise<void>[] = [];
                if (currentUser.homeId) {
                    const homeData = await homeService.getHomeById(
                        currentUser.homeId
                    );

                    if (homeData && homeData.tasks.length > 0) {
                        taskPromises.push(
                            (async () => {
                                const tasks =
                                    await taskService.getMultipleTasks(
                                        homeData.tasks
                                    );

                                setHomeTasks(tasks);
                            })()
                        );
                    } else {
                        setHomeTasks([]);
                    }
                }
                if (
                    currentUser.personalTasks &&
                    currentUser.personalTasks.length > 0
                ) {
                    taskPromises.push(
                        (async () => {
                            const tasks = await taskService.getMultipleTasks(
                                currentUser.personalTasks
                            );
                            setPersonalTasks(tasks);
                        })()
                    );
                } else {
                    setPersonalTasks([]);
                }
                if (
                    currentUser.professionalTasks &&
                    currentUser.professionalTasks.length > 0
                ) {
                    taskPromises.push(
                        (async () => {
                            const tasks = await taskService.getMultipleTasks(
                                currentUser.professionalTasks
                            );
                            setProfessionalTasks(tasks);
                        })()
                    );
                } else {
                    setProfessionalTasks([]);
                }
                await Promise.all(taskPromises);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentUser]);

    useEffect(() => {}, [loading]);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!currentUser) {
        return <div>Por favor, inicia sesión para ver tus tareas.</div>;
    }

    return (
        <div>
            <h1>Hola, {currentUser.name}!</h1>

            <TaskList tasks={personalTasks} title="Tareas Personales" />
            <TaskList tasks={professionalTasks} title="Tareas Profesionales" />
            {currentUser.homeId ? (
                <TaskList tasks={homeTasks} title="Tareas de Hogar" />
            ) : (
                <div>No Home</div>
            )}
        </div>
    );
};

export default HomePage;
