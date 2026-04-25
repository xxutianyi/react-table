'use client';

import { useStore } from '@/hooks/use-table-state';
import type { DataResult, TableApi, TableColumn, TableData, TableRequest } from '@/lib/table';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export type UseTableProps<TData extends TableData> = {
  rowKey?: string;
  columns: TableColumn<TData>[];
  data?: TData[];
  request?: TableRequest<TData>;
  onSelectChange?: (rowKeys: string[]) => void;
  saveStateToQuery?: boolean;
};

export function useTable<TData extends TableData>(props: UseTableProps<TData>) {
  const { rowKey, columns, data, request, onSelectChange, saveStateToQuery } = props;

  const { states, setStates } = useStore(saveStateToQuery)(columns);

  const [renderData, setRenderData] = useState<DataResult<TData>>();

  const [tableColumns, setTableColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  function handleDataUpdate() {
    if (!!request) {
      const { filters, ...others } = states;
      const params = { ...others, ...filters };
      request(params).then(setRenderData);
    }

    if (!!data) {
      let result = [...data];

      //Search
      const search = getSearch().toLowerCase().trim();
      result = result.filter((item) =>
        Object.values(item).some((value) => {
          return value?.toString().toLowerCase().includes(search);
        }),
      );

      //Filter
      result = result.filter((item) => {
        let match = true;
        getFilterableColumns().forEach((column) => {
          if (getFilteredState(column.index)) {
            match = item[column.index] === getFilteredState(column.index);
          }
        });
        return match;
      });

      //Sorts
      const sortColumns = getSortState().map((s) => s.column);
      const sortDirections = getSortState().map((s) => s.direction);
      result = _.orderBy(result, sortColumns, sortDirections) as TData[];

      //Page&Size
      const pageData = result.slice(Number(getSize()) * (getPage() - 1), Number(getSize()) * getPage());

      setRenderData({ data: pageData, total: result.length });
    }
  }

  useEffect(() => {
    handleDataUpdate();
  }, []);

  useEffect(() => {
    handleDataUpdate();
  }, [states]);

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
    return renderData?.data ?? [];
  }

  /**
   * 获取当前页码
   */
  function getPage() {
    return states.page;
  }

  /**
   * 获取当前每页数
   */
  function getSize() {
    return states.size.toString();
  }

  /**
   * 获取当前搜索
   */
  function getSearch() {
    return states.search ?? '';
  }

  /**
   * 获取当前页的行数
   */
  function getPageRows() {
    return renderData?.data.length ?? 0;
  }

  /**
   * 获取总页数
   */
  function getTotalPage() {
    return renderData ? Math.ceil(renderData.total / states.size) : 1;
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
   * 获取可以筛选的列
   */
  function getFilterableColumns() {
    return columns.filter((column) => column.title && column.filters && column.filters.length > 0);
  }

  /**
   * 获取列筛选的值
   * @param column
   */
  function getFilteredState(column: string) {
    return states.filters?.[column];
  }

  /**
   * 获取当前筛选的原始选项
   * @param column
   */
  function getFilteredStateOption(column: TableColumn<TData>) {
    return column.filters?.find((filter) => filter?.value == getFilteredState(column.index));
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
    if (selectedRows.length === renderData?.data.length) return true;
    return 'indeterminate';
  }

  /**
   * 获取列排序状态
   */
  function getSortState() {
    if (!states.sorts) return [];

    return states.sorts
      .split(',')
      .map((sort) => {
        const sortMeta = sort.split(':');

        if (sortMeta.length !== 2) return undefined;

        return { column: sortMeta[0], direction: (sortMeta[1] === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc' };
      })
      .filter((value) => !!value);
  }

  /**
   * 获取列排序值
   * @param column
   */
  function getColumnSortState(column: string) {
    const direction = getSortState()?.find((sort) => sort.column === column)?.direction;
    return direction ? (direction === 'asc' ? 'asc' : 'desc') : undefined;
  }

  /**
   * 修改当前页面
   * @param newPage
   */
  function setNewPage(newPage: number) {
    if (newPage >= 1 && newPage <= getTotalPage()) {
      setStates({ page: newPage });
    }
  }

  /**
   * 修改每页数量
   * @param newSize
   */
  function setNewSize(newSize: number | string) {
    if (Number(newSize) > 0) {
      setStates({ size: Number(newSize) });
    }
  }

  /**
   * 修改搜索字符串
   * @param search
   */
  function setNewSearch(search?: string) {
    setStates({ search: search ?? null });
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
    onSelectedRowChange(selected && renderData ? renderData?.data.map(getRowKey) : []);
  }

  /**
   * 设置列排序
   * @param column
   * @param direction
   */
  function setSortState(column: string, direction?: string) {
    const currentSort = getSortState().filter((s) => s.column !== column);

    setStates({
      sorts: (direction ? [...currentSort, { column, direction }] : currentSort)
        .map((s) => `${s.column}:${s.direction}`)
        .join(','),
    });
  }

  /**
   * 设置列筛选
   * @param index
   * @param value
   */
  function setFilterState(index: string, value?: string | null) {
    setStates({ filters: { ...states.filters, [index]: value ?? null } });
  }

  return {
    getData,
    getPage,
    getSize,
    getSearch,
    getPageRows,
    getTotalPage,
    getColumns,
    getHideableColumns,
    getSelectedRows,
    getRowSelectedState,
    getRowSelectedAllState,
    getColumnSortState,
    getFilteredState,
    getFilteredStateOption,
    getFilterableColumns,

    setNewPage,
    setNewSize,
    setNewSearch,
    setSortState,
    setColumnVisibleState,
    setRowSelectedState,
    setRowSelectedAllState,
    setFilterState,

    shouldAddSelectColumn: () => !!onSelectChange,
  } satisfies TableApi<TData>;
}
