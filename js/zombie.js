(function(window, undefined) {

	var zombie = function(initPosition) {
		var private = {
			dom: null,
			alcanceMax: 100,
			deltaEspera: Math.random()*3+1,
			posActual: null,
			timerAutonomo: null,
			timerSeguimiento: null,
			maxBounds: {
				width: jQuery(document).innerWidth(),
				height: jQuery(document).innerHeight()
			},

			create: function() {
				this.dom = jQuery('<div class="zombie"></div>');
				this.dom.appendTo('body');

				if(initPosition) {
					this.dom.css({
						left: initPosition.x,
						top: initPosition.y
					});
				}
				return this.dom;
			},

			calcularNuevaPos: function() {
				private.posActual = {
					x: private.dom.offset().left,
					y: private.dom.offset().top
				};
				
				var direccion = Math.random()*(2*Math.PI); // Algun angulo entre 0 y 2PI
				var nuevaPos = {
					x: private.posActual.x + private.alcanceMax * Math.cos(direccion),
					y: private.posActual.y + private.alcanceMax * Math.sin(direccion)
				};
				
				if(nuevaPos.x < 0) nuevaPos.x = 0;
				if(nuevaPos.y < 0) nuevaPos.y = 0;
				if(nuevaPos.x > private.maxBounds) nuevaPos.x = private.maxBounds.width;
				if(nuevaPos.y > private.maxBounds) nuevaPos.y = private.maxBounds.height;

				return nuevaPos;
			},

			move: function(nuevaPos, _fnCallback) {
				var moveClass = (nuevaPos.x > private.posActual.x) ? 'right' : 'left';
				private.dom.removeClass('left right').addClass(moveClass).animate({
					left: nuevaPos.x,
					top: nuevaPos.y
				}, 700*private.deltaEspera, 'linear', function() {
					private.dom.removeClass('left right');

					if(_fnCallback)
						_fnCallback();
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

			process: function() {
				// Movimiento autonomo
				var nuevaPos = private.calcularNuevaPos();
				private.move(nuevaPos);
				private.timerAutonomo = setInterval(function() {
					var nuevaPos = private.calcularNuevaPos();
					private.move(nuevaPos);
				}, 1100*private.deltaEspera);
			},

			run: function() {
				this.create();
				this.process();
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