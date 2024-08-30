import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CreateHomeForm from "@/components/home/createHomeForm";
import { RootState } from "../lib/reduxStore";

const CreateHomePage: React.FC = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);

    const handleHomeCreated = () => {
        alert("Hogar creado exitosamente.");
        router.replace("/");
    };

    if (!user) {
        return <p>Por favor, inicia sesión para crear un hogar.</p>;
    }

    return (
        <div>
            <h1>Crear un Nuevo Hogar</h1>
            <CreateHomeForm onHomeCreated={handleHomeCreated} />
        </div>
    );
};

export default CreateHomePage;
