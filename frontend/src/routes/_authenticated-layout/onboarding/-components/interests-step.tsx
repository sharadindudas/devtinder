import CustomFormField from "@/components/shared/CustomFormField";
import CustomInputField from "@/components/shared/CustomInputField";
import { Button } from "@/components/ui/button";
import type { OnboardingSchema } from "@/validations/onboarding";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

export default function InterestsStep() {
  const [interestInput, setInterestInput] = useState<string>("");

  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<OnboardingSchema>();

  const interests = watch("interests");

  const addInterest = () => {
    const trimmed = interestInput.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    setValue("interests", [...interests, trimmed], { shouldValidate: true });
    setInterestInput("");
  };

  const removeInterest = (interest: string) => {
    setValue(
      "interests",
      interests.filter((i) => i !== interest),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">What are you into?</h2>
        <p className="text-sm text-muted-foreground mt-1">Pick topics you'd like to explore or collaborate on.</p>
      </div>

      <CustomFormField
        labelName="Interests"
        isError={!!errors.interests}
        errorMessage={errors.interests?.message}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <CustomInputField
              placeholder="e.g. Open Source, AI, DevOps..."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addInterest}
              className="px-5 h-12">
              Add
            </Button>
          </div>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-destructive transition-colors ml-0.5">
                    <IoMdClose size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </CustomFormField>
    </div>
  );
}

