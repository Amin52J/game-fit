"use client";

import React, { forwardRef } from "react";
import styled, { css, keyframes } from "styled-components";
import type { Theme } from "@/shared/config/theme";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const sizeStyles = (theme: Theme, size: ButtonSize) => {
  switch (size) {
    case "sm":
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: 0.8125rem;
        min-height: 32px;
      `;
    case "lg":
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: 1rem;
        min-height: 48px;
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 0.875rem;
        min-height: 40px;
      `;
  }
};

const variantStyles = (theme: Theme, variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return css`
        background: ${theme.colors.accent};
        color: ${theme.colors.text};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
          background: ${theme.colors.accentHover};
        }

        &:active:not(:disabled) {
          filter: brightness(0.95);
        }
      `;
    case "secondary":
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};

        &:hover:not(:disabled) {
          background: ${theme.colors.surfaceHover};
          border-color: ${theme.colors.borderLight};
        }

        &:active:not(:disabled) {
          background: ${theme.colors.surfaceElevated};
        }
      `;
    case "ghost":
      return css`
        background: transparent;
        color: ${theme.colors.textSecondary};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
          background: ${theme.colors.accentMuted};
          color: ${theme.colors.text};
        }

        &:active:not(:disabled) {
          background: ${theme.colors.surfaceHover};
        }
      `;
    case "danger":
      return css`
        background: transparent;
        color: ${theme.colors.error};
        border: 1px solid ${theme.colors.error};

        &:hover:not(:disabled) {
          background: ${theme.colors.errorMuted};
        }

        &:active:not(:disabled) {
          filter: brightness(0.92);
        }
      `;
  }
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 600;
  line-height: 1.2;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast},
    opacity ${({ theme }) => theme.transition.fast},
    filter ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ theme, $size }) => sizeStyles(theme, $size)}
  ${({ theme, $variant }) => variantStyles(theme, $variant)}
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0) scale(0.97);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  &::after {
    content: "";
    width: 0.85em;
    height: 0.85em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.65s linear infinite;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    isLoading = false,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <StyledButton
      ref={ref}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <SpinnerText>Loading</SpinnerText> : children}
    </StyledButton>
  );
});
