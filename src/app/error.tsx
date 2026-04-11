"use client";

import { useEffect } from "react";
import { Root, Code, Title, Description, Digest, Actions, Btn } from "./error.styles";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <Root>
      <Code>500</Code>
      <Title>Something went wrong</Title>
      <Description>
        An unexpected error occurred while rendering this page. You can try again or head back to
        the home page.
      </Description>
      {error.digest && <Digest>Error ID: {error.digest}</Digest>}
      <Actions>
        <Btn $primary onClick={() => reset()}>
          Try again
        </Btn>
        <Btn onClick={() => (window.location.href = "/analyze")}>Go home</Btn>
      </Actions>
    </Root>
  );
}
