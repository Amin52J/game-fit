"use client";

import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  margin: 4px 0 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SectionCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionDesc = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;
