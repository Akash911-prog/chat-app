import { useEffect, useState } from "react";
import socket from "../../libs/socket";
import { router } from "../../main";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        router.options.context.auth.isAuthenticated().then((result) => {
            setIsAuthenticated(result);
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect();
        } else {
            socket.disconnect();
        }
    }, [isAuthenticated]);

    return <>{children}</>;
};

export default SocketProvider;
