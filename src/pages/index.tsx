import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/reduxStore";
import { setUser, clearUser } from "../lib/reduxStore";
import AuthForm from "../components/users/authForm";
import { UserService } from "../infrastructure/services/userService";
import { UserRepository } from "../infrastructure/repositories/userRepository";
import Profile from "@/components/users/profile";
import AddTaskForm from "@/components/tasks/addTaskForm";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const HomePage: React.FC = () => {
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

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!currentUser ? (
                <AuthForm onAuthSuccess={() => window.location.reload()} />
            ) : (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <Profile />
                    {/*<AddTaskForm />*/}
                </div>
            )}
        </div>
    );
};

export default HomePage;
