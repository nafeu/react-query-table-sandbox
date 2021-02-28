import React, { useMemo, useState, useEffect } from 'react';
import regeneratorRuntime from "regenerator-runtime";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy
} from 'react-table';
import axios from 'axios';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from 'react-query';

const fetchData = () => axios.get(`http://localhost:8000/api`);
const TWO_HUNDRED_MS = 200;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, TWO_HUNDRED_MS)

  return (
    <input
      value={value || ""}
      onChange={e => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search`}
    />
  )
}

const TableQuery = () => {
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState(null);

  const {
    data: apiResponse,
    isLoading
  } = useQuery('discussionGroups', fetchData, { enabled: !tableData });

  useEffect(() => {
    setTableData(apiResponse?.data);
  }, [apiResponse])

  if (isLoading || !tableData) {
    return <div>Loading...</div>
  }

  return (
    <TableInstance tableData={tableData}/>
  );
}

const TableInstance = ({ tableData }) => {
  const [columns, data] = useMemo(
    () => {
      const columns = [
        {
          Header: 'Topic',
          accessor: 'name'
        },
        {
          Header: 'Active Members',
          accessor: 'active'
        },
        {
          Header: 'Status',
          accessor: 'status'
        },
        {
          Header: 'Upvotes',
          accessor: 'upvotes'
        }
      ];
      return [columns, tableData];
    },
    [tableData]
  );

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy
  );

  return (
    <TableLayout {...tableInstance} />
  );
}

const TableLayout = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  state: { globalFilter },
  visibleColumns,
  preGlobalFilteredRows,
  setGlobalFilter
}) => {
  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={visibleColumns.length}
          >
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' ⬇️'
                      : ' ⬆️'
                    : ' ↕️'}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

const client = new QueryClient();

const ReactTableFilterSort = () => {
  return (
    <QueryClientProvider client={client}>
      <TableQuery />
    </QueryClientProvider>
  );
}

export default ReactTableFilterSort;
