'use client';

import type { TableApi, TableColumn, TableData } from '@/lib/table';
import { useEffect, useState } from 'react';

export type UseTableProps<TData extends TableData> = {
  rowKey?: string;
  data?: TData[];
  columns: TableColumn<TData>[];
  onSelectChange?: (rowKeys: string[]) => void;
  saveStateToQuery?: boolean;
};
export function useTable<TData extends TableData>(props: UseTableProps<TData>) {
  const { rowKey, columns, data, onSelectChange } = props;

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const [renderData, setRenderData] = useState<TData[]>();

  const [tableColumns, setTableColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  function handleDataUpdate() {
    const pageData = data?.slice(Number(getSize()) * (getPage() - 1), Number(getSize()) * getPage());
    setRenderData(pageData);
  }

  useEffect(() => {
    handleDataUpdate();
  }, [page, size, data]);

  /**
   * 同步更新选中行
   * @param newSelected
   */
  function onSelectedRowChange(newSelected: string[]) {
    setSelectedRows(newSelected);
    onSelectChange?.(newSelected);
  }

  /**
   * 获取当前页数据
   */
  function getData() {
    return renderData ?? [];
  }

  /**
   * 获取当前页码
   */
  function getPage() {
    return page;
  }

  /**
   * 获取当前每页数
   */
  function getSize() {
    return size.toString();
  }

  /**
   * 获取当前页的行数
   */
  function getPageRows() {
    return renderData?.length ?? 0;
  }

  /**
   * 获取总页数
   */
  function getTotalPage() {
    return data ? Math.ceil(data.length / size) : 1;
  }

  /**
   * 获取Row Key
   * @param dataItem
   */
  function getRowKey(dataItem: TData) {
    return dataItem[rowKey ?? 'id'] as string;
  }

  /**
   * 获取要显示的列
   */
  function getColumns() {
    return tableColumns.filter((column) => !column.hidden);
  }

  /**
   * 获取可隐藏的列
   */
  function getHideableColumns() {
    return tableColumns.filter((column) => column.hideable || (column.title && column.dataKey));
  }

  /**
   * 获取已选中的行Key
   */
  function getSelectedRows() {
    return selectedRows;
  }

  /**
   * 获取行的选中状态
   * @param dataItem
   */
  function getRowSelectedState(dataItem: TData) {
    return !!selectedRows.find((row) => row === getRowKey(dataItem));
  }

  /**
   * 获取全选的状态
   */
  function getRowSelectedAllState() {
    if (selectedRows.length === 0) return false;
    if (selectedRows.length === renderData?.length) return true;
    return 'indeterminate';
  }

  /**
   * 修改当前页面
   * @param newPage
   */
  function setNewPage(newPage: number) {
    if (newPage >= 1 && newPage <= getTotalPage()) {
      setPage(newPage);
    }
  }

  /**
   * 修改每页数量
   * @param newSize
   */
  function setNewSize(newSize: number | string) {
    if (Number(newSize) > 0) {
      setSize(Number(newSize));
    }
  }

  /**
   * 设置列可见性
   * @param index
   * @param visible
   */
  function setColumnVisibleState(index: TableColumn<any>['index'], visible: boolean) {
    setTableColumns(
      tableColumns.map((column) => {
        if (column.index === index) column.hidden = !visible;
        return column;
      }),
    );
  }

  /**
   * 设置行是否选中
   * @param dataItem
   * @param selected
   */
  function setRowSelectedState(dataItem: TData, selected: boolean | 'indeterminate') {
    onSelectedRowChange(
      selected ? [...selectedRows, getRowKey(dataItem)] : selectedRows.filter((row) => row !== getRowKey(dataItem)),
    );
  }

  /**
   * 设置行是否全选
   * @param selected
   */
  function setRowSelectedAllState(selected: boolean | 'indeterminate') {
    onSelectedRowChange(selected && renderData ? renderData?.map(getRowKey) : []);
  }

  return {
    getData,
    getPage,
    getSize,
    getPageRows,
    getTotalPage,
    getColumns,
    getHideableColumns,
    getSelectedRows,
    getRowSelectedState,
    getRowSelectedAllState,

    setNewPage,
    setNewSize,
    setColumnVisibleState,
    setRowSelectedState,
    setRowSelectedAllState,

    shouldAddSelectColumn: () => !!onSelectChange,
  } satisfies TableApi<TData>;
}
