const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]

const url =
  `mongodb://pablo:${password}@ac-de6pm8l-shard-00-00.pbzxn40.mongodb.net:27017,ac-de6pm8l-shard-00-01.pbzxn40.mongodb.net:27017,ac-de6pm8l-shard-00-02.pbzxn40.mongodb.net:27017/?ssl=true&replicaSet=atlas-zcxel5-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url)

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

if(process.argv.length===3){
    Contact.find({}).then(result => {
        result.forEach(contact => {
          console.log(contact)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length>3){
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
      
    contact.save().then(result => {
        console.log('contact saved!')
        mongoose.connection.close()
    })
      
}







