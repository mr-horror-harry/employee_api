const Employee = require('../model/struct')

//Action: SelectAll
//Method: find()
//URL: GET: /api/employee/

const selectAll = async(req, res)=>{
    try{
        const data = await Employee.find();
        data.length!=0 ? res.json(data) : res.send("DB empty! No Employee data Exists!")
    }
    catch(err){
        console.log("Error:\n" + err);
    }
}

//Action: Select One
//Method: findOne()
//URL: GET: /api/employee/<emplyeeID>

const selectOne = async(req, res)=>{
    try{
        const data = await Employee.findOne({employeeID : req.params.eID})
        data ? res.json(data) : res.send('No such Employee with specified id exists!')
    }
    catch(err){
        console.log("Error:\n" + err)
    }
}

//Action: Insert One
//Method: create(), validate(), 'save()'
//URL: PUT: /api/employee/ (or) POST

const insertOne = async(req, res)=>{
    try{
        let {employeeID, employeeName, gender, pendingWork} = req.body
        if(!employeeID || !employeeName || !gender){
            console.log('Insufficient or Incorrect Data!')
            res.send('Insufficient or Incorrect Data!')
        }
        pendingWork = pendingWork ? pendingWork : false

        if(await Employee.findOne({employeeID: employeeID})){
            res.json({'Note' : 'Oops! Employee ID taken already!'})
        }
        else{
            const data = await Employee.create({
                employeeID, employeeName, gender, pendingWork
            })

            await data.validate()
            let dataCopy = await data.save()

            res.json(dataCopy)
        }   
    }
    catch(err){
        console.log("Error:\n"+err);
    }
}

//Action: Delete Employee
//Method: deleteMany()
//URL: DELETE: /api/employee/<emplyeeID>
const updateOne = async(req, res)=>{
    try {
        if(await Employee.findOne({employeeID : req.params.eID})){
            const data = await Employee.findOneAndUpdate({employeeID: req.params.eID}, req.body, {new: true})
            console.log("Data updated Successfully!")
            res.json(data)
        }
        else{
            res.send('No such Employee with specified id exists!')
        }
    } catch (err) {
        console.log("Error:\n" + err)
    }
}

//Action: Delete Employee
//Method: deleteMany()
//URL: DELETE: /api/employee/<emplyeeID>

const deleteEmployee = async(req, res)=>{        // delete one user
    try {

        const eID =  req.params.eID

        if(await Employee.findOne({employeeID: eID})){
            await Employee.deleteMany({employeeID: eID})        // deletes all duplicates of the user
            await Employee.findOne({employeeID: eID}) ? res.send("Data Deletion failed!") :  res.send('Data deletion Success!') // confirm
        }
        else{
            res.send("No such Employee with specified id exists!")
        }

        
    } catch (err) {
        console.log('Error:\n'+err)
    }
}
// deleteOne(): delete only the first fetched result & keep duplicates
// deleteMany(): delete specified data completely including duplicates

module.exports = {selectAll, selectOne, insertOne, updateOne, deleteEmployee}