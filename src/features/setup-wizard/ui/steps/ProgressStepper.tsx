"use client";

import React from "react";
import { Icon } from "@/shared/ui";
import { STEPS } from "../SetupWizard.utils";
import {
  Stepper,
  StepItem,
  StepTrack,
  StepCircle,
  StepLine,
  StepLabel,
} from "../SetupWizard.styles";

export function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <Stepper role="navigation" aria-label="Setup progress">
      {STEPS.map((s, i) => {
        const stepNum = s.id;
        const state = stepNum < currentStep ? "done" : stepNum === currentStep ? "current" : "todo";
        const isLast = i === STEPS.length - 1;
        return (
          <StepItem key={s.id}>
            <StepTrack>
              <StepCircle $state={state} aria-current={state === "current" ? "step" : undefined}>
                {stepNum < currentStep ? <Icon name="check" size={14} /> : stepNum}
              </StepCircle>
              {!isLast ? <StepLine $filled={stepNum < currentStep} aria-hidden /> : null}
            </StepTrack>
            <StepLabel $active={stepNum <= currentStep}>{s.label}</StepLabel>
          </StepItem>
        );
      })}
    </Stepper>
  );
}
