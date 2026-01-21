import { Button } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}

export default function PaginationControl({
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1 pt-6">
      <Button
        type="text"
        disabled={page === 1}
        icon={<ChevronLeft size={16} />}
        onClick={() => onPageChange(page - 1)}
      />

      {pages.map((p) => (
        <Button
          key={p}
          type={p === page ? "primary" : "text"}
          onClick={() => onPageChange(p)}
          className="min-w-[36px]"
        >
          {p}
        </Button>
      ))}

      <Button
        type="text"
        disabled={page === totalPages}
        icon={<ChevronRight size={16} />}
        onClick={() => onPageChange(page + 1)}
      />
    </div>
  );
}
