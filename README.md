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

###Getting started

    $ mkdir embed_reference_demo && cd embed_reference_demo
    $ npm init -f
    $ npm install --save mongoose body-parser express mongoose morgan

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

###Routing

```

// Models
var User = require('./models/User');
var Comment = require('./models/Comment');
var Blog = require('./models/Blog');

router.get('/users', function(request, response, next){
   User.find(function(error, users){
      if(error) return response.send(error);
      response.send(users);
   });
});

router.post('/users', function(request, response, next){
  var user = new User();
  user.name = request.body.name;

  user.save(function(error, user){
    if(error) return response.send(error);
    response.send(user);
  });
});

router.get('/blogs', function(request, response, next){
  Blog.find(function(error, blogs){
    if(error) return response.send(error);
    response.send(blogs);
  });
});

router.post('/blogs', function(request, response, next){
  var blog = new Blog();
  blog.title = request.body.title;
  blog.user = request.body.user;

  blog.save(function(error, blog){
    if(error) return response.send(error);
    response.send(blog);
  });
});

router.get('/blogs/:blog_id/comments', function(request, response, next){
  Blog.findOne({_id: request.params.blog_id}, function(error, blog){
    if(error) return response.send(error);
    response.send(blog.comments);
  });
});

router.get('/blogs/:blog_id/comments/:comment_id', function(request, response, next){
  Blog.findOne({_id: request.params.blog_id}, function(error, blog){
    if(error) return response.send(error);
    response.send(blog.comments.id(request.params.comment_id));
  });
});

router.post('/blogs/:blog_id/comments', function(request, response, next){
  Blog.findOne({_id: request.params.blog_id}, function(error, blog){
    blog.comments.push({content: request.body.content, user: request.body.user});
    blog.save(function(error, blog){
      if(error) return response.send(error);
      response.send(blog);
    });
  });
});

app.use('/', router);

```

###Conclusion

Our app can now reference user into the comments / blogs, and embed comments in the blogs.
