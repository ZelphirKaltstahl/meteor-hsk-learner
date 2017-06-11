import {Meteor} from 'meteor/meteor';
import '../imports/api/tasks.js';
import {VocabularyItems} from '../imports/api/vocabulary_items.js';


Meteor.startup(function() {

});

Meteor.methods({
    remove_all_vocabulary_items: function () {
        VocabularyItems.remove({});
    },
    bulk_insert_vocabulary_items: function(items) {
        bulk = VocabularyItems.rawCollection().initializeOrderedBulkOp();
        items.forEach((item, ind, arr) => {
            bulk.insert(item);
        });
        bulk.execute();
    }
});
