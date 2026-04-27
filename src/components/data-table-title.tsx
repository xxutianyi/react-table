'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { RequestTableApi, TableColumn, TableData } from '@/lib/table';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';

export type DataTableTitleProps<TData extends TableData> = {
  table: RequestTableApi<TData>;
  column: TableColumn<TData>;
};

export function DataTableTitle<TData extends TableData>({ table, column }: DataTableTitleProps<TData>) {
  if (!column.sortable) {
    return column.titleRender ? column.titleRender() : column.title;
  }

  const sortState = table.getColumnSortState(column.index);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{column.titleRender ? column.titleRender() : column.title}</span>
            {sortState === 'asc' && <ArrowUpIcon className="ml-2 size-4" />}
            {sortState === 'desc' && <ArrowDownIcon className="ml-2 size-4" />}
            {sortState === undefined && <ChevronsUpDownIcon className="ml-2 size-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => table.setSortState(column.index, 'asc')}>
            <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            从小到大（升序）
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => table.setSortState(column.index, 'desc')}>
            <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            从大到小（降序）
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => table.setSortState(column.index, undefined)}>
            <XIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            取消
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
