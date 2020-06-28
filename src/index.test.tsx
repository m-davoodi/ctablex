import { render, screen } from '@testing-library/react';
import React, { Fragment, PropsWithChildren } from 'react';
import {
  ArrayOutput,
  Cell,
  ContentContext,
  ContentContextProvider,
  Column,
  Columns,
  ColumnsContext,
  ColumnsContextProvider,
  DataContext,
  DataContextProvider,
  DataTable,
  DefaultCell,
  findColumns,
  getValue,
  HeaderCell,
  HeaderRow,
  IndexContext,
  IndexContextProvider,
  isColumnsType,
  ItemContext,
  ItemContextProvider,
  Row,
  RowDataContext,
  RowDataContextProvider,
  Rows,
  Table,
  TableBody,
  TableHeader,
  TablePartContext,
  TablePartContextProvider,
  TableComponentsContext,
  TableComponentsContextProvider,
  useContent,
  useColumns,
  useData,
  useIndex,
  useItem,
  useRowData,
  useTablePart,
  useTableComponentsContext,
} from './index';

const IndexCell = () => {
  const index = useIndex();
  return <Fragment>{index + 1}.</Fragment>;
};

const data = [
  {
    id: '1',
    name: 'Gloves',
    price: 544,
    count: 5,
    color: 'plum',
  },
  {
    id: '2',
    name: 'Salad',
    price: 601,
    count: 6,
    color: 'turquoise',
  },
  {
    id: '3',
    name: 'Keyboard',
    price: 116,
    count: 1,
    color: 'silver',
  },
];

describe('ctablex', () => {
  it('should render table', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column>
            <IndexCell />
          </Column>
          <Column header="Name" accessor="name">
            <DefaultCell />
          </Column>
          <Column header="Price" accessor="price">
            <DefaultCell />
          </Column>
          <Column header="Count" accessor="price">
            <DefaultCell />
          </Column>
          <Column header="Total" accessor={(r: any) => r.price * r.count}>
            <DefaultCell />
          </Column>
          <Column header="Color" accessor="color">
            <DefaultCell />
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
  });
  it('should provide index context', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column>
            <IndexCell />
          </Column>
          <Column header="Name" accessor="name">
            <DefaultCell />
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.queryByText(/1\./)).toBeInTheDocument();
    expect(screen.queryByText(/2\./)).toBeInTheDocument();
    expect(screen.queryByText(/3\./)).toBeInTheDocument();
  });
  it('should use custom Components', () => {
    const components = {
      Table: (props: PropsWithChildren<{}>) => {
        return (
          <table style={{ backgroundColor: '#ccc' }} data-testid="table">
            {props.children}
          </table>
        );
      },
    };

    render(
      <TableComponentsContextProvider value={components}>
        <DataTable data={data}>
          <Columns>
            <Column header="Name" accessor="name">
              <DefaultCell />
            </Column>
          </Columns>
          <Table>
            <TableHeader>
              <HeaderRow />
            </TableHeader>
            <TableBody>
              <Rows>
                <Row />
              </Rows>
            </TableBody>
          </Table>
        </DataTable>
      </TableComponentsContextProvider>,
    );
    expect(screen.queryByTestId('table')).toBeInTheDocument();
  });
  it('should use custom key accessor', () => {
    const fn = jest.fn((row: any) => row.id);
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name">
            <DefaultCell />
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows keyAccessor={fn}>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(fn).toBeCalled();
  });
  it('should render empty column', () => {
    const { container } = render(
      <DataTable data={data}>
        <Columns>
          <Column />
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Rows>
              <Row />
            </Rows>
          </TableBody>
        </Table>
      </DataTable>,
    );
    const tds = container.querySelectorAll('td');

    expect(tds).toHaveLength(3);
    tds.forEach((td) => expect(td).toHaveTextContent(''));
    expect(container.querySelectorAll('th')).toHaveLength(1);
  });
  it('should render a custom Row with external data', () => {
    render(
      <DataTable data={data}>
        <Columns>
          <Column header="Name" accessor="name">
            <DefaultCell />
          </Column>
        </Columns>
        <Table>
          <TableHeader>
            <HeaderRow />
          </TableHeader>
          <TableBody>
            <Row row={data[0]} />
          </TableBody>
        </Table>
      </DataTable>,
    );
    expect(screen.queryByText('Gloves')).toBeInTheDocument();
  });
  it('should throw error if data is undefined', () => {
    // @ts-ignore
    console.error.mockImplementation(() => {});
    expect(() => render(<Row />)).toThrow();
    expect(() => render(<DefaultCell />)).toThrow();
    expect(() => render(<Column />)).toThrow();
    expect(() => render(<Cell accessor="id" />)).toThrow();
    expect(() =>
      render(
        <DataTable data={data}>
          <Columns />
          <Table>
            <TableBody>
              <Row />
            </TableBody>
          </Table>
        </DataTable>,
      ),
    ).toThrow();
    expect(() => render(<IndexCell />)).toThrow();
    expect(() => render(<DataTable />)).toThrow();
    expect(() =>
      render(
        <DataTable data={[]}>
          <Column />
        </DataTable>,
      ),
    ).not.toThrow();
  });

  it('should export every things', () => {
    expect(DataTable).toBeDefined();
    expect(TableComponentsContext).toBeDefined();
    expect(useTableComponentsContext).toBeDefined();
    expect(TableComponentsContextProvider).toBeDefined();
    expect(useData).toBeDefined();
    expect(DataContext).toBeDefined();
    expect(DataContextProvider).toBeDefined();
    expect(Columns).toBeDefined();
    expect(Column).toBeDefined();
    expect(useColumns).toBeDefined();
    expect(ColumnsContext).toBeDefined();
    expect(ColumnsContextProvider).toBeDefined();
    expect(isColumnsType).toBeDefined();
    expect(findColumns).toBeDefined();
    expect(TableHeader).toBeDefined();
    expect(HeaderRow).toBeDefined();
    expect(HeaderCell).toBeDefined();
    expect(Rows).toBeDefined();
    expect(Row).toBeDefined();
    expect(useRowData).toBeDefined();
    expect(RowDataContextProvider).toBeDefined();
    expect(RowDataContext).toBeDefined();
    expect(TableBody).toBeDefined();
    expect(Table).toBeDefined();
    expect(TablePartContext).toBeDefined();
    expect(TablePartContextProvider).toBeDefined();
    expect(useTablePart).toBeDefined();
    expect(DefaultCell).toBeDefined();
    expect(Cell).toBeDefined();
    expect(ContentContext).toBeDefined();
    expect(ContentContextProvider).toBeDefined();
    expect(useContent).toBeDefined();
    expect(ArrayOutput).toBeDefined();
    expect(useItem).toBeDefined();
    expect(ItemContextProvider).toBeDefined();
    expect(ItemContext).toBeDefined();
    expect(useIndex).toBeDefined();
    expect(IndexContext).toBeDefined();
    expect(IndexContextProvider).toBeDefined();
    expect(getValue).toBeDefined();
  });
});
