// src/components/tasks/TaskCard.tsx
import React, { useState } from "react";
import { Task, taskStatus } from "../../core/entities/task";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Checkbox,
    FormControlLabel,
    Box,
    IconButton,
    Collapse,
    Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TaskService } from "../../infrastructure/services/taskService";
import { TaskRepository } from "../../infrastructure/repositories/taskRepository";
import TaskForm from "./taskForm";

interface TaskCardProps {
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
    onTaskDeleted: (taskId: string) => void;
}

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onTaskUpdated,
    onTaskDeleted,
}) => {
    const [completed, setCompleted] = useState(task.status === "completed");
    const [expanded, setExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleCheckboxChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const isChecked = event.target.checked;
        setCompleted(isChecked);
        try {
            const updatedTask: Task = {
                ...task,
                status: isChecked ? taskStatus.completed : taskStatus.completed,
            };
            await taskService.updateTask(updatedTask);
            onTaskUpdated(updatedTask);
        } catch (error) {
            console.error("Error updating task status:", error);
            setCompleted(task.status === taskStatus.completed);
        }
    };

    const handleDeleteClick = async () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas eliminar esta tarea?"
        );
        if (confirmed) {
            try {
                await taskService.deleteTask(task.id);
                onTaskDeleted(task.id);
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCloseEditModal = () => {
        setEditMode(false);
    };

    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        onClick={handleExpandClick}
                        style={{ cursor: "pointer" }}
                    >
                        <Checkbox
                            checked={completed}
                            onChange={handleCheckboxChange}
                            color="primary"
                            sx={{ marginRight: 1 }}
                        />
                        <Typography variant="h6">{task.title}</Typography>
                    </Box>

                    <Box>
                        <IconButton onClick={handleEditClick} color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDeleteClick} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {task.description && (
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            {task.description}
                        </Typography>
                    )}
                    {task.dueDate && (
                        <Typography variant="body2">
                            Fecha de vencimiento:{" "}
                            {task.dueDate.toDate().toLocaleDateString()}
                        </Typography>
                    )}
                </Collapse>
            </CardContent>

            <Modal open={editMode} onClose={handleCloseEditModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <TaskForm task={task} submitMode="update" />
                </Box>
            </Modal>
        </Card>
    );
};

export default TaskCard;
