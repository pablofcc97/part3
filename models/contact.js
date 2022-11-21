const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      unique: true,
      required: true
    },
    number: {
      type: String,
      minlength:8,
      unique: true,
      required:true
    },
    id: Number,
  })
contactSchema.plugin(uniqueValidator)

const Contact = mongoose.model('Contact', contactSchema)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)