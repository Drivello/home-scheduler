import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import { userService } from "@/infrastructure/services/services";

interface AuthFormProps {
    onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [error, setError] = useState<string>("");

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
            <h2>{"Iniciar Sesión"}</h2>
            <button type="button" onClick={handleGoogleSignIn}>
                Iniciar Sesión con Google
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AuthForm;
