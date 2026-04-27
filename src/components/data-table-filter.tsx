'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import type { RequestTableApi, TableColumn, TableData } from '@/lib/table';
import { cn } from '@/lib/utils';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';

export type DataTableFilterProps<TData extends TableData> = {
  table: RequestTableApi<TData>;
  column: TableColumn<TData>;
};

export function DataTableFilter<TData extends TableData>({ table, column }: DataTableFilterProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 size-4" />
          {column.title}
          {table.getFilteredStateOption(column) && (
            <>
              <Separator orientation="vertical" className="mx-2 my-1! h-5!" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {table.getFilteredStateOption(column)?.label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={column.title} />
          <CommandList>
            <CommandEmpty>无匹配项</CommandEmpty>
            <CommandGroup>
              {column.filters?.map((option) => {
                const isSelected = table.getFilteredState(column.index) === option?.value;
                return (
                  <CommandItem
                    key={option?.value}
                    onSelect={() => table.setFilterState(column.index, isSelected ? undefined : option?.value)}
                  >
                    <div
                      className={cn(
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input [&_svg]:invisible',
                        'mr-2 flex size-4 items-center justify-center rounded-lg border',
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </div>
                    {option?.icon && <option.icon className="mr-2 size-4 text-muted-foreground" />}
                    <span>{option?.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
