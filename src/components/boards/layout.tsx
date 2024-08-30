import React from "react";
import NavBar from "./navbarMobile";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <main>{children}</main>
            <NavBar />
        </div>
    );
};

export default Layout;
