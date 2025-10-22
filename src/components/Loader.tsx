"use client";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

export interface LoaderStep {
  text: string;
}

export function Loader({ loading, loadingStates, duration = 2000 }: {
  loading: boolean;
  loadingStates: LoaderStep[];
  duration?: number;
}) {
  return (
    <MultiStepLoader loading={loading} loadingStates={loadingStates} duration={duration} />
  );
}
