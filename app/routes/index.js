import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.get('store').findAll('task', { backgroundReload: false });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    controller.set('count', controller.getCounter());
	    controller.set('oldCount', controller.get('count'));
	}
});
