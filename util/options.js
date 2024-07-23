module.exports = {
    firstPrompt: {
        type: "list",
        name: "task",
        message: "Make a selection:",
        choices: [
            //options by View
            "View All Employees",  
			"View Departments", 
			"View Roles", 
            "View Employees by Department",  //bonus
            "View Employees by Manager",   //bonus
			"View Department Budget",   //bonus
			// Add options
			"Add Employee", 
			"Add Department", 
			"Add Role", 
			// Update options
			"Update Employee Role", 
			"Update Employee Manager",  //bonus
			// Delete options
			"Delete Employee",  //bonus
			"Remove Department",  //bonus
			"Remove Role", //bonus
			"Quit",

        ],
    },

//View Employees by Department
departmentPrompt: (departmentOptions) => [
	{
		type: "list",
		name: "departmentId",
		message: "Which department do you what to see",
		choices: departmentOptions,
	},
],
viewManagerPrompt: (managerOptions) => [
	// Select Manager
	{
		type: "list",
		name: "managerId",
		message: "Which manager will you choose?",
		choices: managerOptions,
	},
],
//Add Employee
addEmployee: (departmentArray, roleArray, managerArray) => [
	//Employee's First Name
	{
		name: "firstName",
		type: "input",
		message: "Enter employee's first name",
	},
	//Employee's Last Name
	{
		name: "lastName",
		type: "input",
		message: "Enter employee's last name:",
	},
	//Employee's Department
	{
		name: "department",
		type: "list",
		message: "Choose employee's department",
		choices: departmentArray,
	},
	//Employee's Role
	{
		name: "role",
		type: "list",
		message: "Choose employee's job position",
		choices: roleArray,
	},
	//Employee's Manager
	{
		name: "manager",
		type: "list",
		message: "Choose the manager of this employee:",
		choices: managerArray,
	},
],

deleteEmployee: (deleteEmployeeChoices) => {
	return [
		{
			type: 'list',
			name: 'employeeId',
			message: 'Which employee would you like to delete?',
			choices: deleteEmployeeChoices
		}
	];
}
};




