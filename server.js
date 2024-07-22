// Dependencies
const inquirer = require("inquirer");
const pool = require('./db/connections');
//const table = ("console.table");
//SQL db
const db = require("./db/connections");
//Options prompts
const prompt = require("./util/options");

// Call firstPrompt function after the module is loaded
firstPrompt();



function firstPrompt() {
    inquirer.prompt(prompt.firstPrompt).then(function({ task }) {
        switch (task) {
            //options by View
            case "View All Employees":
                viewEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees by Department": //Bonus
                viewEmployeeByDepartment();
                break;
            case "View Employees by Manager":   //Bonus
				viewEmployeeByManager();
				break;
            case "View Department Budget": //Bonus
                viewDepartmentBudget();
                break;
            // Add options
            case "Add Employee":
                 addEmployee();
                 break;
            case "Add Department":
                addDepartment();
                break; 
            case "Add Role":
                addRole();
                break;                       
            // Update options
            case "Update Employee Role":
				updateEmployeeRole();
				break; 
			case "Update Employee Manager": //Bonus
				updateEmployeeManager();
				break;
            // Delete options
            case "Remove Employee":  //Bonus
				deleteEmployee();
				break;
            case "Remove Department":   //Bonus
                removeDepartment();
                break;
            case "Remove Role":  //Bonus
                removeRole();
                break;
            case "Quit":
                db.end();
        console.log("Bye")
                break;         
        }
    });
}


// View Employees
function viewEmployee() {
	console.log("Employees");

	const query = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON d.id = r.department_id
        LEFT JOIN employee m ON m.id = e.manager_id`;

    pool.query(query, (err, res) => {
        if (err) throw err;

        console.table(res.rows);

        firstPrompt();
    });
}

// View Departments
function viewDepartments() {
    const query = "SELECT * FROM department";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nDEPARTMENTS:\n`);
        res.rows.forEach((department) => {
            console.log(`ID: ${department.id} | ${department.name} Department`);
        });
        console.table(res.rows);

        firstPrompt();
    });
}

// View Roles
function viewRoles() {
    const query = "SELECT * FROM role";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nROLES:\n`);
        res.rows.forEach((role) => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary}`,);
        });
        console.table(res.rows);
        firstPrompt();
    });
}


// View Employees by Department

function viewEmployeeByDepartment() {
    console.log("View employees by department\n");

    const query = `SELECT d.id, d.name
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

    pool.query(query, function (err, res) {
        if (err) throw err;

    //Select Department
    const departmentOptions = res.rows.map((data) => ({
        value: data.id,
        name: data.name,
    }));    

    inquirer
       .prompt(prompt.departmentPrompt(departmentOptions))
       .then(function (answer) {
        const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
			FROM employee e
			JOIN role r
				ON e.role_id = r.id
			JOIN department d
			    ON d.id = r.department_id
			WHERE d.id = $1`;

            pool.query(query, [answer.departmentId], function (err,res) {
                if (err) throw err;
                console.table(res.rows);
                firstPrompt();
            });
       });
    });
}

// View Employee by Manager

function viewEmployeeByManager() {
    console.log("Manager Employees:\n");

    const query = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
  	LEFT JOIN department d ON d.id = r.department_id
  	LEFT JOIN employee m ON m.id = e.manager_id 
    GROUP BY e.manager_id, m.first_name, m.last_name`;

    pool.query(query,function (err, res) {
        if (err) throw err;

        //Select Manager to see their employees
        const managerOptions = res.rows.map((data) => ({
            value: data.manager_id,
            name: data.manager,
        }));

        inquirer
            .prompt(prompt.viewManagerPrompt(managerOptions))
            .then(function (answer) {
                const query = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN role r ON e.role_id = r.id
			JOIN department d ON d.id = r.department_id
			LEFT JOIN employee m ON m.id = e.manager_id
			WHERE m.id = $1`;

            pool.query(query, [answer.managerId], function (err,res){
                if (err) throw err;
                console.table(res.rows);
                firstPrompt();
            });
        });
    });

}

//View Department Budget
function viewDepartmentBudget() {
    const query = `SELECT d.name, SUM(r.salary) AS budget
		FROM employee e 
		LEFT JOIN role r ON e.role_id = r.id
		LEFT JOIN department d ON r.department_id = d.id
		GROUP BY d.name`;

        pool.query(query, function (err, res) {
            if (err) throw err;

            console.log(`\nDEPARTMENT BUDGET:\n`);
            res.rows.forEach((department) => {
                // console.log( `Department: ${department.name} Budget: ${department.budget}`,);
            });
            console.table(res.rows);
            firstPrompt();
        });
}

//Add Employee
const addEmployee = () => {
    //Select a Department for employee
    let departmentArray = [];
    pool.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        res.rows.forEach((element) => {
            departmentArray.push(`${element.id} ${element.name}`);
        });
    //Select employee's role    
    let roleArray = [];
    pool.query(`SELECT id, title FROM role`, (err, res) => {
        if (err) throw err;

        res.rows.forEach((element) => {
            roleArray.push(`${element.id} ${element.title}`);
        });
    //Select employye's manager
    let managerArray = [];
    pool.query(`SELECT id, first_name, last_name FROM employee`, (err, res) => {
        if (err) throw err;

        res.rows.forEach((element) => {
            managerArray.push(`${element.id} ${element.first_name} ${element.last_name}`,);
        });

        //Create a new employee
        inquirer
            .prompt(prompt.newEmployee(departmentArray, roleArray, managerArray),)
            .then((response) => {
                let roleCode = parseInt(response.role);
                let managerCode = parseInt(response.manager);
                pool.query("Insert Into employee SET ?", 
                    {
                        first_name: response.firstName,
					    last_name: response.lastName,
					    role_id: roleCode,
					    manager_id: managerCode,
                    },
                    (err. res) => {
                        
                    }

            )
            })

    })    

    })
    })
}