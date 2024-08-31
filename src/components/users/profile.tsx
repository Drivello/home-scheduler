import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, RootState } from "@/lib/reduxStore";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import leaveHomeUseCase from "@/core/use-cases/leaveHomeUseCase";

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const handleCopyHomeId = () => {
        if (user?.homeId) {
            navigator.clipboard.writeText(user.homeId).then(
                () => {
                    alert("Home ID copiado al portapapeles.");
                },
                (err) => {
                    console.error("Error al copiar el Home ID: ", err);
                }
            );
        }
    };

    const handleLeaveHome = async () => {
        await leaveHomeUseCase.execute({ user: user! });
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (!user) {
        return <p>Por favor, inicia sesión para acceder a tu perfil.</p>;
    }

    return (
        <div>
            <h2>Perfil del Usuario</h2>
            <p>
                <strong>ID:</strong> {user.id}
            </p>
            <p>
                <strong>Correo Electrónico:</strong> {user.email}
            </p>
            <p>
                <strong>Nombre:</strong> {user.name}
            </p>

            {!user.homeId ? (
                <>
                    <h3>¿Aún no formas parte de un hogar?</h3>
                    <nav>
                        <Link href="/create-home">Crear Hogar</Link>
                        <br />
                        <Link href="/join-home">Unirse a un Hogar</Link>
                    </nav>
                </>
            ) : (
                <div>
                    <strong>HomeID:</strong> {user.homeId}
                    <div style={{ marginTop: "10px" }}>
                        <button
                            onClick={handleCopyHomeId}
                            style={{ marginLeft: "10px" }}
                        >
                            Copy ID
                        </button>
                        <button
                            onClick={handleLeaveHome}
                            
                        >
                            Leave Home
                        </button>
                    </div>
                </div>
            )}
            <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
        </div>
    );
};

export default Profile;
