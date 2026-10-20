"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PaginationProps = {
  /** 1-based current page */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

/**
 * Build the visible page list: first page, last page, and the pages around
 * the current one, with ellipsis markers for the gaps.
 */
function buildPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) items.push("ellipsis");
    items.push(page);
    previous = page;
  }
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const pageItems = buildPageItems(currentPage, totalPages);

  const goTo = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    if (next !== currentPage && !isLoading) {
      onPageChange(next);
    }
  };

  const buttonBase =
    "inline-flex items-center justify-center gap-1 min-w-[36px] h-9 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const idleClasses =
    "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 pt-6"
    >
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className={`${buttonBase} ${idleClasses}`}
      >
        <FiChevronLeft className="w-4 h-4" /> Prev
      </button>

      {pageItems.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-gray-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            disabled={isLoading}
            aria-current={item === currentPage ? "page" : undefined}
            className={`${buttonBase} ${
              item === currentPage
                ? "bg-[#0E68DC] text-white shadow-sm"
                : idleClasses
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className={`${buttonBase} ${idleClasses}`}
      >
        Next <FiChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}