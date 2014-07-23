var zombies = [];

jQuery(document).ready(function() {

	// Zombies iniciales
	//for(var i=0; i<20; i++)
		zombies.push(new Zombie({x:250,y:250}));


	// Mouse tracker
	jQuery(document).on('mousemove', document, function(e) {
		var player = $('.player');
		player.css({
			left: e.clientX+3,
			top: e.clientY+3
		});

		var playerPos = {
			x: player.offset().left,
			y: player.offset().top
		}

		for(var i in zombies) {
			var zombie = zombies[i].getZombie();
			if(playerPos.x < zombie.offset().left + 100 
				&& playerPos.x > zombie.offset().left - 100
				&& playerPos.y < zombie.offset().top + 100
				&& playerPos.y > zombie.offset().top - 100) {

				zombies[i].setTarget(playerPos);
			}
		}
	});

	// Plus One
	$('#plusOne').click(function() {
		zombies.push(new Zombie({x:250,y:250}));
	});
	$('#plusTen').click(function() {
		for(var i=0; i<10; i++)
			zombies.push(new Zombie({x:250,y:250}));
	});

});