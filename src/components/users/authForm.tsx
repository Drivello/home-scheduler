import React, { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import { Task } from "@/core/entities/task";
import { userService } from "@/infrastructure/services/services";

interface AuthFormProps {
    onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        try {
            if (isRegistering) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                await userService.getOrCreateUser({
                    id: "",
                    name: userCredential.user.displayName ?? "",
                    email: userCredential.user.email ?? "",
                    homeId: "",
                    personalTasks: [],
                    professionalTasks: [],
                });

                localStorage.setItem("authToken", userCredential.user.uid);
            } else {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                localStorage.setItem("authToken", userCredential.user.uid);
            }

            setEmail("");
            setPassword("");

            onAuthSuccess();
        } catch (err) {
            console.error("Error en la autenticación:", err);
            setError("Error en la autenticación. Verifica tus credenciales.");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);

            await userService.getOrCreateUser({
                id: "",
                name: result.user.displayName ?? "",
                email: result.user.email ?? "",
                homeId: "",
                personalTasks: [],
                professionalTasks: [],
            });

            localStorage.setItem("authToken", result.user.uid);

            onAuthSuccess();
        } catch (err) {
            console.error("Error al iniciar sesión con Google:", err);
            setError("Error al iniciar sesión con Google.");
        }
    };

    return (
        <div>
            <h2>{isRegistering ? "Registrar Usuario" : "Iniciar Sesión"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {isRegistering ? "Registrar" : "Iniciar Sesión"}
                </button>
                <button type="button" onClick={handleGoogleSignIn}>
                    Iniciar Sesión con Google
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <p>
                    {isRegistering
                        ? "¿Ya tienes una cuenta?"
                        : "¿No tienes una cuenta?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? "Iniciar Sesión" : "Registrarse"}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
