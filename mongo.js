const mongoose = require('mongoose')

if (process.argv.length<3){
    console.log('argument is not enough')
    process.exit(1)
}

const password= process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.uli1y.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
const name = process.argv[3]
const phone = process.argv[4]

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema= new mongoose.Schema({
    name: String,
    number: String,
})

const Person = new mongoose.model('Person',phonebookSchema)


if (name&&phone){

    const person = new Person({
        name:name,
        number:phone,
    })
    
    person.save().then(result=>{
        console.log(`added ${name} ${phone} to the phonebook.`)
        mongoose.connection.close()
    })
}

else{

    Person.find({}).then(result=>{
        console.log('Phonebook:')
        result.forEach(p=>{
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}
