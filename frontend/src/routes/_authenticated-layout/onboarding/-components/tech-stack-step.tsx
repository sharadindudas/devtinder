import CustomFormField from "@/components/shared/CustomFormField";
import type { OnboardingSchema } from "@/validations/onboarding";
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPERIENCE_LEVELS } from "@/data/onboarding";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CustomInputField from "@/components/shared/CustomInputField";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";

export default function TechStackStep() {
  const [skillInput, setSkillInput] = useState<string>("");

  const {
    watch,
    control,
    setValue,
    formState: { errors }
  } = useFormContext<OnboardingSchema>();

  const skills = watch("skills");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setValue("skills", [...skills, trimmed], { shouldValidate: true });
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Your tech stack</h2>
        <p className="text-sm text-muted-foreground mt-1">Help us match you with compatible devs.</p>
      </div>

      <CustomFormField
        labelName="Experience Level"
        isError={!!errors.experienceLevel}
        errorMessage={errors.experienceLevel?.message}>
        <Controller
          name="experienceLevel"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger className={cn("w-full h-12!", errors.experienceLevel && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem
                    key={level.value}
                    value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CustomFormField>

      <CustomFormField
        labelName="Skills"
        isError={!!errors.skills}
        errorMessage={errors.skills?.message}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <CustomInputField
              placeholder="e.g. React, TypeScript, Postgres..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              className="px-5 h-12">
              Add
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
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

