import { Navigate } from "react-router";
import { useGlobalStore } from "../../store/useStore";

const PublicRoute = ({ children }) => {
    const { user } = useGlobalStore();
    if (user) {
        return (
            <Navigate
                to="/feed"
                replace
            />
        );
    }
    return children;
};

export default PublicRoute;
