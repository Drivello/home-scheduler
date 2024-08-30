import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setUser } from "@/lib/reduxStore";

import { GenerateHomeUseCase } from "@/core/use-cases/generateHomeUseCase";
import { homeService, userService } from "@/infrastructure/services/services";

const generateHome = new GenerateHomeUseCase(homeService, userService);

const CreateHomeForm: React.FC<{ onHomeCreated: () => void }> = ({
    onHomeCreated,
}) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {}, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);

        try {
            const updatedUser = await generateHome.execute({
                homeName: name,
                user,
            });

            if (updatedUser !== null) dispatch(setUser(updatedUser));
            onHomeCreated();
        } catch (error) {
            console.error("Error creating home:", error);
        } finally {
            setLoading(false);
            setName("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Home Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading || !user}>
                {loading ? "Creating..." : "Create Home"}
            </button>
        </form>
    );
};

export default CreateHomeForm;
