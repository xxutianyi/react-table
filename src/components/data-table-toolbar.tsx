'use client';

import { DataTableFilter } from '@/components/data-table-filter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { TableApi, TableData } from '@/lib/table';
import { Settings2Icon, XIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type DataTableToolbarProps<TData extends TableData> = {
  table: TableApi<TData>;
  actions?: ReactNode;
  showSearch?: boolean;
};

export function DataTableToolbar<TData extends TableData>({
  table,
  actions,
  showSearch,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="rounded-lg py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          {showSearch && (
            <>
              <Input
                aria-label="Search"
                placeholder="搜索..."
                value={table.getSearch()}
                onChange={(event) => table.setNewSearch(event.target.value)}
                className="mx-1 h-8 w-37.5 border-border lg:w-62.5"
              />
              {!!table.getSearch() && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => table.setNewSearch('')}
                  className="h-8 px-2 lg:px-3"
                >
                  重置
                  <XIcon className="ml-2 size-4" />
                </Button>
              )}
            </>
          )}
          {table.getFilterableColumns().map((column) => (
            <DataTableFilter key={column.index} column={column} table={table} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto hidden lg:flex">
                <Settings2Icon className="mr-2 size-4" />
                视图
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-37.5">
              <DropdownMenuLabel>显示列</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getHideableColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.index}
                  className="capitalize"
                  checked={!column.hidden}
                  onCheckedChange={(value) => {
                    table.setColumnVisibleState(column.index, value);
                  }}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {actions}
        </div>
      </div>
    </div>
  );
}
