import { Task, taskTypeEnum, taskStatus, taskRecurrency } from "./task";
import { Timestamp } from "@firebase/firestore";
import { User } from "./user";

export class TaskBuilder {
    private id: string = "";
    private title: string = "";
    private description?: string;
    private dueDate?: Timestamp | undefined;
    private taskType: taskTypeEnum = taskTypeEnum.personal;

    private homeId?: string;
    private status: taskStatus = taskStatus.pending;
    private createdBy: Omit<
        User,
        "personalTasks" | "professionalTasks" | "homeId"
    >;
    private recurrence: taskRecurrency = taskRecurrency.unique;

    constructor(
        createdBy: Omit<User, "personalTasks" | "professionalTasks" | "homeId">
    ) {
        this.createdBy = createdBy;
    }

    setId(id: string): TaskBuilder {
        this.id = id;
        return this;
    }

    setTitle(title: string): TaskBuilder {
        this.title = title;
        return this;
    }

    setDescription(description: string): TaskBuilder {
        this.description = description;
        return this;
    }

    setDueDate(dueDate: Timestamp | undefined): TaskBuilder {
        this.dueDate = dueDate;
        return this;
    }

    setTaskType(taskType: taskTypeEnum): TaskBuilder {
        this.taskType = taskType;
        return this;
    }



    setHomeId(homeId: string): TaskBuilder {
        this.homeId = homeId;
        return this;
    }

    setStatus(status: taskStatus): TaskBuilder {
        this.status = status;
        return this;
    }

    setRecurrence(recurrence: taskRecurrency): TaskBuilder {
        this.recurrence = recurrence;
        return this;
    }

    build(): Task {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            taskType: this.taskType,

            homeId: this.homeId,
            status: this.status,
            createdBy: this.createdBy,
            recurrence: this.recurrence,
        };
    }
}
