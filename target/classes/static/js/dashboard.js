let allEmployees = [];

let salaryChart = null;

let departmentChart = null;



// =====================================================
// LOAD EMPLOYEES
// =====================================================

async function loadEmployees() {

    const error = document.getElementById("error");

    try {

        error.style.display = "none";


        const response = await fetch(
            "/api/employees"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load employees"
            );

        }


        allEmployees =
            await response.json();


        updateDashboard(
            allEmployees
        );


        renderEmployeeTable(
            allEmployees
        );


        updateDepartmentFilter(
            allEmployees
        );


        updateCharts(
            allEmployees
        );


    }

    catch (err) {

        error.style.display = "block";

        error.textContent =
            "Unable to load employee data: "
            + err.message;

    }

}



// =====================================================
// UPDATE DASHBOARD STATISTICS
// =====================================================

function updateDashboard(
    employees
) {


    let totalSalary = 0;

    const departments =
        new Set();


    employees.forEach(
        employee => {

            totalSalary +=
                Number(
                    employee.salary
                );


            departments.add(
                employee.department
            );

        }
    );


    const totalEmployees =
        employees.length;


    const averageSalary =
        totalEmployees > 0

        ? totalSalary /
          totalEmployees

        : 0;



    document.getElementById(
        "totalEmployees"
    ).textContent =
        totalEmployees;



    document.getElementById(
        "totalDepartments"
    ).textContent =
        departments.size;



    document.getElementById(
        "totalSalary"
    ).textContent =
        "₹" +
        totalSalary.toLocaleString(
            "en-IN"
        );



    document.getElementById(
        "averageSalary"
    ).textContent =
        "₹" +
        Math.round(
            averageSalary
        ).toLocaleString(
            "en-IN"
        );

}



// =====================================================
// RENDER EMPLOYEE TABLE
// =====================================================

