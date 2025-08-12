const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

// const url = 'mongodb+srv://fullstack:ytR40E1qf1vrPrsN@cluster0.wuifgiw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0';
const url = process.env.MONGODB_URL;
console.log('connection to ', url);
mongoose.connect(url)
.then(result=>{
  // console.log(result);
  console.log('connected to MongoDB');
}).catch(error=>{
  console.log('error connecting to MongoDB: ', error.message);
});

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: {
    type: Boolean
  }
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
