"use client";

import { Root, Code, Title, Description, HomeLink } from "./not-found.styles";

export default function NotFound() {
  return (
    <Root>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Description>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Description>
      <HomeLink href="/analyze">Go to Analyze</HomeLink>
    </Root>
  );
}
