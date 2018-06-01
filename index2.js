var fs = require('fs');
var Midi = require('jsmidgen');
var l = 64;

var file = new Midi.File();
var time = 0;
var note;
var lastLength = 0;
var noteLookup = {c: 0, 'c#': 1, 'db': 1, d: 2, 'd#': 3, 'eb': 3, e: 4, f: 5, 'f#': 6, 'gb': 6, g: 7, 'g#': 8, 'ab': 8, a: 9, 'a#': 10, 'bb': 10, b: 11};
var scale = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];




// don't recreate music, it must be done so we can relate, but will still retain some strangeness from the medium/constraints

var bass = file.addTrack();
bass.instrument(1, 0x16);
var melody = file.addTrack();
melody.instrument(0, 0x16);

var chords = [
	['a1', 'c2', 'e2', 'c2'],
	['f2', 'a2', 'c3', 'a2'],
	['d2', 'a2', 'f2', 'a2'],
	['f2', 'a2', 'c3', 'a2'],
];

var j = 0;

var length, length2, interval, lastNote;
// melody.noteOff(1, 'c4', l*3);
for (var i = 0; i < 150; i += 1) {

	// base
	if (i % 2 === 0) {
		// console.log('bass', chords[j], chords[j][(i / 2) % 4], 2);
		bass.addNote(1, chords[j][(i / 2) % 4], l * 2);
	}


	// melody
	if (lastLength === 0) {
		m_note = chords[j][Math.floor(chords[j].length * Math.random())];
		m_note = m_note.slice(0, -1);
		length = [1, 4][Math.random() > 0.9 ? 1 : 0] * l;
		length2 = length;

		interval = lastNote ? distance(lastNote, m_note) : NaN;

		if ([0, 3, 4, -3, -4].indexOf(interval) !== -1) {
			length2 = length / 2;
			var up = scale.indexOf(lastNote) + 1;
			var down = scale.indexOf(lastNote) - 1;
			interval > 0 || (interval === 0 && Math.random() > 0.5)
				? melody.addNote(0, scale[up < scale.length ? up : 0] + '3', length2)
				: melody.addNote(0, scale[down >= 0 ? down : scale.length - 1] + '3', length2);
		}

		if (length === 4 * l) {
			Math.random() > 0.5 ? melody.addNote(0, m_note + '3', length2) : melody.noteOff(0, m_note + '3', length2);
		} else {
			melody.addNote(0, m_note + '3', length2);
		}

		// console.log('melody', chords[j], length / l);
		lastLength = length / l;
		lastNote = m_note;
	}
	lastLength -= 1;

	// change chord
	if ((i+1) % 8 === 0) {
		j += 1;
		if (j >= chords.length) j = 0;
	}
}
bass.noteOff(1, 'c4', l * 2);


function distance(a, b) {
	return noteLookup[b] - noteLookup[a];
}

fs.writeFileSync('test2.mid', file.toBytes(), 'binary');
