'use client';

import { selectColumn } from '@/components/data-table-column';
import { DataTableFooter } from '@/components/data-table-footer';
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UITable } from '@/components/ui/table';
import { useTable } from '@/hooks/use-table';
import type { TableColumn, TableData } from '@/lib/table';
import { cn } from '@/lib/utils';
import _ from 'lodash';

export type TableProps<TData extends TableData> = {
  rowKey?: string;
  data?: TData[];
  columns: TableColumn<TData>[];
  onSelectChange?: (rowKeys: string[]) => void;
  pageSizeOptions?: number[];
  className?: string;
};

export function Table<TData extends TableData>({
  rowKey = 'id',
  data,
  columns,
  onSelectChange,
  pageSizeOptions = [10, 25, 50],
  className,
}: TableProps<TData>) {
  const table = useTable({ rowKey, columns, data, onSelectChange });

  const tableColumns: TableColumn<TData>[] = table.shouldAddSelectColumn()
    ? [selectColumn(table), ...table.getColumns()]
    : table.getColumns();

  return (
    <div className={cn(className, 'w-full space-y-4')}>
      <div className="overflow-hidden rounded-3xl border">
        <UITable>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column, index) => (
                <TableHead key={index} id={column.index} colSpan={column.colSpan} style={{ width: column.width }}>
                  {column.titleRender ? column.titleRender() : column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getData().length > 0 ? (
              table.getData().map((item, index) => (
                <TableRow key={index}>
                  {tableColumns.map((column) => (
                    <TableCell key={column.index} colSpan={column.colSpan}>
                      {column.tableRowRender && column.tableRowRender(item)}
                      {!column.tableRowRender && (column.dataKey ? (_.get(item, column.dataKey) ?? '-') : '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      <DataTableFooter table={table} sizeOptions={pageSizeOptions} />
    </div>
  );
}
