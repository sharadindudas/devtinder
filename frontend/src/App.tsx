import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router";

import Footer from "./components/Common/Footer";
import Header from "./components/Common/Header";
import Loader from "./components/Common/Loader";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import { useGlobalStore } from "./store/useStore";
import { axiosInstance } from "./utils/axiosInstance";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/Profile"));
const Requests = lazy(() => import("./pages/Requests"));
const Connections = lazy(() => import("./pages/Connections"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { addUser, setAuthChecking, isAuthChecking } = useGlobalStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Replace this URL with your actual endpoint that returns the logged-in user's profile
        const res = await axiosInstance.get("/profile/view");
        addUser(res.data.data);
      } catch (error) {
        // If it fails (e.g. 401 Unauthorized), the cookie is missing or invalid
        console.log("Not logged in");
      } finally {
        // Done checking, safe to render the app
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [addUser, setAuthChecking]);

  if (isAuthChecking) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster />
    </>
  );
};

export default App;

