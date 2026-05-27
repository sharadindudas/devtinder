import { Button } from "@/components/ui/button";
import { OnboardingSchema } from "@/validations/onboarding";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import IdentityStep from "./-components/identity-step";
import TechStackStep from "./-components/tech-stack-step";
import { STEP_FIELDS } from "@/data/onboarding";
import InterestsStep from "./-components/interests-step";
import { useUpdateProfileMutation } from "@/api/user/mutation";
import ProgressStatus from "./-components/progress-status";

export const Route = createFileRoute("/_authenticated-layout/onboarding/")({
  component: RouteComponent
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const form = useForm<OnboardingSchema>({
    resolver: valibotResolver(OnboardingSchema),
    defaultValues: {
      bio: "",
      github: "",
      experienceLevel: "beginner",
      skills: [],
      interests: []
    }
  });

  const handleNext = async () => {
    const isValid = await form.trigger(STEP_FIELDS[currentStep]);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = (data: OnboardingSchema) => {
    updateProfile({
      ...data,
      bio: data.bio,
      github: data.github,
      isOnboarded: true
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-xl w-full space-y-8">
        <ProgressStatus currentStep={currentStep} />

        <div>
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Step {currentStep} of 3</p>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            {currentStep === 1 && <IdentityStep />}
            {currentStep === 2 && <TechStackStep />}
            {currentStep === 3 && <InterestsStep />}

            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="px-5 h-12 text-sm font-semibold rounded-md">
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-5 h-12 text-sm font-semibold rounded-md">
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="px-5 h-12 text-sm font-semibold rounded-md">
                  {form.formState.isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
