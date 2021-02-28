import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useExpanded } from 'react-table';
import axios from 'axios';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const fetchParentData = () => axios.get(`http://localhost:8000/api`);
const fetchChildData = () => axios.get(`http://localhost:8000/api/child`);

const insertIntoTable = ({ existingRows, subRowsToInsert, path }) => {
  const id = path[0];
  let updatedRows;

  const isBaseCase = path.length === 1;

  if (isBaseCase) {
    return existingRows.map((row, index) => {
      const isMatchedRowWithoutSubRows = index === Number(id) && !row.subRows;

      if (isMatchedRowWithoutSubRows) {
        return {
          ...row,
          subRows: subRowsToInsert
        }
      }

      return row;
    });
  }

  return existingRows.map((row, index) => {
    const isMatchedRowWithSubRows = index === Number(id) && row.subRows;

    if (isMatchedRowWithSubRows) {
      const [, ...updatedPath] = path;

      return {
        ...row,
        subRows: insertIntoTable({
          existingRows: row.subRows,
          subRowsToInsert,
          path: updatedPath
        })
      }
    }

    return row;
  });
}

const recursivelyUpdateTable = ({ tableData, childData, id }) => {
  return insertIntoTable({
    existingRows: tableData,
    subRowsToInsert: childData,
    path: id.split('.')
  });
}

const TableQuery = () => {
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState(null);
  const [isRowLoading, setIsRowLoading] = React.useState({});

  const handleClickRow = async ({ id }) => {
    setIsRowLoading({ [id]: true });

    const { data: childData } = await fetchChildData();

    setIsRowLoading({ [id]: false })

    if (tableData) {
      const updatedTableData = recursivelyUpdateTable({ tableData, childData, id });

      setTableData(updatedTableData);
    }
  }

  const {
    data: apiResponse,
    isLoading
  } = useQuery('discussionGroups', fetchParentData, { enabled: !tableData });

  useEffect(() => {
    setTableData(apiResponse?.data);
  }, [apiResponse])

  if (isLoading || !tableData) {
    return <div>Loading...</div>
  }

  return (
    <TableInstance
      tableData={tableData}
      onClickRow={handleClickRow}
      isRowLoading={isRowLoading}
    />
  );
}

const TableInstance = ({ tableData, onClickRow, isRowLoading }) => {
  const [columns, data] = useMemo(
    () => {
      const columns = [
        {
          Header: () => null,
          id: 'expander',
          Cell: ({ row, isLoading, isExpanded }) => {
            const toggleRowExpandedProps = row.getToggleRowExpandedProps();

            const onClick = async event => {
              if (!isExpanded) {
                await onClickRow(row);
              }
              toggleRowExpandedProps.onClick(event);
            }

            if (isLoading) {
              return <span>...</span>
            }

            return (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth}rem`,
                  },
                })}
                onClick={onClick}
              >
                {row.isExpanded ? '🔽' : '▶️'}
              </span>
            )
          },
        },
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
    { columns, data, autoResetExpanded: false },
    useExpanded
  );

  return (
    <TableLayout
      {...tableInstance}
      isRowLoading={isRowLoading}
    />
  );
}

const TableLayout = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  isRowLoading,
  state: { expanded }
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
                return <td {...cell.getCellProps()}>
                  {cell.render('Cell', {
                    isLoading: isRowLoading[row.id],
                    isExpanded: expanded[row.id]
                  })}
                </td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

const client = new QueryClient();

const ReactTableExpanding = () => {
  return (
    <QueryClientProvider client={client}>
      <TableQuery />
    </QueryClientProvider>
  );
}

export default ReactTableExpanding;
