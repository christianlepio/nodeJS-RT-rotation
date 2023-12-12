const Employee = require('../model/Employee') //import employee Schema

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find() //get all data from employees collection in mongo DB
    if (!employees) {
        return res.status(204).json({ 'message': 'No employees found!' })
    } else {
        res.json(employees)
    }
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First & Last name are required!' })
    } else {
        try {
            const result = await Employee.create(
                { 
                    "firstname": req.body.firstname, 
                    "lastname": req.body.lastname 
                }
            )
        
            console.log('Created Emp: ', result)

            res.status(201).json(result)
        } catch (err) {
            console.error('error: ', err)
        }
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': `Employee ID is required!` })
    } else {
        const employee = await Employee.findOne({ _id: req.body.id }).exec() //get employee from mongoDB with specific ID

        if (!employee) {
            return res.status(204).json({ 'message': `Employee ID: ${req.body.id} not found!` })
        } else {
            if (req.body?.firstname) employee.firstname = req.body.firstname
            if (req.body?.lastname) employee.lastname = req.body.lastname
    
            const updatedData = await employee.save() //save updated employee details

            console.log('updatedData: ', updatedData)

            res.json(updatedData)
        }
    }
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': `Employee ID is required!` })
    } else {
        const employee = await Employee.findOne({ _id: req.body.id }).exec()
        if (!employee) {
            return res.status(204).json({ 'message': `Employee ID: ${req.body.id} not found!` })
        } else {
            const deletedEmp = await Employee.deleteOne({ _id: req.body.id })

            res.json(deletedEmp)
        }
    }
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': `Employee ID from parameter is required!` })
    } else {
        const employee = await Employee.findOne({ _id: req.params.id }).exec()

        if (!employee) {
            return res.status(400).json({ 'message': `Employee ID: ${req.params.id} not found!` })
        } else {
            res.json(employee)
        }
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}