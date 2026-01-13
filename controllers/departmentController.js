const db = require('../config/db');

exports.getDepartmentCount = async (req, res) => {
    const deptId = req.params.id;
    try {
        // Handling OUT parameter
        await db.query('SET @count = 0');
        await db.query('CALL CountEmployeesByDept(?, @count)', [deptId]);
        const [rows] = await db.query('SELECT @count as count');

        res.json({ dept_id: deptId, employee_count: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
