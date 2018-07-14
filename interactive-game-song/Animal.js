function Animal() {
	animals.push(this);
	this.image = scene.matter.add.sprite(Math.random() * (config.width - 200) + 50, config.height - 59, 'dog', null, {});
	this.image.setY(config.height - this.image.height - 50);
	this.image.setBody({height: 30, width: 40});
	this.image.setDisplayOrigin(this.image.width / 2, 43);
	this.image.setDepth(5);
	this.image.setCollidesWith(2);

	this.changeFrequency = Math.round(Math.random() * 1300 + 100);

	this.animation = Math.floor(Math.random() * 5);
	switch (this.animation) {
		case 0: this.image.anims.play('bark'); break;
		case 1: this.image.anims.play('walk'); break;
		case 2: this.image.anims.play('run'); break;
		case 3: this.image.anims.play('wag'); break;
		case 4: this.image.anims.play('sit'); break;
	}

	// scene.matter.world.on('collisionstart', function (e, a, b) {
	// 	console.log(e, a, b);
	// });
}
Animal.prototype = {
	update: function () {
		if (frame % this.changeFrequency === 0) {
			this.animation = Math.floor(Math.random() * 5);
			switch (this.animation) {
				case 0: this.image.anims.play('bark'); break;
				case 1: this.image.anims.play('walk'); break;
				case 2: this.image.anims.play('run'); break;
				case 3: this.image.anims.play('wag'); break;
				case 4: this.image.anims.play('sit'); break;
			}
		}

		if (frame % this.changeFrequency === 0 && Math.random() > 0.5) {
			this.image.scaleX *= -1;
		}
		if (this.image.x < 140) {
			this.image.scaleX = -1;
		} else if (this.image.x > config.width - 140) {
			this.image.scaleX = 1;
		}

		if (frame % 3 === 0 && this.image.anims.currentAnim && Math.abs(this.image.body.velocity.x) < 3) {
			if (this.image.anims.currentAnim.key === 'walk') {
				this.image.applyForce({x: this.image.scaleX > 0 ? -0.003 : 0.003, y: 0});
			} else if (this.image.anims.currentAnim.key === 'run') {
				this.image.applyForce({x: this.image.scaleX > 0 ? -0.006 : 0.006, y: 0});
			}
		}

		this.image.setAngularVelocity(0);

		if (this.image.y > config.height + 50) {
			this.destroy();
		}
	},
	destroy: function () {
		this.image.destroy();
		animals.splice(animals.indexOf(this), 1);
	}
};
