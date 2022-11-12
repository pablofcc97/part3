const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

let persons= [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Pablo Fabian",
      "number": "956487231",
      "id": 5
    }
]

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
  response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  const person = persons.find(person=>person.id===id)

  if(person){
    response.json(person)
  }else{
    response.status(404).end
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons',morgan(':method :url :status :res[content-length] - :response-time ms :body') , (request, response) => {
  const person = request.body
  const name = String(person.name)

  if(!person.name || !person.number){
    return(response.status(400).json({
      error:'content:missing'
    }))
  }

  const exist = persons.find(e=>e.name===name)
  
  
  if(exist){
    console.log(`Nombre existente ${exist.name}`)
    return(response.status(400).json({
      error:'name must be unique'
    }))
  }

  person.id = generateId()
  
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

