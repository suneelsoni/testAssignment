import React, { Component } from 'react'

class Employee extends Component {
  constructor() {
    super();
    this.state = {
      employees: [],
      searchedEmp: '',
      error: null,
      show: undefined,
      suggestion: [],
      hasList: false
    }
  }

  getEmployee = (name) => {
    if (this.state.suggestion.includes(name)) {
      fetch('http://api.additivasia.io/api/v1/assignment/employees/' + name)
        .then(res => res.json())
        .then(
          result => this.setState({ employees: result, searchedEmp: name, show: result.some(value => { return typeof value == "object" }), hasList: false }),
          error => this.setState({ error })
        )
    }
    else {
      this.setState({ employees: [], hasList: true })
    }

  }

  handleChange = () => {
    fetch('http://api.additivasia.io/api/v1/assignment/employees')
      .then(res => res.json())
      .then(result => this.setState({ suggestion: result }))
  }

  render() {
    const { employees, searchedEmp, show, suggestion, hasList, error } = this.state;

    employees.splice(0, 1);

    let employeeList;

    if (show) {
      employeeList = employees.map(emp => emp["direct-subordinates"].map((employee, i) => <li key={i}>{employee}</li>))
    } else {
      employeeList = show === false ? <li>No subordinates found</li> : ''
    }

    if (error) {
      return (<div>Error: {error.message}</div>)
    }
    else {
      return (
        <div className="container">
          {/* Employee Explorer */}
          <h2>Employee Explorer</h2>
          <input type="text" ref="employee" list="suggestion" onChange={this.handleChange} className="input-field" />
          <datalist id="suggestion">
            {suggestion.map((list,i) =>
              <option key={i} value={list} />
            )}
          </datalist>
          <button className="button" onClick={() => { this.getEmployee(this.refs.employee.value) }}>Search</button>

          {/* Employee Overview */}
          <h2>Employee Overview</h2>
          <h4>Subordinates of employee <span className="font-bold">{searchedEmp}</span>:</h4>
          {hasList ? <div>No employee found</div> : ''}
          <ul>
            {employeeList}
          </ul>
        </div>
      )
    }
  }
}

export default Employee;
