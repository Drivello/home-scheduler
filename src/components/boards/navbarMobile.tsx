import React from "react";
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
} from "@mui/material";
import { Home, Person, Assignment } from "@mui/icons-material";
import { useRouter } from "next/router";

const MobileNavbar: React.FC = () => {
    const router = useRouter();
    const [value, setValue] = React.useState(router.pathname);

    const handleNavigationChange = (
        event: React.ChangeEvent<{}>,
        newValue: string
    ) => {
        setValue(newValue);
        router.push(newValue);
    };

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{ top: "auto", bottom: 0 }}
        >
            <Paper elevation={3}>
                <BottomNavigation
                    value={value}
                    onChange={handleNavigationChange}
                    showLabels
                >
                    <BottomNavigationAction
                        label="Home"
                        value="/"
                        icon={<Home />}
                    />
                    <BottomNavigationAction
                        label="Create task"
                        value="/create-task"
                        icon={<Assignment />}
                    />
                    <BottomNavigationAction
                        label="Profile"
                        value="/profile"
                        icon={<Person />}
                    />
                </BottomNavigation>
            </Paper>
        </AppBar>
    );
};

export default MobileNavbar;
