"use client";

import React from "react";
import { Button, Icon } from "@/shared/ui";
import { Pagination } from "./GameLibrary.styles";

export function LibraryPagination({
  clampedPage,
  totalPages,
  setPage,
  tableRef,
}: {
  clampedPage: number;
  totalPages: number;
  setPage: (p: number) => void;
  tableRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (totalPages <= 1) return null;

  const scrollToTable = () =>
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Pagination>
      <Button
        variant="secondary"
        onClick={() => { setPage(Math.max(0, clampedPage - 1)); scrollToTable(); }}
        disabled={clampedPage === 0}
      >
        <Icon name="chevron-left" size={14} /> Prev
      </Button>
      <span>
        Page {clampedPage + 1} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => { setPage(Math.min(totalPages - 1, clampedPage + 1)); scrollToTable(); }}
        disabled={clampedPage >= totalPages - 1}
      >
        Next <Icon name="chevron-right" size={14} />
      </Button>
    </Pagination>
  );
}
