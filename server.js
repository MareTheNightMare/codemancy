const express = require('express')
const app = express();

var cors = require('cors')

app.use(cors())

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 3000;

const fs = require('fs');
var database = fs.readFileSync('posts.json');
var allPosts = JSON.parse(database);

app.use(express.static('./'));

app.get('/',function(req, res){
  res.sendFile('src' + '/index.html');
});

app.get('/database',function(req, res){
  console.log('database working');
  res.json(allPosts);
});

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-post', (post) => {
      var data = post;
      allPosts.array.push(data);
      fs.writeFile('posts.json', JSON.stringify(allPosts, null, 2), () => {});
      io.sockets.emit('new-post', post);
    });

    socket.on('new-comment', (postComment) => {
      var data = postComment;
      const post = allPosts.array.find((obj) => obj.id == data.id);
      post.comments.push(data.comment);
      fs.writeFile('posts.json', JSON.stringify(allPosts, null, 2), () => {});
      io.sockets.emit('new-comment', postComment);
    })
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});