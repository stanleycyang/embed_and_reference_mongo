var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    port = 3000;

// Connect to mongodb
mongoose.connect('mongodb://localhost/blogs_app');


// Middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Models
var User = require('./models/User');
var Comment = require('./models/Comment');
var Blog = require('./models/Blog');

// Routing
router.get('/', function(request, response, next){
  response.send('Hello world!');
});

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
    Blog.find()
        .populate('comments.user')
        .exec(function(error, blogs){
            if(error) return response.send(error);
            response.send(blogs);
        });
  /*Blog.find(function(error, blogs){*/
    //if(error) return response.send(error);
    //response.send(blogs);
  /*});*/
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

router.get('/blogs/:id', function(request, response, next){
    Blog.findOne({_id: request.params.id})
        .populate('user')
        .exec(function(error, blog){
            if(error) return response.send(error);
            response.send(blog);
        });
/*  Blog.findOne({_id: request.params.id}, function(error, blog){*/
    //if(error) return response.send(error);
    //response.send(blog);
  /*});*/
});

router.put('/blogs/:id', function(request, response, next){
  Blog.update({_id: request.params.id}, {
    title: request.body.title
  }, function(error, blog){
    if(error) return response.send(error);
    response.send(blog);
  });
});

router.delete('/blogs/:id', function(request, response, next){
  Blog.findByIdAndRemove(request.params.id, function(error){
    if(error) return response.send(error);
    response.send({success: true, id: request.params.id});
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

router.delete('/blogs/:blog_id/comments/:comment_id', function(request, response, next){
  Blog.findOne({_id: request.params.blog_id}, function(error, blog){
    if(error) return response.send(error);
    blog.comments.id(request.params.comment_id).remove();
    blog.save(function(error){
      if(error) return response.send(error);
      response.send({success: true});
    });
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

var server = http.createServer(app);
server.listen(port);
console.log('Listening on port ' + port);
