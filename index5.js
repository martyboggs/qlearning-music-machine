let N = (length, value, octave) => {
	octave = (value) ? octave || 0 : null;
	value = value || null;
	// the step value is used in the canvas drawing
	// if a rest, pass a string for later detection
	let step = (value) ? 'C C# D D# E F F# G G# A A# B'.split(' ').indexOf(value) : 'REST';
	let sustain;
	// accounting for ties and dotted notes
	if(typeof length === 'object') {
	  // turn comma-delimited string into an array
	  let lengths = Array.from(length);
	  // creating sustain from array. 2,4 = 12 | 4,8 = 6 | 8,16 = 3
	  sustain = 0;
	  lengths.forEach((l) => { sustain += res / l; })
	  // length uses tone.js `+` notation. 1,1 = '1n+1'. last `n` added in object below.
	  length = lengths.join('n+');
	} else {
	  // how many resolution values this sustains
	  sustain = res / length;
	}

	let d = { value: value, step: step, length: `${length}n`, sustain: sustain, octave: octave };
	d.length = d.length.replace(/1n/g, '1m')
	return d;
};

var debug = true;

// init music
var piano = new Tone.Synth().toMaster();
piano.set({
	oscillator: {
		type: 'sawtooth'
	},
	envelope: {
		attack: 0.01,
		decay: 0.1,
		sustain: 0.2,
		release: 1.2
	}
});
piano.volume.value = -10;

var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
polySynth.set({
	oscillator: {
		type: 'triangle'
	},
	envelope: {
		attack: 0.01,
		decay: 0.2,
		sustain: 0.2,
		release: 1.2
	}
});

var chords = [
	['c4', 'e4', 'g4', 'b4'],
	['d4', 'f#4', 'a4', 'f#4'],
	['a3', 'c#4', 'e4'],
	['g3', 'b3', 'd4'],
	['e3', 'g3', 'b3'],
	['f3', 'a3', 'c4', 'd4'],
];
var melody = ['e4', 'f4', 'f#4', 'g4', 'g#4', 'a4', 'a#4', 'b4', 'c5', 'c#5', 'd5', 'd#5'];

var progression = [
	0, 0, 1, 1,
	0, 0, 1, 1,
	0, 0, 1, 1,

	2, 0, 2, 0,
	2, 0, 2, 0,
	2, 0, 2, 0,
	2, 0, 2, 0,

	3, 4, 3, 4,
	3, 4, 5, 5,

	2, 0, 2, 0,
	2, 0, 2, 0,
	2, 0, 2, 0,
	2, 0, 2, 0,

	3, 4, 3, 4,
	3, 4, 5, 5,
];
var scales = [
	['g', 'a', 'b', 'c', 'd', 'e', 'f#'],
	['a', 'b', 'c#', 'd', 'e', 'f#', 'g'],
];
var progressionScales = [
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,

	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,

	0, 0, 0, 0,
	0, 0, 0, 0,

	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,

	0, 0, 0, 0,
	0, 0, 0, 0,
];
var progressionPatterns = [
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,

	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,

	2, 2, 2, 2,
	2, 2, 2, 2,

	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,

	2, 2, 2, 2,
	2, 2, 2, 2,
];
var drumPatterns = [
	3, 3, 3, 3,
	0, 0, 0, 0,
	0, 0, 0, 2,

	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 1,

	0, 0, 0, 0,
	0, 0, 0, 2,

	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 1,

	0, 0, 0, 0,
	0, 0, 0, 2,
];
var playMelody = [
	1, 1, 1, 1,
	1, 1, 1, 1,
	1, 1, 1, 1,

	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,

	1, 1, 1, 1,
	1, 1, 1, 1,

	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,

	1, 1, 1, 1,
	1, 1, 1, 1,
];

var eights = 0;
var measures = 0;
var keepGoing = false;
var skipNext = false;

// init DQN agent
var env = {};
env.getNumStates = () => { return 4; }
env.getMaxNumActions = () => { return melody.length; }
var spec = {};
// spec.epsilon = 0; // exploration rate
// spec.alpha = 0; // learning rate
spec.experience_add_every = 1;
spec.experience_size = 15000;
agent = new RL.DQNAgent(env, spec);

