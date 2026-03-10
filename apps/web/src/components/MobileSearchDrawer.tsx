"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useSearchQueryParams } from "../hooks/useSearchQueryParams";
import { SearchSideBar } from "./SearchSideBar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

type MobileSearchDrawerProps = {
  locationOptions: string[];
  categoryOptions: string[];
};

export function MobileSearchDrawer({
  locationOptions,
  categoryOptions,
}: MobileSearchDrawerProps) {
  const [open, setOpen] = useState(false);
  const { appliedFilters } = useSearchQueryParams();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="lg"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full shadow-lg gap-2"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {appliedFilters.length > 0 && (
          <Badge className="ml-1 text-[10px] px-2 py-[3px] rounded-full shadow-sm text-white bg-primary hover:bg-primary">
            {appliedFilters.length}
          </Badge>
        )}
      </Button>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Search & Filters</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <SearchSideBar
            locationOptions={locationOptions}
            categoryOptions={categoryOptions}
            showCountBadge={false}
            onResetAction={() => setOpen(false)}
          />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="default" className="w-full">
              Show Results
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
