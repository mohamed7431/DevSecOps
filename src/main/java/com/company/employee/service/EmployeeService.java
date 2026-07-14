package com.company.employee.service;

import com.company.employee.dto.EmployeeDTO;
import com.company.employee.entity.Employee;

import java.util.List;

public interface EmployeeService {

    Employee createEmployee(EmployeeDTO employeeDTO);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

    Employee updateEmployee(Long id, EmployeeDTO employeeDTO);

    void deleteEmployee(Long id);

}
