require('dotenv').config();
const Note = require('./module/note')
const express = require("express");
// const morgan = require('morgan');
const app = express();
// app.use(morgan('tiny'));
app.use(express.static('dist'));
// const cors = require('cors');
// app.use(cors());

// app.use((req,res)=>{
//   console.log(req);
// });
setTimeout(() => {
  console.log('waiting...')
}, 5000);
let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log('Method', req.method);
  console.log('Path', req.path);
  console.log('Body', req.body);
  next();
};
app.use(requestLogger);



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res)=> {
  Note.find({}).then(notes=>{
    res.json(notes);
  });
});

app.get('/api/notes/:id', (req, res, next)=>{
  const id = req.params.id;
  Note.findById(id).then(note=>{
    if(note)
      res.json(note);
    else
      res.status(404).end();
  }).catch(error=>next(error));  
});

app.delete('/api/notes/:id', (req, res, next)=>{
  Note.findIdAndDelete(req.params.id).then(result=>{
    res.status(204).end();
  }).catch(error=>next(error));
});

app.post('/api/notes', (req, res, next)=>{
  let note = req.body;
  if(!note.content) {
    return res.status(400).json({error: "content missing"}).end();
  }

  // console.log(note);
    
  note = new Note({
    content: note.content,
    important: note.important||false
  });
  note.save().then(savedNote=>{
    res.json(savedNote);
  }).catch(error=>next(error));
});
// 689ab9683c6ffc0b33fec023
app.put('/api/notes/:id', (req, res, next)=>{
  const {content, important} = req.body;
  console.log(req.body);
  Note.findById(req.params.id).then(note=>{
    if(!note)
      return res.status(404).end();
  
    note.content = content;
    note.important = important;

    return note.save().then(updatedNote=>{
      res.json(updatedNote);
    })
  }).catch(err=>next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next)=>{
  console.log(error);
  if(error.name==='CastError'){
    return res.status(400).send({error: 'malformatted id'});
  }else if(error.name==='ValidationError'){
    return res.status(400).json({error: error.message});
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});
