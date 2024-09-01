import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import {
    Task,
    taskRecurrency,
    taskStatus,
    taskTypeEnum,
} from "@/core/entities/task";
import { Timestamp } from "@firebase/firestore";
import addTaskUseCase from "@/core/use-cases/addTaskUseCase";

import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
    Box,
} from "@mui/material";
import { useRouter } from "next/router";
import editTaskUseCase from "@/core/use-cases/editTaskUseCase";

interface TaskFormProps {
    task: Task;
    submitMode: string;
    onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, submitMode, onSuccess }) => {
    const router = useRouter();
    const buttonLabel = submitMode === "create" ? "Add Task" : "Update Task";
    const loadingButtonLabel =
        submitMode === "create" ? "Adding..." : "Updating...";
    const user = useSelector((state: RootState) => state.user.user);
    const [loading, setLoading] = useState(user === undefined);
    const [id, setId] = useState(task.id ?? "");
    const [title, setTitle] = useState(task.title ?? "");
    const [description, setDescription] = useState(task.description ?? "");
    const [dueDate, setDueDate] = useState(
        task.dueDate === undefined ? "" : task.dueDate.toString()
    );
    const [taskType, setTaskType] = useState<
        taskTypeEnum.personal | taskTypeEnum.professional | taskTypeEnum.home
    >(task.taskType ?? taskTypeEnum.personal);

    const [recurrence, setRecurrence] = useState<
        | taskRecurrency.unique
        | taskRecurrency.daily
        | taskRecurrency.weekly
        | taskRecurrency.monthly
    >(task.recurrence ?? taskRecurrency.unique);
    const [status, setStatus] = useState(task.status ?? "pending");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) return;

        const newTask: Task = {
            id,
            title,
            description,
            dueDate: dueDate
                ? Timestamp.fromDate(new Date(dueDate))
                : undefined,
            taskType,
            assignedTo:
                Array.isArray(task.assignedTo) && task.assignedTo?.length > 0
                    ? task.assignedTo
                    : [{ id: user?.id, name: user?.name, email: user?.email }],
            homeId: user.homeId ?? "",
            status,
            createdBy: task.createdBy ?? {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            recurrence,
        };

        try {
            switch (submitMode) {
                case "create":
                    await addTaskUseCase.execute(newTask);
                    break;
                case "update":
                    await editTaskUseCase.execute(newTask, user);
                    break;
                default:
                    console.error(submitMode + "Not implemented");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            switch (submitMode) {
                case "create":
                    setLoading(false);
                    setId("");
                    setTitle("");
                    setDescription("");
                    setDueDate("");
                    setTaskType(taskTypeEnum.personal);
                    setRecurrence(taskRecurrency.unique);
                    setStatus(taskStatus.pending);
                    alert("Task added successfully");
                    break;
                case "update":
                    alert("Task updated successfully");
                    router.replace("/");
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Task Type</InputLabel>
                        <Select
                            value={taskType}
                            onChange={(e) =>
                                setTaskType(e.target.value as taskTypeEnum)
                            }
                        >
                            <MenuItem value="personal">Personal</MenuItem>
                            <MenuItem value="professional">
                                Professional
                            </MenuItem>
                            <MenuItem value="home">Home</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Recurrence</InputLabel>
                        <Select
                            value={recurrence}
                            onChange={(e) =>
                                setRecurrence(e.target.value as taskRecurrency)
                            }
                        >
                            <MenuItem value="unique">None</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? loadingButtonLabel : buttonLabel}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TaskForm;
