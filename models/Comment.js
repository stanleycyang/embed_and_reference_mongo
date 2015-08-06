var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
