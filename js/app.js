// Storing data locally
const saveDataLocally = (object) => {
	localStorage.setItem('todos',ko.toJSON(object.todo()));
};

// Class to create new note
class note {
	constructor(input,completed=false,editing=false,display=true){
		this.info = ko.observable(input);
		this.completed = ko.observable(completed);
		this.editing = ko.observable(editing);
		this.display = ko.observable(display);
	}
}

// viewModel
class viewModel {
	constructor(){
		// Observables
		this.entry = ko.observable();
		this.todo = ko.observableArray([]);
		this.left = ko.observable(0);
		this.tickAll = ko.observable(false);
		this.selectedA = ko.observable(true);
		this.selectedActive = ko.observable(false);
		this.selectedC = ko.observable(false);
		this.showLeft = ko.observable(0);
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
	}

	// saving and accessing local storage
	getLocalData(){
		if(localStorage && localStorage.getItem('todos')) {
			var data = JSON.parse(localStorage.getItem('todos'));
			for(const a of data) {
				vm.todo.push(new note(a.info,a.completed,a.editing,a.display));
			}
		}
	}

	// Creates a new note object
	createNote(input){
		const todo = new note(input);
		return todo;
	};

	// creating note from user input
	callCreateNote(data,event){
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
	callCompleteNote(clickedNote){
		clickedNote.completed(!clickedNote.completed());
		saveDataLocally(this);
		return true;
	};

	// editing a note
	callEditNote(clickedNote){
		clickedNote.editing(!clickedNote.editing());
		saveDataLocally(this);
	};

	// delete (remove display)
	callDeleteNote(clickedNote){
		clickedNote.display(!clickedNote.display());
		clickedNote.completed(true);
		const n=this.todo().indexOf(clickedNote)
		this.todo().splice(n,1);
		this.showLeft(this.todo().length);
		saveDataLocally(this);
		return true;
	};

	// cancel editing
	cancelEditingNote(clickedNote,event){
		if(event.keyCode===13)
			clickedNote.editing(false);
		else
			return true;
	};



	// Mark all completed
	markAllComplete(){
		this.tickAll(!this.tickAll());
		for(const a of this.todo())
			if(this.tickAll())
				a.completed(true);
			else
				a.completed(false);

		saveDataLocally(this);
	};

	// Clear all completed todos
	clearCompleted(){
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
	showAllTodo(){
		for(const a of this.todo())
			a.display(true);
		this.selectedA(true);
		this.selectedC(false);
		this.selectedActive(false);
		return true;
	};

	// Show active todos
	showActive(){
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
	showCompleted(){
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
