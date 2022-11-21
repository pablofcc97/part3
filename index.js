require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()

morgan.token('body', function (req) { return JSON.stringify(req.body) })




app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))



const generateId = () => {
  /*const maxId = persons.length > 0 ? Math.max(...persons.map(n=>n.id)) : 0 
  return maxId + 1*/
  const id = Math.floor(Math.random() * (10000 - 8) + 8)
  return id
}


app.get('/',(request, response)=>{
  response.send('<h1>Hellow world</h1>')
})

app.get('/info',(request, response)=>{
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p> ${Date()} </p>`)
})

app.get('/api/persons',(request, response)=>{
  Contact.find({}).then(contacts=>{
    response.json(contacts)
  })
})

app.get('/api/persons/:id',(request,response, next)=>{
  const id = Number(request.params.id)

  Contact.findById(request.params.id)
    .then(contact=>{
      if(contact){
        response.json(contact)
      }else{
        response.status(404).end()
      }
    })
    .catch(error=>{
      next(error)
      /*console.log(error)
      response.status(400).send({error: 'malformated id'})*/
    })

 /* const person = persons.find(person=>person.id===id)

  if(person){
    response.json(person)
  }else{
    response.status(404).end
  }*/
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
  /*const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()*/
})

app.post('/api/persons',morgan(':method :url :status :res[content-length] - :response-time ms :body') , (request, response, next) => {
  const person = request.body
  const name = String(person.name)

  if(!person.name || !person.number){
    return(response.status(400).json({
      error:'content:missing'
    }))
  }


  const contact = new Contact({
      name: person.name,
      number: person.number,
  })
    
  contact
    .save()
    .then(savedContact => {
      return savedContact.toJSON()
    })
    .then(savedAndFormattedContact => {
      console.log('contact saved!')
      response.json(savedAndFormattedContact)
    })
    /*REVISAR AQUI, DEBERIAMOS ENVIAR SOLO NEXT ERROR*/
    .catch(error=>next(error))

  /*person.id = generateId()
  
  persons = persons.concat(person)*/
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = request.body

  const contact = {
    name: person.name,
    number: person.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact , {runValidators: true, context: 'query', new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    /*REVISAR AQUI, ENVIA HTML ???*/
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

