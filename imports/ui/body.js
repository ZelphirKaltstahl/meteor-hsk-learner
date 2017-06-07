import {Template} from 'meteor/templating';
import {Tasks} from '../api/tasks.js';

import './body.html';

Template.body.helpers({
    tasks() {
        return Tasks.find(
            {},
            {sort: {createdAt: -1}}
        );
    },
});


Template.body.events({
  'submit .new-task-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const form_element = event.target;
    const text = form_element.new_task_text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    form_element.new_task_text.value = '';
  },
});
