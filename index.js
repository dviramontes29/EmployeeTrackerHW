const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost/employee_db')

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Choose an action:',
      choices: [
        {
          name: 'View Employees',
          value: 'viewEmployees'
        },
        {
          name: 'Add An Employee',
          value: 'addEmployee'
        },
        {
          name: 'Update Employee Role',
          value: 'updateEmployeeRole'
        },
        {
          name: 'View Departments',
          value: 'viewDepartments'
        },
        {
          name: 'Add A Department',
          value: 'addDepartment'
        },
        {
          name: 'View Roles',
          value: 'viewRoles'
        },
        {
          name: 'Add A Role',
          value: 'addRole'
        }
      ]
    }
  ])
    .then(({ choice }) => {
      switch (choice) {
        case 'viewEmployees':
          viewEmployees()
          break
        case 'addEmployee':
          addEmployee()
          break
        case 'updateEmployeeRole':
          updateEmployeeRole()
          break
        case 'viewDepartments':
          viewDepartments()
          break
        case 'addDepartment':
          addDepartment()
          break
        case 'viewRoles':
          viewRoles()
          break
        case 'addRole':
          addRole()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewEmployees = () => {
  db.query(`
    SELECT employee.id, employee.first_name, employee.last_name,
      role.title, role.salary, department.name AS department,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id
  `, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    mainMenu()
  })
}

const addEmployee = () => {
  db.query('SELECT * FROM role', (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query('SELECT * FROM employee', (_err, employees) => {

      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      employees.unshift({ name: 'None', value: null })

      prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the employee first name?'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the employee last name?'
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose a role for the employee:',
          choices: roles
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Choose a manager for the employee:',
          choices: employees
        }
      ])
        .then(employee => {
          db.query('INSERT INTO employee SET ?', employee, (err) => {
            if (err) { console.log(err) }
            console.log('Employee Created!')
            mainMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

const updateEmployeeRole = () => {
  db.query('SELECT * FROM employees', (_err, employees) => {
    employees = employees.map(employees => ({
      name: `${employees.first_name} ${employees.last_name}`,
      value: employees.id
    }))
    db.query('SELECT * FROM roles', (_err, roles) => {
      roles = roles.map(roles => ({
        name: roles.title,
        value: roles.id
      }))
      prompt([
        {
          type: 'list',
          name: 'employees_id',
          message: 'Choose an employee to update',
          choices: employees
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose the employee new role',
          choices: roles
        },
      ])
        .then(employees => {
          console.log(employees.role_id)
          db.query('UPDATE employees SET role_id = ? WHERE employees.id = ?', [employees.role_id, employees.employees_id], (err) => {
            if (err) { console.log(err) }
            console.log('employee updated')
            start()
          })
        })
        .catch(err => { console.log(err) })
    })
  })
}

const updateEmployeeManager = () => {
  db.query('SELECT * FROM employees', (_err, employees) => {
    employees = employees.map(employees => ({
      name: `${employees.first_name} ${employees.last_name}`,
      value: employees.id
    }))
    db.query('SELECT * FROM roles', (_err, roles) => {
      roles = roles.map(roles => ({
        name: roles.title,
        value: roles.id
      }))
      prompt([
        {
          type: 'list',
          name: 'employees_id',
          message: 'Choose an employee to update',
          choices: employees
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Choose the employee new role',
          choices: roles
        },
      ])
        .then(employees => {
          console.log(employees.role_id)
          db.query('UPDATE employees SET role_id = ? WHERE employees.id = ?', [employees.role_id, employees.employee_id], (err) => {
            if (err) { console.log(err) }
            console.log('employee updated')
            mainMenu()
          })
        })
        .catch(err => { console.log(err) })
    })
  })
}

const viewDepartments = () => {
  db.query(`
    SELECT * FROM departments
  `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}
const addDepartment = () => {
  prompt({
    type: 'input',
    name: 'name',
    message: 'What is the name of the department?'
  })
    .then(departments => {
      db.query('INSERT INTO departments SET ?', departments, (err) => {
        if (err) { console.log(err) }
        console.log('Department Created!')
        mainMenu()
      })
    })
}
const viewRoles = () => {
  db.query(`
    SELECT roles.title, roles.salary FROM roles
  `, (err, roles) => {
    if (err) { console.log(err) }
    console.table(roles)
    mainMenu()
  })
}
const addRole = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    departments = departments.map(departments => ({
      name: departments.name,
      value: departments.id
    }))
    db.query('SELECT * FROM roles', (_err, roles) => {
      roles = roles.map(roles => ({
        name: `${roles.title} ${roles.salary}`,
        value: roles.id
      }))
      roles.unshift({ name: 'None', value: null })
      prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the title of the role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary?'
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'choose department:',
          choices: departments
        }
      ])
        .then(roles => {
          db.query('INSERT INTO roles SET ?', roles, (err) => {
            if (err) { console.log(err) }
            console.log('Role Created!')
            mainMenu()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

mainMenu()