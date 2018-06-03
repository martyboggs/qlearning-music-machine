// init music
var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
var polySynth2 = new Tone.PolySynth(4, Tone.Synth).toMaster();
var chords = [
	['d4', 'f#4', 'a4'],
	['d4', 'f#4', 'a4'],
	['c#4', 'e4', 'g#4'],
	['f#3', 'a#3', 'c#4'],
	['b3', 'd4', 'f#4'],
	['b3', 'd4', 'f#4'],
	['a3', 'c#4', 'e4'],
	['a3', 'c#4', 'e4'],
];
var melody = ['e5', 'f5', 'f#5', 'g5', 'g#5', 'a5', 'a#5', 'b5', 'c6', 'c#6', 'd6', 'd#6', 'e6'];
var scale = ['a', 'b', 'c#', 'd', 'e', 'f#', 'g#'];
var eights = 0;
var measures = 0;
var keepGoing = false;
var loop = new Tone.Loop(step, '8n');

window.onload = () => {
	var els = document.querySelectorAll('button');
	for (var i = 0; i < els.length; i += 1) {
		els[i].onclick = e => window[e.target.className] = true;
	}
};

var drumSamples = {
	"c3" : "kit-tom.mp3",
	"c#3" : "kit-snare.mp3",
	"d3" : "kit-hat.mp3",
};
var samples = {
	'd#3': 'quack.mp3',
	'f3': 'jelly.mp3',
	'f#3': 'northkorea.mp3',
	'g3': 'mm.mp3',
	'g#3': 'yo.mp3',
};

var sampler = new Tone.Sampler(Object.assign(drumSamples, samples), () => {
	loop.start('4n');
	Tone.Transport.start();
}).toMaster();


// init learner
// var times = [1,2,3,4];
var learner = new QLearner();
var exploration = 0.2;
var debug = false;
var lastNote = 'a5';
var lastChord = chords[measures];
var lastState = 'S1' + lastNote + (lastNote.length === 2 ? ' ' : '') + lastChord.join('');
var thisState;

function step(time) {
	// chords
	if (eights % 8 === 0) {
		thisChord = chords[measures];
		polySynth.triggerAttackRelease(thisChord, '4n');
		measures++;
		if (measures > chords.length - 1) measures = 0;
	}

	//get some action
	var randomAction = melody[~~(melody.length * Math.random())];
	//and the best action
	var action = learner.bestAction(lastState);
	//if there is no best action or exploration, try to explore
	var explore = action===null || action === undefined || (!learner.knowsAction(lastState, randomAction) && Math.random() < exploration);
	if (explore) {
		action = randomAction;
	}

	// get this state attributes
	var thisStrong = eights % 4 === 0;
	var modScale = scale.concat(thisChord.map(n => n.slice(0, -1)));
	modScale = [...new Set(modScale)];
	var inScale = modScale.indexOf(action.slice(0, -1)) !== -1
	var inChord = thisChord.reduce((a, v) => {
		return a ? a : action.slice(0, -1) === v.slice(0, -1)
	}, false);

	// calculate reward based on new state
	var reward = -1; // if not in scale
	if (inChord && thisStrong) {
		reward = 2;
		if (debug) console.log('in chord');
	} else if (inScale) {
		reward = 1;
		if (debug) console.log('in scale');
	}
	if (lastNote === action) {
		reward = 0;
		if (debug) console.log('same note as last time');
	}

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

	// LEARN
	thisState = 'S' + (thisStrong ? 1 : 0) + action + (action.length === 2 ? ' ' : '') + thisChord.join('');
	learner.add(lastState, thisState, reward, action);
	learner.learn(10); // 10 iterations




	// melody - play learner's note if not chosen randomly
	if (!explore) {
		polySynth2.triggerAttackRelease(action, '16n');
	}



	// drums
	if (eights % 4 === 0) {
		sampler.triggerAttackRelease('c3', '16n');
	}
	if (eights % 4 === 2) {
		sampler.triggerAttackRelease('c#3', '16n');
	}
	sampler.triggerAttackRelease('d3', '16n');

	// samples
	for (note in samples) {
		if (window[samples[note].slice(0, -4)] && eights % 8 === 0) {
			window[samples[note].slice(0, -4)] = false;
			sampler.triggerAttackRelease(note, '1m');
		}
	}

	if (debug) console.log(lastState, thisState);

	lastNote = action;
	lastChord = thisChord;
	lastState = thisState;
	eights++;

	// keep it going
	if (keepGoing) clearTimeout(keepGoing);
	keepGoing = setTimeout(() => {
		console.log('restarted');
		var loop = new Tone.Loop(step, '8n');
		loop.start('4n');
		Tone.Transport.start();
	}, 1000);
}

