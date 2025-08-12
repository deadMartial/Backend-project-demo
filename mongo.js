const mongoose = require('mongoose');

if(process.argv.length<3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
console.log(password);

const url = `mongodb+srv://fullstack:${password}@cluster0.wuifgiw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({content: 'Mongoose makes things easy', important: true});
// console.log(note);

// note.save().then(result=>{
//   console.log('note saved');
//   mongoose.connection.close();
// });

Note.find({}).then(results=>{
  // console.log(results);
  results.forEach(note=>{
    console.log(note);
  });
  mongoose.connection.close();
});

