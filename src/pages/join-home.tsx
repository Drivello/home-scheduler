import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/lib/reduxStore";
import JoinHomeForm from "@/components/home/joinHomeForm";

const JoinHomePage: React.FC = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
        return <p>Por favor, inicia sesión para unirte a un hogar.</p>;
    }

    const handleJoinHome = async () => {
        alert("Te has unido al hogar exitosamente.");
        router.replace("/");
    };

    return (
        <div>
            <h1>Unirse a un Hogar</h1>
            <JoinHomeForm onJoinHome={handleJoinHome} />
        </div>
    );
};

export default JoinHomePage;
