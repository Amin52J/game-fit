"use client";

import styled from "styled-components";
import { PageWrapper, ButtonRow } from "@/shared/ui";

export const Page = styled(PageWrapper)`
  @media (max-width: 1024px) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
  }

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.sm} 0;
  }
`;

export const Toolbar = styled(ButtonRow)`
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 767px) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const ErrorBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorMuted};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
`;
