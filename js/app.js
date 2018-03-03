
let notes = [];
let count = 0;


// completing note
const completeNote = (object,reverseID) => {
	object.todo()[reverseID].completed(!object.todo()[reverseID].completed());
};

// viewModel
const viewModel = function() {
	// Observables
	this.entry = ko.observable();
	this.todo = ko.observableArray([]);

	// Class to create new note
	class note {
		constructor(input){
			this.info = ko.observable(input);
			this.completed = ko.observable(false);
			this.editing = ko.observable(false);
			this.display = ko.observable(true);
			this.id = ko.observable(count++);
		}
	}

	// Creates a new note object
	this.createNote = (input) => {
		const todo = new note(input);
		notes.unshift(todo);
		return todo;
	};

	// creating note from user input
	this.callCreateNote = (data,event) => {
		if(event.keyCode===13 && this.entry()){
			const newNote = this.createNote(this.entry());
			this.todo.unshift(newNote);
			this.entry('');
		}
		else{
			return true;
		}
	};

	// completing a todo
	this.callCompleteNote = (clickedNote) => {
		const n = this.todo().length - clickedNote.id() - 1;
		completeNote(this,n);
		console.log(clickedNote.info());
		return true;
	};

	// editing a note
	this.callEditNote = (clickedNote) => {
		clickedNote.editing(!clickedNote.editing());
	};

	// delete (remove display)
	this.callDeleteNote = (clickedNote) => {
		clickedNote.display(!clickedNote.display());
		return true;
	};

	// cancel editing
	this.cancelEditingNote = (clickedNote,event) => {
		if(event.keyCode===13)
			clickedNote.editing(false);
		else
			return true;
	};

	// show footer and toggle-all
	this.showAll = ko.computed(() => {
		let flag = 1;
		if(this.todo().length===0)
			return false;
		for(const a of this.todo()){
			if(a.display()){
				flag=0;
				break;
			}
		}
		if(flag)
			return true;
		else
			return false;
	});
};


const vm = new viewModel();
ko.applyBindings(vm);
