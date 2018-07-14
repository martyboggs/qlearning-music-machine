function Monster(type) {
	monsters.push(this);
	this.texts = [];
	this.x = 0;

	var chars = [
		[
			'\u263a\u263a\u263a\u263a\u263a',
			'\u03A9\u03A9\u03A9\u03A9\u03A9\u03A9\u03A9\u03A9',
			'\u2665\u2665\u2665\u2665\u2665',
		],
		[
			'\u2022\u00F6\u25D8\u00F2\u25CB\u00FB\u25D9\u00F9',
			'\u266A\u00DC\u266B\u00A2\u263C\u00A3\u25BA\u00A5\u25C4',
			'\u00C9\u2666\u00E6',
			'\u00E9\u2592\u00E2\u2593\u00E4\u2502\u00E0\u2524',
		],
		[
			'\u266A        ',
			'        \u266b',
			'\u266A        ',
			'        \u266b',
			'\u266b        ',
			'        \u266A',
			'\u266b        ',
			'        \u266A',
		],
		// [ // pipes
		// 	'\u2560\u2550\u2563  ',
		// 	'\u2551',
		// 	'  \u255A\u256c\u255d',
		// 	'  \u2551',
		// ],
	];
	if (!type) type = Math.floor(Math.random() * chars.length);
	var charWidth = 50;
	var charHeight = 64;
	for (var i = 0; i < chars[type].length; i += 1) { // lines
		for (var j = 0; j < chars[type][i].length; j += 1) { // characters
			var text = scene.add.bitmapText(config.width / 2 - chars[type][i].length * charWidth / 2 + charWidth * j + 12, -charHeight * (chars[type].length - i), 'font', chars[type][i][j], 64);
			text.ogx = text.x;
			text.shakeSpeed = Math.random();
			text.setDepth(-5);
			this.texts.push(text);
		}
	}
}
Monster.prototype = {
	explode: function (i) {
		scoreText.text = (Number(scoreText.text) + 1).toString();
		scoreText.updateText();

		rand > 0.5 ? gameSounds.explode.play({volume: 0.3}) : gameSounds.explode2.play({volume: 0.3});

		var shrapnel;
		for (var k = 0; k < 4; k += 1) {
			shrapnel = scene.matter.add.image(this.texts[i].x, this.texts[i].y, 'shrapnel');
			shrapnel.angle = Math.random() * 360;
			shrapnel.setBody({width: 10, height: 20});
			shrapnel.setMass(0.05);
			shrapnel.setDisplayOrigin(5, 12);
			shrapnel.setVelocity(Math.random());
			shrapnel.setAngularVelocity(Math.random());
			shrapnel.setCollisionCategory(2);
			shrapnels.push(shrapnel);
		}

		this.texts[i].destroy();
		this.texts.splice(i, 1);

		if (this.texts.length === 0) {
			new Monster();
			this.destroy();
		}
	},
	destroy: function () {
		for (var i = 0; i < this.texts.length; i += 1) {
			this.texts[i].destroy();
		}
		monsters.splice(monsters.indexOf(this), 1);
	},
	update: function () {
		// wiggle
		for (var i = 0; i < this.texts.length; i += 1) {
			this.texts[i].x = this.x + this.texts[i].ogx + 10 * Math.sin(frame * this.texts[i].shakeSpeed / 2 / Math.PI);
			this.texts[i].y += 0.2;
		}

		// attacked earth
		if (this.texts[0].y > config.height - 50) {
			new Monster();
			this.destroy();
			return;
		}

		this.x = cont.knob0 ? cont.knob0 : 0;
	}
};
