/*jshint esversion: 6*/
let notes = [];
let count = 0;

// Creates a new note object
const createNote = function(input) {
	var todo = new note(input);
	notes.push(todo);
	return todo;
};

// Class to create new note
class note {
	constructor(input){
		this.info = input;
		this.completed = false;
		this.display = true;
		this.id = count++;
	}
}


// viewModel
const viewModel = function() {
	const self = this;

	self.entry = ko.observable();
	self.todo = ko.observableArray([]);

	// creating note from user input
	self.callCreateNote = function(data,event){
		if(event.keyCode===13 && self.entry()){
			const newNote = createNote(self.entry());
			self.todo.push(newNote);
			self.entry('');
		}
		else{
			return true;
		}
	};

	// editing a note
	self.callEditNote = function(){

	};
};






const vm = new viewModel();
ko.applyBindings(vm);
