export default function ProgressStatus({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= currentStep ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

