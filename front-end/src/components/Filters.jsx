import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';

class Filters extends Component{
//   constructor(props){
//     super(props);
    
//     this.state={
//     	account: 'All Accounts',
// 		duration: 'monthly'
//     };
//   }

//   handleChange = e => {
//     this.setState({
//       [e.target.name]: e.target.value
//     }, () => {
// 		this.props.handleFilterArrayByType(e.target.value);
// 	})
//   }

  handleChange = e => {
	this.props.handleFilterArrayByType(e.target.value);
  }

  render() {
	return (
	  <div style={{display: 'flex', flex: '1', alignItems: 'center', marginRight: '100px'}}>
		<FilterListOutlinedIcon />
	    <Select
			variant="outlined"
			style={{margin: '0 10px'}}
	        name='account'
			value={this.props.account}
			onChange={this.handleChange}
        >
			<MenuItem value='All Accounts'>All Accounts</MenuItem>
			<MenuItem value='Personal'>Personal</MenuItem>
			<MenuItem value='Business'>Business</MenuItem>
       	</Select>
		{/* <Select
			variant="outlined"
			name='duration'
			value={this.state.duration}
			onChange={this.handleChange}
		>
			<MenuItem value='weekly'>Weekly</MenuItem>
			<MenuItem value='monthly'>Monthly</MenuItem>
			<MenuItem value='yearly'>Yearly</MenuItem>
		</Select> */}
	   </div>
	);
  }
}

export default Filters;