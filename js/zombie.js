(function(window, undefined) {

	var zombie = function(configOverride) {
		var config = {
			alcanceMax: 100,
			deltaEspera: Math.random()*3+1,
			maxBounds: {
				width: 800,
				height: 600
			},
			collideWith: []
		};
		jQuery.extend(true, config, configOverride);

		var private = {
			dom: null,
			posActual: null,
			timerAutonomo: null,
			timerSeguimiento: null,

			run: function() {
				this.create();
				this.process();
			},

			create: function() {
				this.dom = jQuery('<div class="zombie"></div>');
				this.dom.appendTo('body');

				if(config.x) this.dom.css('left', config.x);
				if(config.y) this.dom.css('top', config.y);
				
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
				private.posActual = {
					x: private.dom.offset().left,
					y: private.dom.offset().top
				};
				
				var direccion = Math.random()*(2*Math.PI); // Algun angulo entre 0 y 2PI
				var nuevaPos = {
					x: private.posActual.x + config.alcanceMax * Math.cos(direccion),
					y: private.posActual.y + config.alcanceMax * Math.sin(direccion)
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
					complete: function() {
						private.dom.removeClass('left right');
						if(_fnCallback)
							_fnCallback();
					},
					progress: function(animation, percent, ms) {
						//TODO: Comprobar hitTest
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

	window.zombie = zombie;
})( window );