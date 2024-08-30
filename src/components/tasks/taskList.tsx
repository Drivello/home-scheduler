import React from "react";
import { Task } from "../../core/entities/task";
import { Card, CardContent, Typography } from "@mui/material"; 

interface TaskListProps {
    tasks: Task[];
    title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {tasks.length === 0 ? (
                <Typography variant="body1">
                    No hay tareas disponibles.
                </Typography>
            ) : (
                tasks.map((task) => (
                    <Card key={task.id} style={{ marginBottom: "16px" }}>
                        <CardContent>
                            <Typography variant="h6">{task.title}</Typography>
                            {task.description && (
                                <Typography variant="body2">
                                    {task.description}
                                </Typography>
                            )}
                            {task.dueDate && (
                                <Typography variant="body2">
                                    Fecha de vencimiento:{" "}
                                    {task.dueDate.toDate().toLocaleDateString()}
                                </Typography>
                            )}
                            <Typography variant="body2">
                                Estado: {task.status}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default TaskList;
