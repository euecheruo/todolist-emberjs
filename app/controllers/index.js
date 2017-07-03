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

    model.forEach((taskItem, index) => {
			if (!taskItem.get('completed') && !taskItem.get('deleted')) {
				count++;
			}
    });
		this.set('count', count);
  }.observes('model.@each.completed'),
	actions: {
		saveTaskCompleted(task) {
			task.save();
		},
		toggleTaskCompleted(task) {
		},
		addTask() {

			let title  = this.get('newTask'),
			    controller = this;

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
				  controller.set('lock', false);
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
			    controller = this;

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
				  controller.set('lock', false);
			  });

			}

		},
		destroyTask(task) {

      let controller = this;

      this.set('lock', true);
			task.set('deleted', true);

			if (!task.get('completed')) {
				let count = parseInt(this.get('count')) - 1;
				this.set('count', count);
			}

			this.get('store').findRecord('task', task.get('id'), { backgroundReload: false }).then(function(taskItem) {
			  taskItem.destroyRecord();
			  controller.set('lock', false);
			});

	  },
	  displayAll() {

	    this.set('isDisplayedAll', true);
	    this.set('isDisplayedActive', false);
	    this.set('isDisplayedCompleted', false);
	    this.set('count', this.getCounter());

	  },
	  displayCompleted() {

	    this.set('isDisplayedAll', false);
	    this.set('isDisplayedActive', false);
	    this.set('isDisplayedCompleted', true);
	    this.set('count', this.getCounter());

	  },
	  displayActive() {

	    this.set('isDisplayedAll', false);
	    this.set('isDisplayedActive', true);
	    this.set('isDisplayedCompleted', false);
	    this.set('count', this.getCounter());

	  },
	}
});
