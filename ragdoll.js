var head;
var chest;
var rightUpperArm;
var leftUpperArm;
var rightLowerArm;
var leftLowerArm;
var rightUpperLeg;
var leftUpperLeg;
var rightLowerLeg;
var leftLowerLeg;
var person;

var ragdoll = function(x, y, scale, options, context) {
	scale = typeof scale === 'undefined' ? 1 : scale;

	head = context.matter.add.image(x, y - 60 * scale, 'head', null, {
		chamfer: {radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]}
	});
	chest = context.matter.add.image(x, y, 'body', null, {
		chamfer: {radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]}
	});
	rightUpperArm = context.matter.add.image(x + 39 * scale, y - 15 * scale, 'miller', null, {
		chamfer: {radius: 10 * scale}
	}).setCollisionCategory();
	rightLowerArm = context.matter.add.image(x + 39 * scale, y + 25 * scale, 'leg');
	leftUpperArm = context.matter.add.image(x - 39 * scale, y - 15 * scale, 'miller', null, {
		chamfer: {radius: 10 * scale}
	}).setCollisionCategory();
	leftLowerArm = context.matter.add.image(x - 39 * scale, y + 25 * scale, 'leg');
	leftUpperLeg = context.matter.add.image(x - 20 * scale, y + 57 * scale, 'miller', null, {
		chamfer: {radius: 10 * scale}
	}).setCollisionCategory();
	leftLowerLeg = context.matter.add.image(x - 20 * scale, y + 97 * scale, 'leg');
	rightUpperLeg = context.matter.add.image(x + 20 * scale, y + 57 * scale, 'miller', null, {
		chamfer: {radius: 10 * scale}
	}).setCollisionCategory();
	rightLowerLeg = context.matter.add.image(x + 20 * scale, y + 97 * scale, 'leg');

	var constraintLength = 0;
	var chestToRightUpperArm = context.matter.add.constraint(chest, rightUpperArm, constraintLength, 0.6, {
		pointA: {
			x: 24 * scale,
			y: -23 * scale
		},
		pointB: {
			x: 0,
			y: -8 * scale
		},
	});

	var chestToLeftUpperArm = context.matter.add.constraint(chest, leftUpperArm, constraintLength, 0.6, {
		pointA: {
			x: -24 * scale,
			y: -23 * scale
		},
		pointB: {
			x: 0,
			y: -8 * scale
		},
	});

	var chestToLeftUpperLeg = context.matter.add.constraint(chest, leftUpperLeg, constraintLength, 0.6, {
		pointA: {
			x: -12 * scale,
			y: 30 * scale
		},
		pointB: {
			x: 0,
			y: -10 * scale
		},
	});

	var chestToRightUpperLeg = context.matter.add.constraint(chest, rightUpperLeg, constraintLength, 0.6, {
		pointA: {
			x: 12 * scale,
			y: 30 * scale
		},
		pointB: {
			x: 0,
			y: -10 * scale
		},
	});

	var upperToLowerRightArm = context.matter.add.constraint(rightUpperArm, rightLowerArm, constraintLength, 0.6, {
		pointA: {
			x: 0,
			y: 15 * scale
		},
		pointB: {
			x: 0,
			y: -25 * scale
		},
	});

	var upperToLowerLeftArm = context.matter.add.constraint(leftUpperArm, leftLowerArm, constraintLength, 0.6, {
		pointA: {
			x: 0,
			y: 15 * scale
		},
		pointB: {
			x: 0,
			y: -25 * scale
		},
	});

	var upperToLowerLeftLeg = context.matter.add.constraint(leftUpperLeg, leftLowerLeg, constraintLength, 0.6, {
		pointA: {
			x: 0,
			y: 5 * scale
		},
		pointB: {
			x: 0,
			y: -20 * scale
		},
	});

	var upperToLowerRightLeg = context.matter.add.constraint(rightUpperLeg, rightLowerLeg, constraintLength, 0.6, {
		pointA: {
			x: 0,
			y: 5 * scale
		},
		pointB: {
			x: 0,
			y: -20 * scale
		},
	});

	var headConstraint = context.matter.add.constraint(head, chest, 0, 0.6, {
		pointA: {
			x: 0,
			y: 25 * scale
		},
		pointB: {
			x: 0,
			y: -35 * scale
		},
	});

	person = Phaser.Physics.Matter.Matter.Composite.create({
		bodies: [
			chest.body, head.body, leftLowerArm.body, leftUpperArm.body,
			rightLowerArm.body, rightUpperArm.body, leftLowerLeg.body,
			rightLowerLeg.body, leftUpperLeg.body, rightUpperLeg.body
		],
		constraints: [
			upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
			chestToRightUpperArm, headConstraint, upperToLowerLeftLeg,
			upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg
		]
	});

	return person;
};
