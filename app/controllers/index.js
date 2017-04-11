import Ember from 'ember';

export default Ember.Controller.extend({
	newTask: "",
	currentTask: null,
	taskComplete: false,
	isDisplayedAll: true,
	isDisplayedActive: false,
	isDisplayedCompleted: false,
	doNotShowEdit: false,
	addTaskError: "",
	count: 0,
	total: 0,
	getCounter() {
		let count = 0;
		let total = 0;
		this.get('model').forEach(function(taskItem) {
			if (!taskItem.get('completed') && !taskItem.get('deleted')) {
				count++;
			}
			total = taskItem.get('id');
		});
		
		this.set('total', total);
		return count;
	},
	actions: {
		toggleCompleted(task) {

			let count = parseInt(this.get('count'));
			if (task.get('completed')) {
				this.set('count', count + 1);
				task.set('completed', false);
			} else {
				this.set('count', count - 1);
				task.set('completed', true);
			}
			task.save();
			
		},
		addTask() {

			let title  = this.get('newTask');
			if (title === '') {
				
				this.set('addTaskError', 'Must have a title');	
				
			} else {
				
				let total = parseInt(this.get('total')) + 1;
				let name = 'todo-' + total;
				
				this.set('total', total);
				
				let taskComplete = this.get('taskComplete');
				let task = this.get('store').createRecord('task', {
					name: name,
					title: this.get('newTask'),
					editing: false,
					completed: taskComplete,
					deleted: false
				});
				task.save();

				if (!taskComplete) {
					let count = parseInt(this.get('count'));
					this.set('count', count + 1);
				}
				
				this.set('newTask', '');
				this.set('taskComplete', false);
				this.set('addTaskError', '');
				
			}	
			
		},
		showEdit(task) {

			if (!this.get('doNotShowEdit')) {

				this.get('model').forEach(function(taskItem) {
					taskItem.set('editing', false);
				});
				
				task.set('editing', true);
				this.set('currentTask', task);
				
			}
						
		},
		editTask() {

			let title  = this.get('currentTask').get('title');
			if (title === '') {
				
				this.get('currentTask').set('error', 'Must have a title');
				this.set('doNotShowEdit', true);
				
			} else {
				
				this.get('model').forEach(function(taskItem) {
					taskItem.set('editing', false);
				});

				this.get('currentTask').set('error', '');
				this.get('currentTask').save();
				this.set('doNotShowEdit', false);
				
			}
			
		},
		destroyTask(task) {
			
			task.set('deleted', true);
			
			this.get('store').findRecord('task', task.get('id'), { backgroundReload: false }).then(function(taskItem) {
				taskItem.destroyRecord();
			});

			if (!task.get('completed')) {
				let count = parseInt(this.get('count')) - 1;
				this.set('count', count);
			}			
			
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
	    	this.set('count', 0);
	    	
	    },
	    displayActive() {
	    	
	    	this.set('isDisplayedAll', false);
	    	this.set('isDisplayedActive', true);
	    	this.set('isDisplayedCompleted', false);
	    	this.set('count', this.getCounter());
	    	
	    },
	}	
});
