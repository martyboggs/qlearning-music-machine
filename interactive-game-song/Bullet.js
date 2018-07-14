function Bullet(char) {
	bullets.push(this);
	this.age = 0;
	this.text = scene.add.bitmapText(config.width / 2, config.height - 64, 'font', char, 64, 'center');
	this.text.x -= this.text.width / 2;
	this.tween = null;

	// find something to move toward
	this.target = null;
	this.targetX;
	this.targetY;
	this.findTarget(char);
}
Bullet.prototype = {
	findTarget: function (char) {
		for (var i = 0; i < monsters.length; i += 1) {
			var t = monsters[i].texts;
			for (var j = t.length - 1; j >= 0; j -= 1) {
				if (t[j].text === char && t[j].y > -50 && t[j].y < config.height - 40) {
					this.target = monsters[i];
					this.targetX = t[j].x;
					this.targetY = t[j].y;
					gameSounds.shoot.play({volume: 0.2});
					return;
				}
			}
		}
		return null;
	},
	destroy: function () {
		this.text.destroy();
		bullets.splice(bullets.indexOf(this), 1);
	},
	update: function () {
		if (!this.target && this.age > 60) {
			this.destroy();
		} else if (this.target && !this.tween) {
			this.tween = scene.tweens.add({
				targets: [this.text],
				x: this.targetX,
				y: this.targetY,
				duration: Phaser.Math.Distance.Between(this.text.x, this.text.y, this.targetX, this.targetY),
				callbackScope: this,
				onComplete: this.destroy
			});
		}

		// collision
		for (var i = 0; i < monsters.length; i += 1) {
			for (var j = 0; j < monsters[i].texts.length; j += 1) {
				var m = monsters[i].texts[j];
				if (this.text.text === m.text &&
				Math.abs(this.text.x - m.x) < 30 &&
				Math.abs(this.text.y - m.y) < 30) {
					monsters[i].explode(j);
					this.destroy();
				}
			}
		}

		this.age += 1;
	}
};
