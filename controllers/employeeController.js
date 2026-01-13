const db = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.query('CALL GetAllEmployees()');
        // Stored procedures return an array of result sets. The first element is the actual data.
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const [rows] = await db.query('CALL GetEmployeeByID(?)', [req.params.id]);
        if (rows[0].length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(rows[0][0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createEmployee = async (req, res) => {
    const { emp_id, emp_name, dept_id, salary, email, city } = req.body;
    try {
        // Note: city has a default value, so it can be omitted
        const query = 'INSERT INTO employees (emp_id, emp_name, dept_id, salary, email, city) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [emp_id, emp_name, dept_id, salary, email, city || 'Colombo'];

        await db.query(query, values);
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        console.error(error);
        if (error.sqlState === '45000') {
            // Trigger error (e.g., negative salary)
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Duplicate entry' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateEmployee = async (req, res) => {
    const { emp_name, salary, city } = req.body;
    try {
        // Only updating strict fields for simplicity, can be expanded
        const query = 'UPDATE employees SET emp_name = ?, salary = ?, city = ? WHERE emp_id = ?';
        const [result] = await db.query(query, [emp_name, salary, city, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM employees WHERE emp_id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
