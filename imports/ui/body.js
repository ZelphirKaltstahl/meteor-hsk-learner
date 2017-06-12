import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Tasks} from '../api/tasks.js';
import {VocabularyItems} from '../api/vocabulary_items.js';
import {read_file} from '../api/file_reading.js';
import {export_file} from '../api/file_writing.js';

import './body.html';


Template.body.onCreated(
    function bodyOnCreated() {
        // a ReactiveDict is not synchronized with the server
        this.state = new ReactiveDict();
    }
);


Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        if (instance.state.get('hide_learned')) {
            return Tasks.find(
                {learned: {$ne: true}},
                {sort: {createdAt: -1}}
            );
        }
        // Otherwise, return all of the tasks
        return Tasks.find(
            {},
            {sort: {createdAt: -1}}
        );
    },
    incompleteCount() {
        return Tasks.find(
            {learned: {$ne: true}}
        ).count();
    },
    vocabulary_items() {
        const instance = Template.instance();

        if (instance.state.get('hide_learned')) {
            return VocabularyItems.find(
                {"metadata.learned": {$ne: true}},
                {sort: {"metadata.id": 1}},
            );
        }
        return VocabularyItems.find(
            {},
            {sort: {"metadata.id": 1}}
        );
    },
    not_learned_count() {
        return VocabularyItems.find(
            {"metadata.learned": {$ne: true}}
        ).count();
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
            createdAt: new Date(),
            learned: false,
        });

        // Clear form
        form_element.new_task_text.value = '';
    },

    'change .js-hide-learned-checkbox'(event, instance) {
        instance.state.set('hide_learned', event.target.checked);
    },

    'change .js-import-file-input'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        read_file(event.target.files[0], (event) => {
            var vocabulary = JSON.parse(event.target.result);
            if (vocabulary.metadata.identifier !== instance.state.get('selected_vocabulary')) {
                Meteor.call('remove_all_vocabulary_items');
                Meteor.call('bulk_insert_vocabulary_items', vocabulary.words);
                instance.state.set('selected_vocabulary', vocabulary.metadata.identifier);
                instance.state.set('vocabulary_metadata', vocabulary.metadata);
            }
        });
    },

    'click .js-download'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        function calculate_learned_percentage(list_of_words) {
            list_of_words.forEach((word) => {delete word._id});
            var learned_count = list_of_words
                .filter((word) => word.metadata.learned)
                .length;
            return 100.0 / list_of_words.length * learned_count;
        }

        function cleanup_words(list_of_words) {
            list_of_words.forEach((word) => {delete word._id});
            return list_of_words;
        }

        var export_data = {};
        var list_of_words = VocabularyItems
            .find({})
            .map((elem, ind, arr) => elem);

        if (instance.state.get('vocabulary_metadata')) {
            export_data['metadata'] = instance.state.get('vocabulary_metadata');
        } else {
            export_data['metadata'] = {
                'identifier': 'custom_vocabulary',
                'learned_percentage': calculate_learned_percentage(list_of_words),
                'count': list_of_words.length,
                'source_note': 'unknown'
            };
        }

        list_of_words = cleanup_words(list_of_words);
        export_data['metadata']['learned_percentage'] = calculate_learned_percentage(list_of_words);
        export_data['words'] = list_of_words;

        // var data_uri = 'data:plain/text,' + JSON.stringify(export_data);
        var data_uri = 'data:application/json;charset=utf-8,'
            + encodeURIComponent(JSON.stringify(export_data));

        export_file(data_uri, 'vocabulary.json');
    }
});
