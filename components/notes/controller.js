const store = require("./store");

function getNotes() {
	return new Promise((resolve, reject) => {
		resolve(store.list());
	});
}

function addNote(request) {
	console.log(request);
	return new Promise((resolve, reject) => {
		resolve(store.add(request));
	});
}

function editNote(request) {
	console.log(request)
	return new Promise((resolve, reject) => {
		resolve(store.edit(request))
	})
}

function deleteNote(request) {
	return new Promise((resolve, reject) => {
		resolve(store.delete(request))
	})
}

module.exports = {
	getNotes,
	addNote,
	editNote,
	deleteNote
};
