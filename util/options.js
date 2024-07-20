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
			"Remove Employee",  //bonus
			"Remove Department",  //bonus
			"Remove Role", //bonus
			"Quit",

        ],
    },

};


