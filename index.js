
const express = require("express");
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(morgan('tiny'));


let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-type": "application/json" });
//   response.end(JSON.stringify(notes));
//   // console.log(request);
// });
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
  res.json(notes);
});

app.get('/api/notes/:id', (req, res)=>{
  const id = req.params.id;
  const note = notes.find(note=>note.id===id);
  if(note)
    res.json(note);
  else
    res.status(404).end();
});

app.delete('/api/notes/:id', (req, res)=>{
  const id = req.params.id;
  notes = notes.filter(note=>note.id!==id);
  res.status(204).end();
});

app.post('/api/notes', (req, res)=>{
  let note = req.body;
  if(!note.content) {
    return res.status(400).json({error: "content missing"}).end();
  }

  // console.log(note);

  note = {
    id: generateId(),
    content: note.content,
    important: note.important||false
  };
  notes = notes.concat(note)
  res.json(note).end();
});
const generateId = () => {
  const maxId = notes.length>0?Math.max(...notes.map(n=>Number(n.id))):0
  return maxId+1;
}
const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
}
app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});
