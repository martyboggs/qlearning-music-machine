var fs = require('fs');
var Midi = require('jsmidgen');
var l = 20;

var file = new Midi.File();

var note;
var lastNote;



var bass = file.addTrack();
for (var i = 0; i < 100; i += 1) {
	while (note === lastNote) {
		note = ['a', 'bb', 'b', 'c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'g#'][Math.floor(12 * Math.random())];
	}
	bass.addNote(0, note + '2', l * 2);
	lastNote = note;
}
bass.noteOff(0, 'c4', 384);


var melody = file.addTrack();
// melody.instrument(1, 0x16);
var length;
melody.noteOff(1, 'c4', 384);
for (var i = 0; i < 200; i += 1) {
	while (note === lastNote) {
		note = ['a', 'bb', 'b', 'c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'g#'][Math.floor(12 * Math.random())];
	}
	length = [1, 4][Math.random() > 0.9 ? 1 : 0] * l;
	if (length === 4 * l) {
		Math.random() > 0.5 ? melody.addNote(1, note + '3', length) : melody.noteOff(1, note + '3', length);
	} else {
		melody.addNote(1, note + '3', length);
	}
	lastNote = note;
}
melody.noteOff(1, 'c4', 20 * l);

fs.writeFileSync('test.mid', file.toBytes(), 'binary');
