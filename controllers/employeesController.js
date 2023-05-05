const path = require('path');
// const data = {
//     employees: require(path.join(__dirname, "..", "model", "employees.json")),
//     setEmployees: function (data) { 
//         this.employees = data;
//     },
// };
const Employee = require(path.join(__dirname, "..", "model", "Employee"));
const getAllEmployees = async (req, res) => {
    // res.json(data.employees);
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employee found!' });
    res.json(employees);
};

const createNewEmployee = async (req, res) => {
    // const newEmployee = {
    //     id: data.employees[data.employees.length - 1].id + 1 || 1,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    // };
    if (!req.body?.firstname || !req.body?.lastname) return res.status(400).json({ 'message' : 'First and Last name required!'});

    // if (!newEmployee.firstname || !newEmployee.lastname) { 
    //     return res.status(400).json({
    //         'message': 'First and Last name are required!',
    //     });
    // }

    // data.setEmployees([...data.employees, newEmployee]);
    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });
        console.log(result);
        return res.status(201).json(result);
     } catch (err) { console.log(err); }
    res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is requied!' });
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    const employee = Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(400).json({
            "message": `No employees matches ID ${req.body.id} not found !`,
        });
    }
    if (req.body?.firstname) { employee.firstname = req.body.firstname }
    if (req.body?.lastname) { employee.lastname = req.body.lastname }
    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filteredArray, employee];
    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    const result = employee.save();
    console.log(result);
    res.status(201).json(data.employees);
};

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is requied!' });
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(400).json({
            "message": `No employees matches ID ${req.body.id} not found !`,
        });
    }
    // const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // data.setEmployees([...filteredArray]);
    const result = employee.deleteOne({ _id: req.body.id });
    res.status(201).json(result);
};

const getEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is requied!' });
    // const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(400).json({
            "message": `No employees matches ID ${req.params.id} not found !`,
        });
    }
    res.status(201).json(employee);
};
module.exports = {
    getAllEmployees,
     createNewEmployee,
     updateEmployee,
     deleteEmployee,
    getEmployee
};