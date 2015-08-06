#Embedding and Referencing

###Purpose

Understand how to embed and reference with MongoDB. 

###Blog example

Let's do some data modeling with Blogs. 

###Models

- Blog (title: String, comments: [Comments], user: reference)
- User (name: String)
- Comment (content: String, user: reference)

We will have to embed our comments into blogs.
Blog will reference the User
Comment will reference the User

###Blog Model

```
var mongoose = require('mongoose');

var Comment = mongoose.model('Comment');

var BlogSchema = new mongoose.Schema({
  title: String,
  comments: [Comment.schema],
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

var Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
```

###User Model

```
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
```

###Comment Model

```
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
```

In `main.js`

```

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    port = 3000;
// Connect to mongodb
mongoose.connect('mongodb://localhost/blogs_app');


// Middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

    
var server = http.createServer(app);
server.listen(port);
console.log('Listening on port ' + port);

```
