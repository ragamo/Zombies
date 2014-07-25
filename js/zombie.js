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
			directionX: null,
			directionY: null,

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

			getRandomArbitrary: function(min, max) {
				if(!max) return Math.random() * min;
				return Math.random() * (max - min) + min;
			},

			calcularNuevaDireccion: function(min, max) {
				var direccion = null;// = (min && max) ? this.getRandomArbitrary(min,max) : this.getRandomArbitrary(2*Math.PI); // Algun angulo entre 0 y 2PI

				if(private.directionY == 'up') {
					direccion = this.getRandomArbitrary(Math.PI/4, 3*Math.PI/4);
				} else if(private.directionY == 'down') {
					direccion = this.getRandomArbitrary((5*Math.PI)/4, (7*Math.PI)/4);
				} else {
					direccion = this.getRandomArbitrary(2*Math.PI);
				}

				//Determina la direccion
				if(direccion > Math.PI && direccion < 2*Math.PI) {
					private.directionY = 'up';
				} 
				if(direccion > 0 && direccion < Math.PI) {
					private.directionY = 'down';
				}

				return direccion;
			},

			calcularNuevaPos: function() {
				var direccion = this.calcularNuevaDireccion();

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
						private.directionY = null;
						private.dom.removeClass('left right');
						if(_fnCallback)
							_fnCallback();

						//console.log('complete');
					},
					/*start: function() {
						private.stuck = false;
					},*/
					fail: function() {
						//console.log('fail');
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
							private.dom.stop();
						}
					}
				});
			},

			goToTarget: function(targetPos) {
				/*clearInterval(private.timerAutonomo);
				private.dom.addClass('angry').clearQueue().stop();
				private.move(targetPos, function() {
					clearTimeout(private.timerSeguimiento);
					private.timerSeguimiento = setTimeout(function() {
						private.dom.removeClass('angry');
						private.process();
					}, 1000)
				});*/
			},

			hitTest: function() {
				var flagHitTest = false;

				jQuery.each(config.collideWith, function(i, el) {
					jQuery(el).each(function(i, elem) {
						var elem = jQuery(elem);

						if(private.directionY == 'up' && private.posActual.y <= elem.offset().top + elem.height() && private.posActual.y + private.dom.height() > elem.offset().top + elem.height()) {
							flagHitTest = true;
							return;
						}
						if(private.directionY == 'down' && private.posActual.y + private.dom.height() > elem.offset().top && private.posActual.y < elem.offset().top) {
							flagHitTest = true;
							return;
						}

					});
				});	

				console.log('hitTest: '+flagHitTest);
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