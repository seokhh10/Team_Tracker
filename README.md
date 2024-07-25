# Team_Tracker

This command-line applicatio, utilizing PostgreSQL for its database management.

## Table of Contents:
- [Description](#Description)
- [Features](#Features)
- [Installation](#Installation-and-Usage)
- [Technology used](#Technology-used)
- [Demo](#Demo)

## Description

This application is tailored for small businesses, providing a comprehensive solution for viewing and managing the company's organizational structure. Users can efficiently handle tasks such as overseeing departments, defining roles, and managing employee information, all through a series of straightforward commands. The app leverages SQL to perform robust data operations, ensuring accurate and efficient management of the company's resources.

## Features

- **View All Departments**: Displays a formatted table showing department names and department IDs.
- **View All Roles**: Shows the job title, role ID, the department the role belongs to, and the salary for that role.
- **View All Employees**: Presents a formatted table showing employee data, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to.
- **Add a Department**: Prompts the user to enter the name of a department and adds it to the database.
- **Add a Role**: Prompts the user to enter the name, salary, and department for a role and adds it to the database.
- **Add an Employee**: Prompts the user to enter the employee’s first name, last name, role, and manager, then adds the employee to the database.
- **Update an Employee Role**: Allows the user to select an employee and update their role in the database.
- **Update Employee Managers**: Provides the option to update the manager information for employees.
- **View Employees by Manager**: Displays a list of employees organized by their managers.
- **View Employees by Department**: Shows employees sorted by their respective departments.
- **Delete Departments, Roles, and Employees**: Allows the removal of departments, roles, and employees from the database.
- **View Total Utilized Budget of a Department**: Calculates and displays the combined salaries of all employees in a department.
## Installation and Usage
To set up the Team_Tracker application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/seokhh10/Team_Tracker

2. Navigate to the project directory:
   ```bash
   cd Team_Tracker 

3. Install the required dependencies:
   ```bash
   npm install

4. Download and Install PostgreSQL, if not already installed:

   [Download here](https://www.postgresql.org/download/)

5. Open the Postgres Shell that connects the terminal to the Postgres instance: 
    ```sh
    psql -U postgres
   
6. Install console.table for better date format with: npm install console.table --save

7. Run the app with: npm start

8. Follow the menu and prompts

## Technology used
- JSON:[ JSON](https://www.npmjs.com/package/json)
- Render:[ Render ](https://render.com/)
- Node.js [Version v20.15.0](https://nodejs.org/en)
- Express.js:[Express.js](https://expressjs.com/en/starter/installing.html)
- Visual Studio Code: [Website](https://code.visualstudio.com/)
- JavaScript


## Demo:
[Demo Link](https://youtu.be/zDUxHCe8qA8)