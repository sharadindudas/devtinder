import { Navigate } from "react-router";

import { useGlobalStore } from "../../store/useStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useGlobalStore();
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    return children;
};

export default ProtectedRoute;
