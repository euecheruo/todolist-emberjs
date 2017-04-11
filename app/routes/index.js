import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.get('store').findAll('task');
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    controller.set('count', controller.getCounter());
  
	}
});
