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
            title,
            description,
            dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
            taskType,
            assignedTo: [{ id: user.id, name: user.name, email: user.email }],
            homeId: user.homeId,
            status: "pending",
            createdBy: { id: user.id, name: user.name, email: user.email },
            recurrence,
        };

        try {
            await addTaskUseCase.execute(newTask);
            //TODO: add alert if task is created successfully
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label>Due Date:</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div>
                <label>Task Type:</label>
                <select
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
                    <option value="personal">Personal</option>
                    <option value="professional">Professional</option>
                    <option value="home">Home</option>
                </select>
            </div>
            <div>
                <label>Recurrence:</label>
                <select
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
                    <option value="unique">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Task"}
            </button>
        </form>
    );
};

export default AddTaskForm;
