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
