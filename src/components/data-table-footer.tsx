'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RequestTableApi, TableApi, TableData } from '@/lib/table';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

export type DataTableFooterProps<TData extends TableData> = {
  table: TableApi<TData> | RequestTableApi<TData>;
  sizeOptions: number[];
};

export function DataTableFooter<TData extends TableData>({ table, sizeOptions }: DataTableFooterProps<TData>) {
  return (
    <div className="rounded-lg py-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {table.getSelectedRows() && table.getSelectedRows().length > 0 && (
            <div className="text-sm text-muted-foreground">
              已勾选&nbsp;{table.getSelectedRows().length}&nbsp;行，共&nbsp;
              {table.getPageRows()}&nbsp;行
            </div>
          )}

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">每页数量</p>
            <Select value={table.getSize()} onValueChange={table.setNewSize}>
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={table.getSize()} />
              </SelectTrigger>
              <SelectContent side="top">
                {sizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
            第&nbsp;{table.getPage()}&nbsp;页，共&nbsp;{table.getTotalPage()}&nbsp;页
          </div>

          <div className="flex items-center space-x-2">
            <>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => table.setNewPage(1)}
                disabled={table.getPage() <= 1}
              >
                <span className="sr-only">第一页</span>
                <ChevronsLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => table.setNewPage(table.getPage() - 1)}
                disabled={table.getPage() <= 1}
              >
                <span className="sr-only">上一页</span>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => table.setNewPage(table.getPage() + 1)}
                disabled={table.getPage() >= table.getTotalPage()}
              >
                <span className="sr-only">下一页</span>
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => table.setNewPage(table.getTotalPage())}
                disabled={table.getPage() >= table.getTotalPage()}
              >
                <span className="sr-only">最后页</span>
                <ChevronsRightIcon className="size-4" />
              </Button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
