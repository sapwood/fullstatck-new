const express= require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const People = require('./models/person')

morgan.token('content', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '' })

const format= ':method :url :status :res[content-length] - :response-time ms :content'
app.use(morgan(format))





app.get('/api/persons',(request,response,next) => {

    People.find({})
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            next(error)
        })

})

app.get('/info',(request,response,next) => {

    const time= Date()
    People.find({})
        .then(p => {
            return response.send(`<p>Phonebook has info for ${p.length} people</p> <p>${time}</p>`)
        })
        .catch(error => {
            next(error)
        })

})

app.get('/api/persons/:id',(request,response,next) => {
    const id = request.params.id
    People.findById(id)
        .then(p => {
            return response.status(200).json(p)
        })
        .catch(error => {
            next(error)
        })

})

app.delete('/api/persons/:id',(request,response,next) => {
    const id= request.params.id
    People.findByIdAndDelete(id)
        .then(() => {
            return response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
    response.status(204).end()
})

app.put('/api/persons/:id',(request,response,next) => {
    const id =request.params.id
    const person = {
        name:request.body.name,
        number:request.body.number,
    }
    People.findByIdAndUpdate(id,person,{ new:true,runValidators:true,context:'query' })
        .then(p => {
            return response.status(200).json(p)
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons',(request,response,next) => {
    const name=request.body.name
    const number=request.body.number



    const person= new People({
        name:name,
        number:number,

    })
    person.save()
        .then(p => {
            response.json(p)
        })
        .catch(error => {
            next(error)
        })


})
const unknownEndpoint=(request,response) => {
    return response.status(404).send({ error:'unkown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {

    console.error( error)

    if (error.name==='CastError'){
        return response.status(400).send({ error:'malformatted id' })
    }
    else if(error.name==='ValidationError'){

        return response.status(400).send({ error:error.message })
    }
    else {
        return response.status(500).send({ error: 'Internal Server Error' })
    }
}
app.use(errorHandler)
const PORT=process.env.PORT

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})