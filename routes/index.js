
/*
 * GET home page.
 */

exports.index = function() {
  return function(req, res) {
       console.log(req.user);
       console.log(res.user);
      res.render('index', {
        title: 'Profilo',
        user : req.user
      });

  };
};

exports.login = function() {
  return function(req, res) {
    res.render('login', {
      title: 'login'
    });
  };
};


exports.addTodo = function(Todo) {
  return function(req, res) {
    var todo = new Todo(req.body);
    todo.save(function(error, todo) {
      if (error || !todo) {
        res.json({ error : error });
      } else {
        res.json({ todo : todo });
      }
    });
  };
};

exports.get = function(Todo) {
  return function(req, res) {
    Todo.find({}, function(error, todos) {
      res.json({ todos : todos });
    });
  }
};

exports.update = function(Todo) {
  return function(req, res) {
    Todo.findOne({ _id : req.params.id }, function(error, todo) {
      if (error || !todo) {
        res.json({ error : error });
      } else {
        todo.done = req.body.done;
        todo.save(function(error, todo) {
          if (error || !todo) {
            res.json({ error : error });
          } else {
            res.json({ todo : todo });
          }
        });
      }
    });
  }
};