var oldAgent = localStorage.getItem('index5');
try {
	oldAgent = JSON.parse(oldAgent);
	if (oldAgent) {
		agent.fromJSON(oldAgent);
	}
} catch (e) { console.log(e); }

var lastState = [1, 5, 6, progression[measures]];
var thisState;

var drumSamples = {
	'c3': 'kit-tom.mp3',
	'c#3': 'kit-snare.mp3',
	'd3': 'kit-hat.mp3'
};
var samples = {
	'd#3': 'tugboat/1.mp3',
	'e3': 'tugboat/yell1.mp3',
	'f3': 'tugboat/yell2.mp3',
	'f#3': 'tugboat/yell3.mp3',
	'g3': 'tugboat/yell4.mp3',
	'g#3': 'tugboat/2.mp3',
};

var sampler = new Tone.Sampler(Object.assign(drumSamples, samples), () => {
	if (debug) console.log('samples loaded');
}).toMaster();

window.onload = () => {
	if (debug) console.log('onload');
	var els = document.querySelectorAll('button');
	for (var i = 0; i < els.length; i += 1) {
		els[i].onclick = e => {
			window[e.target.className] = true;
			if (e.target.className === 'save') {
				localStorage.setItem('index5', JSON.stringify(agent.toJSON()));
			}
		}
	}

	document.querySelector('.epsilon').onchange = e => {
		agent.epsilon = Number(e.target.value);
	};

	var started = false;
	document.querySelector('.start').addEventListener('mousedown', () => {
		Tone.Transport.bpm.value = 100;
		if (!started) {
			started = true;
			Tone.Transport.start();
			Tone.Transport.scheduleRepeat(step, '8n');
		} else if (Tone.context.state !== 'running') {
			Tone.context.resume().then(() => {
				if (debug) console.log('resume');
				Tone.Transport.start();
				Tone.Transport.scheduleRepeat(step, '8n');
			});
		}
	});
};

