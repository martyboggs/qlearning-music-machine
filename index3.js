// init music
var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
var polySynth2 = new Tone.PolySynth(4, Tone.Synth).toMaster();
var chords = [
	['D4', 'F#4'],
	['D4', 'F#4'],
	['C#4', 'E4'],
	['C#4', 'E4'],
	['B3', 'D4'],
	['B3', 'D4'],
	['A3', 'C#4'],
	['A3', 'C#4'],
];
var melody = ['a4', 'b4', 'c#5', 'e5'];
var scale = ['a', 'b', 'c#', 'd', 'e', 'f#', 'g#'];
var eights = 0;
var measures = 0;

// init learner
var intervals = ['-12','-11','-10','-09','-08','-07','-06','-05','-04','-03','-02','-01','001','002','003','004','005','006','007','008','009','010','011','012'];
// var times = [1,2,3,4];
var last5Actions = ['   ', '   ', '   ', '   ', '   '];
var lastNote = 'a5';
var learner = new QLearner();
var exploration = 0.2;

var loop = new Tone.Loop(function (time) {
	// chords
	if (eights % 8 === 0) {
		polySynth.triggerAttackRelease(chords[measures], '4n');
		measures++;
		if (measures > chords.length - 1) measures = 0;
	}

	var currentState = 'S' + last5Actions.join('');
	console.log(learner);
	//get some action
	var randomAction = intervals[~~(intervals.length * Math.random())]; /*+ times[~~(times.length * Math.random())];*/
	//and the best action
	var action = learner.bestAction(currentState);
	//if there is no best action try to explore
	if (action===null || action === undefined || (!learner.knowsAction(currentState, randomAction) && Math.random() < exploration)) {
		action = randomAction;
	}

	var note = Tone.Frequency(lastNote).transpose(Number(action)).toNote();
	// check if note is in scale
	// check for any patterns
	var reward = 0;
	if (scale.indexOf(note.slice(0, -1)) === -1) {
		reward = 1;
	}

	last5Actions.push(action);
	last5Actions.shift();

	var nextState = 'S' + last5Actions.join('');
	learner.add(currentState, nextState, reward, action);

	//make que q-learning algorithm number of iterations=10 or it could be another number
	learner.learn(10);


	//some feedback on performance

	// melody
	polySynth2.triggerAttackRelease(note, '16n');






	lastNote = note;
	eights++;
}, '8n');

loop.start('1m');

Tone.Transport.start();



