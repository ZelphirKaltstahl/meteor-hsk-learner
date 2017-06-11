import {Template} from 'meteor/templating';
import {VocabularyItems} from '../api/vocabulary_items.js';
import './vocabulary_item.html';


Template.vocabulary_item.events({
    // inside here "this" refers to hskitem object
    'click .js-learned-vocabulary-item-button'() {
        var doc = VocabularyItems.findOne(this._id);
        VocabularyItems.update(
            this._id,
            {$set: {"metadata.learned": !doc.metadata.learned}}
        );
    },
    'click .js-delete-vocabulary-item-button'() {
        VocabularyItems.remove(this._id);
    },
});


Template.vocabulary_item.helpers({
    split_string(a_string) {
        return a_string.split("");
    },
});