function renderEmployeeTable(
    employees
) {


    const dashboardTable =
        document.getElementById(
            "dashboardTableBody"
        );


    const employeeTable =
        document.getElementById(
            "employeeTableBody"
        );



    dashboardTable.innerHTML =
        "";


    employeeTable.innerHTML =
        "";



    employees.forEach(
        employee => {


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    #${employee.id}
                </td>

                <td class="employee-name">
                    ${employee.firstName}
                    ${employee.lastName}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>
                    ₹${Number(
                        employee.salary
                    ).toLocaleString(
                        "en-IN"
                    )}
                </td>

                <td>

                    <button
                        class="action-btn view"
                        onclick="viewEmployee(${employee.id})"
                    >
                        👁
                    </button>

                    <button
                        class="action-btn delete"
                        onclick="deleteEmployee(${employee.id})"
                    >
                        🗑
                    </button>

                </td>

            `;



            dashboardTable.appendChild(
                row.cloneNode(true)
            );


            employeeTable.appendChild(
                row
            );


        }
    );

}



// =====================================================
// DEPARTMENT FILTER
// =====================================================

function updateDepartmentFilter(
    employees
) {


    const filter =
        document.getElementById(
            "departmentFilter"
        );


    const currentValue =
        filter.value;


    const departments =
        new Set();


    employees.forEach(
        employee => {

            departments.add(
                employee.department
            );

        }
    );


    filter.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    departments.forEach(
        department => {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            filter.appendChild(
                option
            );


        }
    );


    filter.value =
        currentValue;

}



// =====================================================
// SEARCH + FILTER
// =====================================================

function filterEmployees() {


    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    const department =
        document.getElementById(
            "departmentFilter"
        ).value;



    const filtered =
        allEmployees.filter(
            employee => {


                const name =
                    employee.firstName
                    + " "
                    + employee.lastName;



                const matchesSearch =

                    name
                    .toLowerCase()
                    .includes(search)

                    ||

                    employee.email
                    .toLowerCase()
                    .includes(search);



                const matchesDepartment =

                    department === ""

                    ||

                    employee.department
                    === department;



                return (

                    matchesSearch

                    &&

                    matchesDepartment

                );


            }
        );



    renderEmployeeTable(
        filtered
    );

}



// =====================================================
// DASHBOARD / EMPLOYEE NAVIGATION
// =====================================================

function showSection(
    section,
    element
) {


    const dashboard =
        document.getElementById(
            "dashboardSection"
        );


    const employees =
        document.getElementById(
            "employeesSection"
        );



    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );



    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    element.classList.add(
        "active"
    );



    if (
        section === "dashboard"
    ) {


        dashboard.style.display =
            "block";


        employees.style.display =
            "none";


        document.getElementById(
            "pageTitle"
        ).textContent =
            "Dashboard";


        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Welcome to your Employee Management System";


    }


    else {


        dashboard.style.display =
            "none";


        employees.style.display =
            "block";


        document.getElementById(
            "pageTitle"
        ).textContent =
            "Employees";


        document.getElementById(
            "pageSubtitle"
        ).textContent =
            "Manage your employee directory";


    }

}



// =====================================================
// ADD EMPLOYEE MODAL
// =====================================================

function openAddEmployeeModal() {

    document.getElementById(
        "employeeModal"
    ).style.display =
        "flex";

}



function closeEmployeeModal() {

    document.getElementById(
        "employeeModal"
    ).style.display =
        "none";

}



// =====================================================
// ADD EMPLOYEE
// =====================================================

async function addEmployee(
    event
) {


    event.preventDefault();



    const employee = {


        firstName:
            document.getElementById(
                "firstName"
            ).value,


        lastName:
            document.getElementById(
                "lastName"
            ).value,


        email:
            document.getElementById(
                "email"
            ).value,


        department:
            document.getElementById(
                "department"
            ).value,


        salary:
            Number(
                document.getElementById(
                    "salary"
                ).value
            )


    };



    try {


        const response =
            await fetch(
                "/api/employees",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            employee
                        )

                }
            );



        if (!response.ok) {

            throw new Error(
                "Failed to add employee"
            );

        }



        closeEmployeeModal();


        document.getElementById(
            "employeeForm"
        ).reset();


        await loadEmployees();


        alert(
            "Employee added successfully!"
        );


    }

    catch (error) {


        alert(
            error.message
        );


    }

}



// =====================================================
// DELETE EMPLOYEE
// =====================================================

async function deleteEmployee(
    id
) {


    if (
        !confirm(
            "Are you sure you want to delete this employee?"
        )
    ) {

        return;

    }



    try {


        const response =
            await fetch(
                `/api/employees/${id}`,
                {

                    method:
                        "DELETE"

                }
            );



        if (!response.ok) {

            throw new Error(
                "Failed to delete employee"
            );

        }



        await loadEmployees();


        alert(
            "Employee deleted successfully!"
        );


    }

    catch (error) {


        alert(
            error.message
        );


    }

}



// =====================================================
// VIEW EMPLOYEE
// =====================================================

function viewEmployee(
    id
) {


    const employee =
        allEmployees.find(
            emp =>
                emp.id === id
        );


    if (!employee) {

        return;

    }



    alert(

        "Employee Details\n\n"

        +

        "Name: "

        +

        employee.firstName

        +

        " "

        +

        employee.lastName

        +

        "\nEmail: "

        +

        employee.email

        +

        "\nDepartment: "

        +

        employee.department

        +

        "\nSalary: ₹"

        +

        Number(
            employee.salary
        ).toLocaleString(
            "en-IN"
        )

    );

}



// =====================================================
// CHARTS
// =====================================================

function updateCharts(
    employees
) {


    const departmentSalary =
        {};


    const departmentCount =
        {};



    employees.forEach(
        employee => {


            const dept =
                employee.department;



            departmentSalary[dept] =

                (
                    departmentSalary[dept]

                    ||

                    0

                )

                +

                Number(
                    employee.salary
                );



            departmentCount[dept] =

                (
                    departmentCount[dept]

                    ||

                    0

                )

                +

                1;


        }
    );



    const labels =
        Object.keys(
            departmentSalary
        );



    if (salaryChart) {

        salaryChart.destroy();

    }



    salaryChart =
        new Chart(

            document.getElementById(
                "salaryChart"
            ),

            {

                type:
                    "bar",

                data: {

                    labels:
                        labels,

                    datasets: [{

                        label:
                            "Total Salary",

                        data:
                            Object.values(
                                departmentSalary
                            )

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false

                }

            }

        );



    if (departmentChart) {

        departmentChart.destroy();

    }



    departmentChart =
        new Chart(

            document.getElementById(
                "departmentChart"
            ),

            {

                type:
                    "doughnut",

                data: {

                    labels:
                        labels,

                    datasets: [{

                        label:
                            "Employees",

                        data:
                            Object.values(
                                departmentCount
                            )

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false

                }

            }

        );

}



// =====================================================
// INITIAL LOAD
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadEmployees();

    }

);
