import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated-layout/onboarding/")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4">Complete your profile</h1>
        <p className="text-gray-600 mb-8">Add your skills and experience to find the best matches.</p>

        <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
          [Onboarding Form Placeholder]
        </div>
      </div>
    </div>
  );
}
