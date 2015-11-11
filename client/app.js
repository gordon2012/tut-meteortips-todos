// ======== todos ========
//
Template.todos.helpers
({
	'todo': function()
	{
		var currentList = this._id;
		var currentUser = Meteor.userId();
		return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
	},

});

// ======== todoItem ========
//
Template.todoItem.helpers
({
	'checked': function()
	{
		return this.completed === true ? "checked" : "";
	}
});

Template.todoItem.events
({
	'click .delete-todo': function(event)
	{
		event.preventDefault();
		if(window.confirm("Delete this task?"))
		{
			Todos.remove({_id: this._id});
		}
	},

	'keyup [name=todoItem]': function(event)
	{
		if(event.which === 13 || event.which === 27)
		{
			$(event.target).blur();
		}
		else
		{
			var documentId = this._id;
			var todoItem = $(event.target).val();
			Todos.update({_id: documentId}, {$set: {name: todoItem}});
		}
	},

	'change [type=checkbox]': function()
	{
		var documentId = this._id;
		var isCompleted = this.completed;

		Todos.update({_id: documentId}, {$set: {completed: !isCompleted}});
	}
});



// ======== addTodo ========
//
Template.addTodo.events
({
	'submit form': function(event)
	{
		event.preventDefault();
		var todoName = $('[name="todoName"]').val();
		var currentUser = Meteor.userId();
		var currentList = this._id;
		Todos.insert
		({
			name: todoName,
			completed: false,
			createdAt: new Date(),
			createdBy: currentUser,
			listId: currentList
		});
		$('[name="todoName"]').val('');
	}
});


// ======== todosCount ========
//
Template.todosCount.helpers
({
	'totalTodos': function()
	{
		var currentList = this._id;
		return Todos.find({listId: currentList}).count();
	},

	'completedTodos': function()
	{
		var currentList = this._id;
		return Todos.find({listId: currentList, completed: true}).count();
	}

});



// ========  addList ========
//
Template.addList.events
({
	'submit form': function(event)
	{
		event.preventDefault();
		var listName = $('[name=listName]').val();
		var currentUser = Meteor.userId();
		Lists.insert
		({
			name: listName,
			createdBy: currentUser
		}, function(error, results)
		{
			Router.go('listPage', {_id: results});
		});
		$('[name=listName]').val('');
	}
});


// ======== lists ========
//
Template.lists.helpers
({
	'list': function()
	{
		var currentUser = Meteor.userId();
		return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
	}
});



// ======== register ========
//
Template.register.events
({
	'submit form': function(event)
	{
		event.preventDefault();
	}
});

Template.register.onRendered(function()
{
	$('.register').validate
	({
		submitHandler: function(event)
		{
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Accounts.createUser
			({
				email: email,
				password: password
			}, function(error)
			{
				if (error)
				{
					console.log(error.reason)
				}
				else
				{
					Router.go("home");
				}
			});
		}
	});
});


// ======== navigation ========
//
Template.navigation.events
({
	'click .logout': function(event)
	{
		event.preventDefault();
		Meteor.logout();
		Router.go('login');
	}
});



// ======== login ========
//
Template.login.events
({
	'submit form': function(event)
	{
		event.preventDefault();
	}
});


Template.login.onCreated(function()
{
	console.log("The 'login' template was just created.");
});

Template.login.onRendered(function()
{
	$('.login').validate
	({
		submitHandler: function(event)
		{
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Meteor.loginWithPassword(email, password, function(error)
			{
				if(error)
				{
					console.log(error.reason);
				}
				else
				{
					var currentRoute = Router.current().route.getName();
					if(currentRoute === "login")
					{
						Router.go("home");
					}
				}
			});
		}
	});
});

Template.login.onDestroyed(function()
{
	console.log("The 'login' template was just destroyed.");
});




// ======== DEFAULTS ========

$.validator.setDefaults
({
	rules:
	{
		email:
		{
			required: true,
			email: true
		},
		password:
		{
			required: true,
			minlength: 6
		}
	},
	messages:
	{
		email:
		{
			required: "You must enter an email address.",
			email: "You've entered an invalid email address."
		},
		password:
		{
			required: "You must enter a password.",
			minlength: "Your password must be at least {0} characters."
		}
	}
});








// EOF
