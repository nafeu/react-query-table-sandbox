import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const fetchData = () => axios.get(`http://localhost:8000/api`);

const TableQuery = () => {
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState(null);

  const { data: apiResponse, isLoading } = useQuery('discussionGroups', fetchData);

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
          Header: 'Discussion Groups',
          columns: [
            {
              Header: 'Topic',
              accessor: 'name'
            },
            {
              Header: 'Active Members',
              accessor: 'active'
            }
          ]
        }
      ];
      return [columns, tableData];
    },
    [tableData]
  );

  const tableInstance = useTable({ columns, data });

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
}) => {
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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

const ReactQueryWithTable = () => {
  return (
    <QueryClientProvider client={client}>
      <TableQuery />
    </QueryClientProvider>
  );
}

export default ReactQueryWithTable;
