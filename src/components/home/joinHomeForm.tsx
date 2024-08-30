import joinHomeUseCase from "@/core/use-cases/joinHomeUseCase";
import { RootState, setUser } from "@/lib/reduxStore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface JoinHomeFormProps {
    onJoinHome: () => Promise<void>;
}

const JoinHomeForm: React.FC<JoinHomeFormProps> = ({ onJoinHome }) => {
    const [homeId, setHomeId] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {}, [dispatch]);

    const handleJoin = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const updatedUser = await joinHomeUseCase.execute({ homeId, user });

            if (updatedUser !== null) dispatch(setUser(updatedUser));
            onJoinHome();
        } catch (error) {
            console.error("Error joining home:", error);
            alert(
                "Error al unirse al hogar. Por favor, verifica el ID y vuelve a intentarlo."
            );
        } finally {
            setLoading(false);
            setHomeId("");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                placeholder="Ingrese el ID del hogar"
                disabled={loading}
            />
            <button onClick={handleJoin} disabled={loading}>
                {loading ? "Uniéndose..." : "Unirse al Hogar"}
            </button>
        </div>
    );
};

export default JoinHomeForm;
