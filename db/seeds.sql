-- Departments
INSERT INTO department (id, name)
VALUES
   (1, 'Bartender'),
   (2, 'Server'),
   (3, 'Human Resources'),
   (4, 'Finance'),
   (5, 'Regional Managers');

-- Roles

INSERT INTO role (id, title, salary, department_id)
VALUES
-- Bartender
  (1, 'Bartender team lead', 100000, 1),
  (2, 'Bartender', 65000, 1),
-- Server
  (3, 'Server team lead', 70000, 2),
  (4, 'Server', 50000, 2),
--HR
  (5, 'HR Manager', 100000, 3),
  (6, 'HR Coordinator', 80000, 3),
--Finance Department 
  (7, 'Lead Accountant', 100000, 4),
  (8, 'Accountant', 90000, 4),
-- Regional Manager
  (9, 'Regional Manager', 200000, 5);


-- Employees

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Ernesto', 'Hidalgo', 1, null),  --Bartender team lead     1                                            
    (2, 'Brie', 'Django', 2, 1),  --Bartender                      2    
    (3, 'Mark', 'Dune', 2, 1),  --Bartender                        3
    (4, 'Olek', 'Nikitenko', 3, null), --Server Team Lead          4
    (5, 'Natallia', 'Titova', 4, 4), --Server                      5
    (6, 'Susan', 'Lopez', 4, 4), --Server                          6
    (7, 'Regina', 'Smith', 5, null),  --HR Manager                 7
    (8, 'Mario', 'Lugo', 6, 7),  --HR Coordinator                  8
    (9, 'Dario', 'Kerk', 7, null),  --Lead Accountant              9
    (10, 'Mike', 'Zuats', 8, 9),  --Accountant                      10
    (11, 'Manuel', 'Hidalgo', 9, null);  --Regional Manager         11
    
