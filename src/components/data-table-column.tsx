import { Checkbox } from '@/components/ui/checkbox';
import type { TableApi, TableData } from '@/lib/table';

export function selectColumn<TData extends TableData>(table: TableApi<TData>) {
  return {
    index: 'select',
    titleRender: () => (
      <Checkbox
        checked={table.getRowSelectedAllState()}
        onCheckedChange={(value) => table.setRowSelectedAllState(!!value)}
      />
    ),
    tableRowRender: (data: TData) => (
      <Checkbox
        checked={table.getRowSelectedState(data)}
        onCheckedChange={(value) => table.setRowSelectedState(data, value)}
      />
    ),
  };
}
