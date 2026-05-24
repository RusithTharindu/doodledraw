"use client";

import { DesignCard } from "@/components/designs/DesignCard";
import type { SavedDesign } from "@/types/design";

type DesignGridProps = {
  designs: SavedDesign[];
  onOpen: (id: string) => void;
  onRename: (design: SavedDesign) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function DesignGrid(props: DesignGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.designs.map((design) => (
        <DesignCard key={design.id} design={design} {...props} />
      ))}
    </div>
  );
}
