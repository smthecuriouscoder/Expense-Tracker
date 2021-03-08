import React from 'react';
import { Tooltip } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
      backgroundColor: theme.palette.action.hover,
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function DisplayTable(props) {
  const classes = useStyles();
  const { incomeExpense } = props;
 
  const handleDeleteIcon = (row) => {
    props.handleFilterArrayChange(row);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Category</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
  	        <StyledTableCell>Type of Account</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incomeExpense && incomeExpense.map((row,index) => (
            <StyledTableRow key={index} >
	            <StyledTableCell>{row.type}</StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.date.substr(0,16)}
              </StyledTableCell>
              <StyledTableCell>Rs. {+row.amount}</StyledTableCell>
              <StyledTableCell>{row.category}</StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell 
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}> {row.account} 
                <div>
                {/* <Tooltip title="Edit">
                  <IconButton style={{ paddingTop: '5px'}}>
                    <EditIcon />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title="Delete">
                  <IconButton style={{ paddingTop: '5px'}} onClick={() => handleDeleteIcon(row)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DisplayTable;