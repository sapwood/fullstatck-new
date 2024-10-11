const express= require('express')
const morgan = require('morgan')
const cors = require('cors')
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('content', (req, res) =>
     { return req.method === 'POST' ? JSON.stringify(req.body) : '' })

const format= ':method :url :status :res[content-length] - :response-time ms :content'
app.use(morgan(format))

let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/info',(request,response)=>{
    const count= persons.length
    const time= Date()
    response.send(`<p>Phonebook has info for ${count} people</p> <p>${time}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person= persons.find(p=>p.id===id)
    if (!person){
        return response.status(404).end()
    }
    response.json(person)
})

app.delete('/api/persons/:id',(request,response)=>{
    const id= request.params.id
    const person= persons.find(p=>p.id===id)
    response.status(204).end()
})

app.post('/api/persons',(request,response)=>{
    const name=request.body.name
    const number=request.body.number

    if (!(name&&number)){
        return response.status(400).json({
            error:'content missing'
        })
    }
    const isDuplicated = persons.some(p=>(p.name.toLowerCase()===name.toLowerCase()))
    

    if (isDuplicated){
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const person={
        name:name,
        number:number,
        id:Math.floor(Math.random()*100000)
    }

    persons= persons.concat(person)
    response.json(person)
})

const PORT=3001

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})