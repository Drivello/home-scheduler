import { userService } from "@/infrastructure/services/services";
import { clearUser, RootState, setUser } from "@/lib/reduxStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "./authForm";

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.user);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userData = user.email
                        ? await userService.getUserByEmail(user.email)
                        : undefined;
                    if (userData) {
                        dispatch(setUser(userData));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                dispatch(clearUser());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!currentUser ? (
                <AuthForm onAuthSuccess={() => window.location.reload()} />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default Login;
