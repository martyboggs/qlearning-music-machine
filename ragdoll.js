var ragdoll = function(x, y, scale, options, matter) {
	scale = typeof scale === 'undefined' ? 1 : scale;

	var headOptions = Object.assign({
		label: 'head',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
		},
		render: {
			fillStyle: '#FFBC42'
		}
	}, options);

	var chestOptions = Object.assign({
		label: 'chest',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
		},
		render: {
			fillStyle: '#E0A423'
		}
	}, options);

	var leftArmOptions = Object.assign({
		label: 'left-arm',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: 10 * scale
		},
		render: {
			fillStyle: '#FFBC42'
		}
	}, options);

	var leftLowerArmOptions = Object.assign({}, leftArmOptions, {
		render: {
			fillStyle: '#E59B12'
		}
	});

	var rightArmOptions = Object.assign({
		label: 'right-arm',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: 10 * scale
		},
		render: {
			fillStyle: '#FFBC42'
		}
	}, options);

	var rightLowerArmOptions = Object.assign({}, rightArmOptions, {
		render: {
			fillStyle: '#E59B12'
		}
	});

	var leftLegOptions = Object.assign({
		label: 'left-leg',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: 10 * scale
		},
		render: {
			fillStyle: '#FFBC42'
		}
	}, options);

	var leftLowerLegOptions = Object.assign({}, leftLegOptions, {
		render: {
			fillStyle: '#E59B12'
		}
	});

	var rightLegOptions = Object.assign({
		label: 'right-leg',
		collisionFilter: {
			// group: Body.nextGroup(true)
		},
		chamfer: {
			radius: 10 * scale
		},
		render: {
			fillStyle: '#FFBC42'
		}
	}, options);

	var rightLowerLegOptions = Object.assign({}, rightLegOptions, {
		render: {
			fillStyle: '#E59B12'
		}
	});

	var head = matter.add.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
	var chest = matter.add.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
	var rightUpperArm = matter.add.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
	var rightLowerArm = matter.add.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
	var leftUpperArm = matter.add.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
	var leftLowerArm = matter.add.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
	var leftUpperLeg = matter.add.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
	var leftLowerLeg = matter.add.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
	var rightUpperLeg = matter.add.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
	var rightLowerLeg = matter.add.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);

	var chestToRightUpperArm = matter.add.constraint(chest, rightUpperArm, 1, 0.6, {
		pointA: {
			x: 24 * scale,
			y: -23 * scale
		},
		pointB: {
			x: 0,
			y: -8 * scale
		},
		render: {
			visible: false
		}
	});

	var chestToLeftUpperArm = matter.add.constraint(chest, leftUpperArm, 1, 0.6, {
		pointA: {
			x: -24 * scale,
			y: -23 * scale
		},
		pointB: {
			x: 0,
			y: -8 * scale
		},
		render: {
			visible: false
		}
	});

	var chestToLeftUpperLeg = matter.add.constraint(chest, leftUpperLeg, 1, 0.6, {
		pointA: {
			x: -10 * scale,
			y: 30 * scale
		},
		pointB: {
			x: 0,
			y: -10 * scale
		},
		render: {
			visible: false
		}
	});

	var chestToRightUpperLeg = matter.add.constraint(chest, rightUpperLeg, 1, 0.6, {
		pointA: {
			x: 10 * scale,
			y: 30 * scale
		},
		pointB: {
			x: 0,
			y: -10 * scale
		},
		render: {
			visible: false
		}
	});

	var upperToLowerRightArm = matter.add.constraint(rightUpperArm, rightLowerArm, 1, 0.6, {
		pointA: {
			x: 0,
			y: 15 * scale
		},
		pointB: {
			x: 0,
			y: -25 * scale
		},
		render: {
			visible: false
		}
	});

	var upperToLowerLeftArm = matter.add.constraint(leftUpperArm, leftLowerArm, 1, 0.6, {
		pointA: {
			x: 0,
			y: 15 * scale
		},
		pointB: {
			x: 0,
			y: -25 * scale
		},
		render: {
			visible: false
		}
	});

	var upperToLowerLeftLeg = matter.add.constraint(leftUpperLeg, leftLowerLeg, 1, 0.6, {
		pointA: {
			x: 0,
			y: 20 * scale
		},
		pointB: {
			x: 0,
			y: -20 * scale
		},
		render: {
			visible: false
		}
	});

	var upperToLowerRightLeg = matter.add.constraint(rightUpperLeg, rightLowerLeg, 1, 0.6, {
		pointA: {
			x: 0,
			y: 20 * scale
		},
		pointB: {
			x: 0,
			y: -20 * scale
		},
		render: {
			visible: false
		}
	});

	var headContraint = matter.add.constraint(head, chest, 1, 0.6, {
		pointA: {
			x: 0,
			y: 25 * scale
		},
		pointB: {
			x: 0,
			y: -35 * scale
		},
		render: {
			visible: false
		}
	});

	var legToLeg = matter.add.constraint(leftLowerLeg, rightLowerLeg, 1, 0.01, {
		render: {
			visible: false
		}
	});

	// var person = Composite.create({
	// 	bodies: [
	// 		chest, head, leftLowerArm, leftUpperArm,
	// 		rightLowerArm, rightUpperArm, leftLowerLeg,
	// 		rightLowerLeg, leftUpperLeg, rightUpperLeg
	// 	],
	// 	constraints: [
	// 		upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
	// 		chestToRightUpperArm, headContraint, upperToLowerLeftLeg,
	// 		upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
	// 		legToLeg
	// 	]
	// });

	// return person;
};
