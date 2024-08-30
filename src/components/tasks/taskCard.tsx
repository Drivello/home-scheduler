import React, { useState } from "react";
import { Task } from "../../core/entities/task";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { TaskService } from "../../infrastructure/services/taskService";
import { TaskRepository } from "../../infrastructure/repositories/taskRepository";

interface TaskCardProps {
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
}

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdated }) => {
    const [completed, setCompleted] = useState(task.status === "completed");

    const handleCheckboxChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const isChecked = event.target.checked;
        setCompleted(isChecked);

        try {
            const updatedTask: Task = {
                ...task,
                status: isChecked ? "completed" : "pending",
            };
            await taskService.updateTask(updatedTask);
            onTaskUpdated(updatedTask);
        } catch (error) {
            console.error("Error updating task status:", error);
            setCompleted(task.status === "completed");
        }
    };

    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                {task.description && (
                    <Typography variant="body2">{task.description}</Typography>
                )}
                {task.dueDate && (
                    <Typography variant="body2">
                        Fecha de vencimiento:{" "}
                        {task.dueDate.toDate().toLocaleDateString()}
                    </Typography>
                )}
                <Typography variant="body2">Estado: {task.status}</Typography>
            </CardContent>
            <CardActions>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                    }
                    label="Completada"
                />
            </CardActions>
        </Card>
    );
};

export default TaskCard;
