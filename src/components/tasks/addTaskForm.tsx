import TaskForm from "@/components/tasks/taskForm";
import { TaskBuilder } from "@/core/entities/taskBuilder";
import { RootState } from "@/lib/reduxStore";
import React from "react";
import { useSelector } from "react-redux";

const AddTaskForm: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) return <div>Loading user data...</div>;

    const newTask = new TaskBuilder({
        id: user.id,
        name: user.name,
        email: user.email,
    }).build();

    return (
        <div>
            <TaskForm task={newTask} submitMode="create" />
        </div>
    );
};

export default AddTaskForm;
