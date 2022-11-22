require ('dotenv') . config()
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




app.get('/',(request, response) => {
  response.send('<h1>Hellow world</h1>')
})

app.get('/info',(request, response) => {
  Contact.find({}).then(contacts => {
    response.send(`<p>Phonebook has info for ${contacts.length} people</p> <p> ${Date()} </p>`)
  })
})

app.get('/api/persons',(request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id',(request,response, next) => {

  Contact.findById(request.params.id)
    .then( contact => {
      if(contact){
        response.json(contact)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons',morgan(':method :url :status :res[content-length] - :response-time ms :body') , (request, response, next) => {
  const person = request.body

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
    .catch( error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const person = request.body

  const contact = {
    name: person.name,
    number: person.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact , { runValidators: true, context: 'query', new: true })
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
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

