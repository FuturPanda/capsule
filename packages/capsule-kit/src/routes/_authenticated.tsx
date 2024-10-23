import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  // const auth = useAuth();
  // const navigate = useNavigate();
  // const handleLogout = async () => {
  //   await new Promise(() => auth!.logout());
  //   navigate({ to: "/login" });
  // };

  return (
    <div className="p-2 h-full">
      <Outlet />
    </div>
  );
}
