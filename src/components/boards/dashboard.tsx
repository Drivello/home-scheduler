import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import Link from "next/link";
import { Button } from "@mui/material";

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
        return <p>Por favor, inicia sesión para acceder al Dashboard.</p>;
    }

    return (
        <div>
            <h2>Bienvenido, {user.name}!</h2>

            {!user.homeId ? (
                <div>
                    <p>No estás en ningún hogar actualmente.</p>
                    <Link href="/create-home">
                        <Button variant="contained" color="primary">
                            Crear Hogar
                        </Button>
                    </Link>
                    <Link href="/join-home">
                        <Button variant="contained" color="secondary">
                            Unirse a un Hogar
                        </Button>
                    </Link>
                </div>
            ) : (
                <div>
                    <p>Tu ID de Hogar: {user.homeId}</p>
                    <Button
                        variant="contained"
                        onClick={() =>
                            navigator.clipboard.writeText(user.homeId || "")
                        }
                    >
                        Copiar ID del Hogar
                    </Button>
                    <Link href="/leave-home">
                        <Button variant="contained" color="secondary">
                            Salir del Hogar
                        </Button>
                    </Link>
                    <Link href="/tasks">
                        <Button variant="contained" color="primary">
                            Ver Tareas
                        </Button>
                    </Link>
                </div>
            )}

            <Link href="/profile">
                <Button variant="contained">Ver Perfil</Button>
            </Link>
        </div>
    );
};

export default Dashboard;
