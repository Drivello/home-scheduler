import { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../lib/reduxStore";
import Layout from "@/components/boards/layout";
import Login from "@/components/users/login";
import { useSelector } from "react-redux";
import { RootState } from "../lib/reduxStore";

const AppContent = ({ Component, pageProps, router }: AppProps) => {
    const currentUser = useSelector((state: RootState) => state.user.user);

    return !currentUser ? (
        <Login />
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <Provider store={store}>
            <AppContent
                Component={Component}
                pageProps={pageProps}
                router={router}
            />
        </Provider>
    );
};

export default MyApp;
