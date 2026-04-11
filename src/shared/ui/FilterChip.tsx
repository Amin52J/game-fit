"use client";

import styled from "styled-components";

export const FilterChip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 14px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0) scale(0.95);
    }
  }
`;
