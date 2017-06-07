import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './task.html';

Template.task.events({
    // inside here "this" refers to a task object
    'click .mark-done-button'() {
        console.log('clicked toggle');
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {
            $set: {
                done: !this.done
            },
        });
    },
    'click .delete-task-button'() {
        console.log('clicked delete');
        Tasks.remove(this._id);
    },
});
