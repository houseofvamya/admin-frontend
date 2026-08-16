"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

const DOTS = "dots";

function getPaginationRange(currentPage: number, totalPages: number, siblingCount: number) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + siblingCount * 2;
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
    return [1, DOTS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, DOTS, ...middleRange, DOTS, totalPages];
}

function Pagination({ currentPage, totalPages, onPageChange, className, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = getPaginationRange(currentPage, totalPages, siblingCount);

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex size-9 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {range.map((item, index) =>
        item === DOTS ? (
          <span
            key={`dots-${index}`}
            className="inline-flex size-9 items-center justify-center text-charcoal-soft"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item as number)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
              item === currentPage
                ? "bg-charcoal text-ivory"
                : "text-charcoal-soft hover:bg-cream hover:text-charcoal",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex size-9 items-center justify-center rounded-full text-charcoal-soft transition-colors hover:bg-cream disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

export { Pagination };
