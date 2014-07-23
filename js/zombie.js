(function(window, undefined) {

	var Zombie = function(configOverride) {
		var config = {
			alcanceMax: 100,
			deltaEspera: Math.random()*3+1,
			maxBounds: {
				width: 800,
				height: 600
			},
			collideWith: ['.wall']
		};
		jQuery.extend(true, config, configOverride);

		var private = {
			dom: null,
			posActual: {},
			timerAutonomo: null,
			timerSeguimiento: null,
			dirLock: {
				up: false,
				left: false,
				down: false,
				right: false
			},

			run: function() {
				this.create();
				this.process();
			},

			create: function() {
				this.dom = jQuery('<div class="zombie"></div>');
				this.dom.appendTo('body');

				if(config.x) {
					this.dom.css('left', config.x);
					this.posActual.x = config.x;
				}
				if(config.y) {
					this.dom.css('top', config.y);
					this.posActual.y = config.y;
				}
				
				return this.dom;
			},

			process: function() {
				// Movimiento autonomo
				var nuevaPos = private.calcularNuevaPos();
				private.move(nuevaPos);
				private.timerAutonomo = setInterval(function() {
					var nuevaPos = private.calcularNuevaPos();
					private.move(nuevaPos);
				}, 1100 * config.deltaEspera);
			},

			calcularNuevaPos: function() {
				var direccion = Math.random()*(2*Math.PI); // Algun angulo entre 0 y 2PI
				if(private.dirLock.up && direccion > ((Math.PI/2)-(Math.PI/4)) && direccion < ((Math.PI/2)+(Math.PI/4))) {
					this.calcularNuevaPos();
					console.log('recalculo');
				}

				var nuevaPos = {
					x: private.posActual.x + (config.alcanceMax * Math.cos(direccion)),
					y: private.posActual.y + (config.alcanceMax * Math.sin(direccion))
				};
				
				if(nuevaPos.x < 0) nuevaPos.x = 0;
				if(nuevaPos.y < 0) nuevaPos.y = 0;
				if(nuevaPos.x > config.maxBounds) nuevaPos.x = config.maxBounds.width;
				if(nuevaPos.y > config.maxBounds) nuevaPos.y = config.maxBounds.height;

				return nuevaPos;
			},

			move: function(nuevaPos, _fnCallback) {
				var moveClass = (nuevaPos.x > private.posActual.x) ? 'right' : 'left';
				private.dom.removeClass('left right').addClass(moveClass);

				private.dom.animate({
					left: nuevaPos.x,
					top: nuevaPos.y
				}, {
					duration: 700 * config.deltaEspera,
					easing: 'linear',
					queue: false,
					done: function() {
						private.dom.removeClass('left right');
						if(_fnCallback)
							_fnCallback();

						console.log('complete');
					},
					/*start: function() {
						private.stuck = false;
					},*/
					fail: function() {
						console.log('fail');
						private.dom.removeClass('left right');
						if(_fnCallback)
							_fnCallback();
					},
					progress: function(animation, percent, ms) {
						private.posActual = {
							x: private.dom.offset().left,
							y: private.dom.offset().top
						};

						if(private.hitTest()) {
							console.log('stop');
							console.log(animation);
							private.dom.stop();
							//animation.done();
							//private.stuck = false;

							/*private.dom.css({
								top: private.posActual.y,
								left: private.posActual.x
							})*/

							/*private.dom.removeClass('left right');
							if(_fnCallback)
								_fnCallback();*/


						}
						//console.log(private.posActual);
					}
				});
			},

			goToTarget: function(targetPos) {
				clearInterval(private.timerAutonomo);
				private.dom.addClass('angry').clearQueue().stop();
				private.move(targetPos, function() {
					clearTimeout(private.timerSeguimiento);
					private.timerSeguimiento = setTimeout(function() {
						private.dom.removeClass('angry');
						private.process();
					}, 1000)
				});
			},

			hitTest: function() {
				var flagHitTest = false;

				jQuery.each(config.collideWith, function(i, el) {
					jQuery(el).each(function(i, elem) {

						var elem = jQuery(elem);
						if(!private.dirLock.up && private.posActual.y - 1 < elem.offset().top + elem.height()) {
							private.dirLock.up = true;
							flagHitTest = true;
						}

					});
				});	
				
				return flagHitTest;
			}
		};

		private.run();

		return {
			getZombie: function() {
				return private.dom;
			},

			setTarget: function(targetPos) {
				private.goToTarget(targetPos);
			}
		};

	};

	window.Zombie = Zombie;
})( window );