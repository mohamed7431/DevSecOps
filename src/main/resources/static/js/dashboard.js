async function loadEmployees() {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    const tableBody = document.getElementById("employeeTableBody");

    loading.style.display = "block";
    error.style.display = "none";

    tableBody.innerHTML = "";

    try {

        const response = await fetch("/api/employees");

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const employees = await response.json();

        loading.style.display = "none";

        let totalSalary = 0;
        const departments = new Set();

        employees.forEach(employee => {

            totalSalary += Number(employee.salary);

            departments.add(employee.department);

            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="employee-id">
                    #${employee.id}
                </td>

                <td class="employee-name">
                    ${employee.firstName} ${employee.lastName}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>
                    ₹${Number(employee.salary).toLocaleString("en-IN")}
                </td>
            `;

            tableBody.appendChild(row);

        });


        // Statistics

        const totalEmployees = employees.length;

        const averageSalary =
            totalEmployees > 0
                ? totalSalary / totalEmployees
                : 0;


        document.getElementById("totalEmployees")
            .textContent = totalEmployees;


        document.getElementById("totalDepartments")
            .textContent = departments.size;


        document.getElementById("totalSalary")
            .textContent =
            "₹" + totalSalary.toLocaleString("en-IN");


        document.getElementById("averageSalary")
            .textContent =
            "₹" + Math.round(averageSalary).toLocaleString("en-IN");

    }

    catch (err) {

        loading.style.display = "none";

        error.style.display = "block";

        error.textContent =
            "Unable to load employee data: " + err.message;

    }

}


// Load dashboard when page opens

document.addEventListener(
    "DOMContentLoaded",
    loadEmployees
);
