// src/components/tasks/TaskList.tsx
import React, { useState } from "react";
import { Task } from "../../core/entities/task";
import { Typography } from "@mui/material";
import TaskCard from "./taskCard";

interface TaskListProps {
    tasks: Task[];
    title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
    const [taskList, setTaskList] = useState<Task[]>(tasks);

    const handleTaskUpdated = (updatedTask: Task) => {
        setTaskList((prevTasks) =>
            prevTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {taskList.length === 0 ? (
                <Typography variant="body1">
                    No hay tareas disponibles.
                </Typography>
            ) : (
                taskList.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onTaskUpdated={handleTaskUpdated}
                    />
                ))
            )}
        </div>
    );
};

export default TaskList;
