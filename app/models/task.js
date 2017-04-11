import DS from 'ember-data';

export default DS.Model.extend({
	title: DS.attr('string'),
	name: DS.attr('string'),
	error: DS.attr('string'),
	editing: DS.attr('boolean'),
	completed: DS.attr('boolean'),
	deleted: DS.attr('boolean')
});

/*
Task.reopenClass({
	FIXTURES: [
	    {
	    	id: 1,	
	    	name: 'todo-1',
	      	title: 'This is Task 1',
	      	error: '',
	      	editing: false,
	      	completed: false,
	      	deleted: false,
	    },
	    {
			id: 2,	
	    	name: 'todo-2',
			title: 'This is Task 2',
	      	error: '',
			editing: false,
			completed: false,
			deleted: false,
	    },
	    {
	    	id: 3,	
	    	name: 'todo-3',
	    	title: 'This is Task 3',
	      	error: '',
	    	editing: false,
	    	completed: false,
	    	deleted: false,
	    },
	    {
	    	id: 4,
	    	name: 'todo-4',
	    	title: 'This is Task 4',
	      	error: '',
	    	editing: false,
	    	completed: false,
	    	deleted: false,
	    }
	 ]
});

export default Task;
*/