import {Template} from 'meteor/templating';
import {Tasks} from '../api/tasks.js';
import './task.html';

Template.task.events({
    // inside here "this" refers to a task object
    'click .mark-learned-button'() {
        Tasks.update(this._id, {
            $set: {
                learned: !this.learned
            },
        });
    },
    'click .delete-task-button'() {
        Tasks.remove(this._id);
    },
});
