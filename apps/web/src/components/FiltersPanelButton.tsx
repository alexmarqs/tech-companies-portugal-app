"use client";

import { Search, X } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { use, useEffect, useState } from "react";
import { SearchSideBar } from "./SearchSideBar";

import { FiltersButton } from "./FiltersButton";
import { Button } from "./ui/button";
import { RetroContainer } from "./ui/retro-container";

type FilterPanelButtonProps = {
  companiesCategoriesAndLocationsPromise: Promise<{
    availableCategories: string[];
    availableLocations: string[];
  }>;
};

export default function FiltersPanelButton({
  companiesCategoriesAndLocationsPromise,
}: FilterPanelButtonProps) {
  const segment = useSelectedLayoutSegment();
  const isCompanyListPage = segment === "(companies-list)";
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { availableCategories = [], availableLocations = [] } = use(
    companiesCategoriesAndLocationsPromise,
  );

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  if (!isCompanyListPage) {
    return null;
  }

  return (
    <div>
      <FiltersButton setIsFilterOpen={setIsFilterOpen} />
      {isFilterOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <RetroContainer
            variant="static"
            className="fixed inset-y-0 left-0 w-full sm:w-[400px] bg-background border-r-2 border-accent p-6 overflow-y-auto flex flex-col justify-start items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 w-full">
              <h2 className="font-mono text-2xl font-bold">Filters</h2>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="w-full h-full flex flex-col">
              <SearchSideBar
                locationOptions={availableLocations}
                categoryOptions={availableCategories}
                onResetAction={() => {
                  setIsFilterOpen(false);
                }}
                showCountBadge={false}
                extendedUIAction={() => (
                  <>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setIsFilterOpen(false);
                      }}
                      aria-label="See results"
                    >
                      <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                      See results
                    </Button>
                  </>
                )}
              />
            </div>
          </RetroContainer>
        </div>
      )}
    </div>
  );
}
