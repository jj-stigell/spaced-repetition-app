import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { BugReport, DeckAdmin } from '../../../types'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'

interface Props {
  data: DeckAdmin[] | BugReport[]
  onClick: (id: string | number) => void
}

export default function DataTable (props: Props): React.JSX.Element {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  if (props.data.length === 0) {
    return (<div>no data found</div>)
  }

  const columns = Object.keys(props.data[0])
  // const type = typeof props.data[0]

  function handleChangePage (event: unknown, newPage: number): void {
    setPage(newPage)
  }

  function handleChangeRowsPerPage (event: React.ChangeEvent<HTMLInputElement>): void {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function formatValue (text: string | number | boolean | Date | undefined): string | React.JSX.Element {
    switch (typeof text) {
      case 'string':
        return text
      case 'number':
        return String(text)
      case 'boolean':
        return text ? <CheckIcon color='success' /> : <CloseIcon color='error' />
      case 'object':
        return text instanceof Date ? text.toLocaleString('en-GB', { timeZone: 'UTC' }) : '-'
      default:
        return 'undefined value'
    }
  }

  function isDeckAdmin (row: DeckAdmin | BugReport): row is DeckAdmin {
    return (row as DeckAdmin).jlptLevel !== undefined
  }

  function isBugReport (row: DeckAdmin | BugReport): row is BugReport {
    return (row as BugReport).bugMessage !== undefined
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column: string) => (
                <TableCell
                  key={column}
                  align='center'
                  style={{ minWidth: column.length * 10 }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} /* style={{ backgroundColor: row.active ? '#b8f296' : 'none' }} */>
                    {columns.map((column: string) => {
                      let value
                      if (isDeckAdmin(row)) {
                        // Now TypeScript knows row is a DeckAdmin
                        value = row[column as keyof DeckAdmin]
                      } else if (isBugReport(row)) {
                        // Now TypeScript knows row is a BugReport
                        value = row[column as keyof BugReport]
                      }
                      return (
                        <TableCell key={column} align='center' onClick={() => { props.onClick(row.id) }}>
                          {formatValue(value)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
