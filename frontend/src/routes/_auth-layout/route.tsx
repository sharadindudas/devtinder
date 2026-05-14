import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout")({
  component: RouteComponent
});

function RouteComponent() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.includes("/login");

  return (
    <div className="h-dvh flex flex-1 gap-10 items-center justify-center">
      <div className="lg:block hidden">
        <img
          src={isLoginPage ? "/assets/login.jpg" : "/assets/signup.jpg"}
          className="block mx-auto w-md rounded-xl"
          loading="lazy"
          alt={isLoginPage ? "login-img" : "signup-img"}
        />
      </div>
      <div className="max-w-md w-full space-y-8">
        <h2 className="card-title justify-center text-2xl mt-8 font-semibold text-neutral-content">
          {isLoginPage ? "Login to your Account" : "Create an Account"}
        </h2>

        <Outlet />
      </div>
    </div>
  );
}
