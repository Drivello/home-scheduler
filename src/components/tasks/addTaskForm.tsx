import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import { Task } from "@/core/entities/task";
import { Timestamp } from "@firebase/firestore";
import { AddTaskUseCase } from "@/core/use-cases/addTaskUseCase";
import {
    homeService,
    taskService,
    userService,
} from "@/infrastructure/services/services";
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

const addTaskUseCase = new AddTaskUseCase({
    taskService,
    userService,
    homeService,
});

const AddTaskForm: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [taskType, setTaskType] = useState<
        "personal" | "professional" | "home"
    >("personal");
    const [recurrence, setRecurrence] = useState<
        "daily" | "weekly" | "monthly" | "unique"
    >("unique");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) return;

        const newTask: Task = {
            id: "",
            title: title ?? "",
            description: description ?? "",
            dueDate: dueDate
                ? Timestamp.fromDate(new Date(dueDate))
                : undefined,
            taskType,
            assignedTo: [{ id: user.id, name: user.name, email: user.email }],
            homeId: user.homeId ?? "",
            status: "pending",
            createdBy: { id: user.id, name: user.name, email: user.email },
            recurrence: recurrence ?? "unique",
        };

        try {
            await addTaskUseCase.execute(newTask);
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setLoading(false);
            setTitle("");
            setDescription("");
            setDueDate("");
            setRecurrence("unique");
        }
    };

    if (!user) {
        return <p>Por favor, inicia sesión para añadir tareas.</p>;
    }

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
                                setTaskType(
                                    e.target.value as
                                        | "personal"
                                        | "professional"
                                        | "home"
                                )
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
                                setRecurrence(
                                    e.target.value as
                                        | "daily"
                                        | "weekly"
                                        | "monthly"
                                        | "unique"
                                )
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
                        {loading ? "Adding..." : "Add Task"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddTaskForm;
