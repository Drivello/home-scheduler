
export interface BasicRepository<Type> {
    getAll(): Promise<Type[]>;
    getById(id: string): Promise<Type | null>;
    create(entity: Type): Promise<Type | null>;
    update(entity: Type): Promise<void>;
    delete(id: string): Promise<void>;
}
