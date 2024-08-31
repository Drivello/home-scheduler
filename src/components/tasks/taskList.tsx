// src/components/tasks/TaskList.tsx
import React, { useState } from "react";
import { Task } from "../../core/entities/task";
import { Typography, IconButton, Box } from "@mui/material";
import TaskCard from "./taskCard";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TaskListProps {
    tasks: Task[];
    title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
    const [taskList, setTaskList] = useState<Task[]>(tasks);
    const [isExpanded, setIsExpanded] = useState<boolean>(true); // Nuevo estado para controlar si la lista está expandida

    const handleTaskUpdated = (updatedTask: Task) => {
        setTaskList((prevTasks) =>
            prevTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    const onTaskDeleted = (taskDeletedId: string) => {
        setTaskList((taskList) =>
            taskList.filter((task) => task.id !== taskDeletedId)
        );
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <IconButton onClick={toggleExpand}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            {isExpanded && // Mostrar la lista de tareas solo si isExpanded es verdadero
                (taskList.length === 0 ? (
                    <Typography variant="body1">
                        No hay tareas disponibles.
                    </Typography>
                ) : (
                    taskList.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onTaskUpdated={handleTaskUpdated}
                            onTaskDeleted={onTaskDeleted}
                        />
                    ))
                ))}
        </div>
    );
};

export default TaskList;