function step(time) {
	// get this beat's info
	if (eights % 8 === 0) {
		thisChord = progression[measures];
		thisScale = progressionScales[measures];
		thisProgressionPattern = progressionPatterns[measures];
		thisDrumPattern = drumPatterns[measures];
		thisPlayMelody = playMelody[measures];
	}

	// chords
	switch (thisProgressionPattern) {
		case 0: // arpeggio on quarters
			if (eights % 2 === 0) {
				polySynth.triggerAttackRelease(chords[thisChord][(eights / 2) % chords[thisChord].length], '4n', time);
			}
		break;
		case 1: // on snare
			if ([2, 6].indexOf(eights % 8) !== -1) {
				polySynth.triggerAttackRelease(chords[thisChord], '8n', time);
			}
		break;
		case 2: // da da Daaaaaaa
			if (eights % 8 === 0) {
				polySynth.triggerAttackRelease(chords[thisChord], '2n', time);
			} else if ([6,7].indexOf(eights % 8) !== -1) {
				polySynth.triggerAttackRelease(chords[thisChord], '8n', time);
			}
		break;
	}

	// melody

	//get some action
	var action = agent.act(lastState);

	// get this state attributes
	var thisStrong = eights % 2 === 0;
	var modScale = scales[thisScale].map(note => {
		var chord = chords[thisChord];
		for (var i = 0; i < chord.length; i += 1) {
			if (chord[i].slice(0, 1) === note.slice(0, 1)) {
				return chord[i].slice(0, -1);
			}
		}
		return note;
	});

	var inScale = modScale.indexOf(melody[action].slice(0, -1)) !== -1
	var inChord = chords[thisChord].reduce((a, v) => {
		return a ? a : melody[action].slice(0, -1) === v.slice(0, -1)
	}, false);
	var semitoneDiff = Math.abs(lastState[2] - action);
	var differentFromLast2 = action !== lastState[2] && action !== lastState[1];
	var sameDirection = (action - lastState[2] > 0 && lastState[2] - lastState[1] > 0) ||
						(action - lastState[2] < 0 && lastState[2] - lastState[1] < 0);

	// calculate reward based on new state
	var reward = 0;
	if (inChord && thisStrong) {
		reward = 2;
	} else if (inScale) {
		reward = 1;
	} else {
		reward = -1;
	}

	if (inScale) {
		if (semitoneDiff === 0) { // same note
			reward = -1;
		} else if ([6,10,11].indexOf(semitoneDiff) !== -1) { // TT m7 M7
			reward = -1;
		} else if ([1,2,3,4].indexOf(semitoneDiff) !== -1) { // m2 M2 m3 M3
			reward += 1;
		}

		if (differentFromLast2) {
			reward += 1;
		}

		if (sameDirection) {
			reward += 1;
		}
	}

	// LEARN
	agent.learn(reward);

	// update ui
	Tone.Draw.schedule(function () {
		var good = document.querySelector('.good');
		var bad = document.querySelector('.bad');
		var g = Number(good.innerHTML.slice(0, -5));
		var b = Number(bad.innerHTML.slice(0, -4));
		if (reward > 0) {
			good.innerHTML = g + reward + ' good';
		} else {
			bad.innerHTML = b - reward + ' bad';
		}
		var percent = document.querySelector('.percent');
		percent.innerHTML = (b / (g !== 0 ? g : 1) * 100).toFixed(2) + '% bad/good';
	}, time);


	// melody
	if (!skipNext && thisPlayMelody) {
		piano.triggerAttackRelease(melody[action], '8n', time);
	} else {
		skipNext = false;
	}
	if (Math.random() < 0.8 && inChord && thisStrong) {
		skipNext = true;
	}

	// drums
	switch (thisDrumPattern) {
		case 0:
			if ([0, 1, 4].indexOf(eights % 8) !== -1) { // tom
				sampler.triggerAttackRelease('c3', '8n', time);
			}
			if (eights % 4 === 2) { // snare
				sampler.triggerAttackRelease('c#3', '8n', time);
			}
			if (eights % 2 === 0) { // hihat
				sampler.triggerAttackRelease('d3', '8n', time);
			}
		break;
		case 1:
			sampler.triggerAttackRelease('c3', '8n', time);
			sampler.triggerAttackRelease('c#3', '8n', time);
			if (eights % 2 === 0) { // hihat
				sampler.triggerAttackRelease('d3', '8n', time);
			}
		break;
		case 2:
			if (eights % 8 === 0) {
				sampler.triggerAttackRelease('c3', '8n', time);
				sampler.triggerAttackRelease('c#3', '8n', time);
			}
			if (eights % 4 === 0) { // hihat
				sampler.triggerAttackRelease('d3', '8n', time);
			}
		break;
		case 3:
			if (eights % 2 === 0) { // hihat
				sampler.triggerAttackRelease('d3', '8n', time);
			}
		break;
	}

	// samples
	for (note in samples) {
		if (window[samples[note].slice(0, -4)] && eights % 8 === 0) {
			window[samples[note].slice(0, -4)] = false;
			sampler.triggerAttackRelease(note, '1m', time);
		}
	}

	// vocals
	if ([4 * 8 + 2].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('e3', '10m', time - 0.05);
	if ([6 * 8 + 2].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('f3', '10m', time - 0.05);
	if ([8 * 8 + 2].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('f#3', '10m', time - 0.05);
	if ([10 * 8 + 2].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('g3', '10m', time - 0.05);
	if ([12 * 8 + 2, 36 * 8 + 2].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('d#3', '10m', time - 0.05);
	if ([20 * 8 - 1, 44 * 8 - 1].indexOf(eights % (progression.length * 8)) !== -1) sampler.triggerAttackRelease('g#3', '10m', time - 0.05);

	if (eights % 8 === 0) {
		measures++;
		if (measures > progression.length - 1) measures = 0;
	}
	eights++;
	lastState = [thisStrong ? 1 : 0, lastState[2], action, thisChord];

	// keep it going
	if (keepGoing) clearTimeout(keepGoing);
	keepGoing = setTimeout(() => {
		console.log('restarted');
		Tone.Transport.start();
		Tone.Transport.scheduleRepeat(step, '8n');
	}, 400);
}
