// Storing data locally
const saveDataLocally = (object) => {
	localStorage.setItem('todos',ko.toJSON(object.todo()));
};

// viewModel
const viewModel = function() {
	// Observables
	this.entry = ko.observable();
	this.todo = ko.observableArray([]);
	this.left = ko.observable(0);
	this.tickAll = ko.observable(false);
	this.selectedA = ko.observable(true);
	this.selectedActive = ko.observable(false);
	this.selectedC = ko.observable(false);
	this.showLeft = ko.observable(0);

	// Class to create new note
	class note {
		constructor(input,completed=false,editing=false,display=true){
			this.info = ko.observable(input);
			this.completed = ko.observable(completed);
			this.editing = ko.observable(editing);
			this.display = ko.observable(display);
		}
	}

	// saving and accessing local storage
	this.getLocalData = () => {
		if(localStorage && localStorage.getItem('todos')) {
			var data = JSON.parse(localStorage.getItem('todos'));
			for(const a of data) {
				vm.todo.push(new note(a.info,a.editing,a.completed,a.display));
			}
		}
		else
			console.log('be');
	}

	// Creates a new note object
	this.createNote = (input) => {
		const todo = new note(input);
		return todo;
	};

	// creating note from user input
	this.callCreateNote = (data,event) => {
		if(event.keyCode===13 && this.entry()){
			const newNote = this.createNote(this.entry());
			this.todo.unshift(newNote);
			this.entry('');
			saveDataLocally(this);
		}
		else
			return true;
	};

	// completing a todo
	this.callCompleteNote = (clickedNote) => {
		clickedNote.completed(!clickedNote.completed());
		return true;
	};

	// editing a note
	this.callEditNote = (clickedNote) => {
		clickedNote.editing(!clickedNote.editing());
	};

	// delete (remove display)
	this.callDeleteNote = (clickedNote) => {
		clickedNote.display(!clickedNote.display());
		clickedNote.completed(true);
		const n=this.todo().indexOf(clickedNote)
		this.todo().splice(n,1);
		this.showLeft(this.todo().length);
		saveDataLocally(this);
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
		if(this.showLeft()===0)
			return false;
		else
			return true;
	});

	// Item left computed
	this.itemLeft = ko.computed(() => {
		let left=0;
		let total=0;
		for(let a=0;a<this.todo().length;a++){
			total++;
		}
		for(const l of this.todo()){
			if(l.completed()===false)
				left++;
		}
		this.showLeft(total);
		this.left(left);
	});

	// Mark all completed
	this.markAllComplete = () => {
		this.tickAll(!this.tickAll());
		for(const a of this.todo())
			if(this.tickAll())
				a.completed(true);
			else
				a.completed(false);
		saveDataLocally(this);
	};

	// Clear all completed todos
	this.clearCompleted = () => {
		for(let a=0;a<this.todo().length;a++)
			if(this.todo()[a].completed()===true){
				this.todo()[a].display(false);
				this.todo().splice(a,1);
				a--;
			}
		this.showLeft(this.todo().length);
		this.tickAll(false);
		saveDataLocally(this);
	};

	// Show all todos
	this.showAllTodo = () => {
		for(const a of this.todo())
			a.display(true);
		this.selectedA(true);
		this.selectedC(false);
		this.selectedActive(false);
		return true;
	};

	// Show active todos
	this.showActive = () => {
		for(const a of this.todo())
			if(a.completed()===false)
				a.display(true);
			else
				a.display(false);
		this.selectedA(false);
		this.selectedC(false);
		this.selectedActive(true);
		return true;
	};

	// Show completed todos
	this.showCompleted = () => {
		for(const a of this.todo())
			if(a.completed()===true)
				a.display(true);
			else
				a.display(false);
		this.selectedA(false);
		this.selectedC(true);
		this.selectedActive(false);
		return true;
	};
};


const vm = new viewModel();
ko.applyBindings(vm);

vm.getLocalData();
