import Ember from 'ember';

export default Ember.Controller.extend({
	newTask: "",
	currentTask: null,
	isDisplayedAll: true,
	isDisplayedActive: false,
	isDisplayedCompleted: false,
	doNotShowEdit: false,
	addTaskError: "",
	lock: false,
	count: 0,
	oldCount: 0,
	total: 0,
	getCounter() {
		let count = 0,
		    total = 0;

    this.get('model').forEach((taskItem) => {
			if (!taskItem.get('completed') && !taskItem.get('deleted')) {
				count++;
			}
			total = taskItem.get('id');
    });

		this.set('total', total);
		return count;
	},
  taskCompletedDidChange: function() {
		let count = 0,
				model = this.get('model');

    model.forEach((taskItem) => {
			if (!taskItem.get('completed') && !taskItem.get('deleted')) {
				count++;
			}
    });
		this.set('count', count);
  }.observes('model.@each.completed'),
	actions: {
		saveTaskCompleted(task) {
			let self = this;

  			self.set('lock', true);

      /**
       * Simple checker that allow for handling of conflict due to how
       * input check box helper handles actions on different browsers.
       *
       * Problem occurs on some browsers like Safari when using `input (checkbox) helper`
       * where it does a two-way bind that updates the models property attached
       * to the `checked` attribute before being called action helper is called.
       * In other browsers this model property does not get updated
       * by the `checked` attribute. Using `taskCompletedDidChange` method
       * as a reference checker to see if checked attribute has already toggled/altered
       * the value of the property.
       */
			  if (this.get('oldCount') === this.get('count')) {
			    if (task.get('completed')) {
  			    task.set('completed', false);
			    } else {
  			    task.set('completed', true);
			    }
			  }

		  	task.save().then(function() {
	  		  self.set('lock', false);
	  		  self.set('oldCount', self.getCounter());
  			});

		},
		addTask() {
			let title  = this.get('newTask'),
			    self = this;

		  this.set('lock', true);

			if (title === '') {

				this.set('addTaskError', 'Must have a title');

			} else {

				let total = parseInt(this.get('total')) + 1,
				    name = 'todo-' + total;

				this.set('total', total);

				let task = this.get('store').createRecord('task', {
					name: name,
					title: this.get('newTask'),
					editing: false,
					completed: false,
					deleted: false
				});

				this.set('newTask', '');
				this.set('addTaskError', '');

			  task.save().then(function() {
				  self.set('lock', false);
				  self.set('oldCount', self.getCounter());
			  });

			}

		},
		showEdit(task) {

			if (!this.get('doNotShowEdit')) {

        this.get('model').forEach((taskItem) => {
					taskItem.set('editing', false);
        });

				task.set('editing', true);
				this.set('currentTask', task);

			}

		},
		editTask() {

			let title  = this.get('currentTask').get('title'),
			    self = this;

			this.set('lock', true);

			if (title === '') {

				this.get('currentTask').set('error', 'Must have a title');
				this.set('doNotShowEdit', true);

			} else {

        this.get('model').forEach((taskItem) => {
					taskItem.set('editing', false);
        });

				this.get('currentTask').set('error', '');
				this.set('doNotShowEdit', false);

				this.get('currentTask').save().then(function() {
				  self.set('lock', false);
			  });

			}

		},
		destroyTask(task) {
      let self = this;

      this.set('lock', true);
			task.set('deleted', true);

			if (!task.get('completed')) {
				let count = parseInt(this.get('count')) - 1;
				this.set('count', count);
			}

			this.get('store').findRecord('task', task.get('id'), { backgroundReload: false }).then(function(taskItem) {
			  taskItem.destroyRecord();
			  self.set('lock', false);
			  self.set('oldCount', self.getCounter());
			});

	  },
	  displayAll() {

	    this.set('isDisplayedAll', true);
	    this.set('isDisplayedActive', false);
	    this.set('isDisplayedCompleted', false);
	    this.set('count', this.getCounter());
	    this.set('oldCount', this.get('count'));

	  },
	  displayCompleted() {

	    this.set('isDisplayedAll', false);
	    this.set('isDisplayedActive', false);
	    this.set('isDisplayedCompleted', true);
	    this.set('count', this.getCounter());
	    this.set('oldCount', this.get('count'));

	  },
	  displayActive() {

	    this.set('isDisplayedAll', false);
	    this.set('isDisplayedActive', true);
	    this.set('isDisplayedCompleted', false);
	    this.set('count', this.getCounter());
	    this.set('oldCount', this.get('count'));

	  },
	}
});
