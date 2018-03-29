// var gamePath = Game.gamePath[Game.gameCode]; // 폴더 경로
var gamePath = './'; // 폴더 경로

var YammyPuzzle = {
	score: 0,
	stage: 1,
	next_stage: false,
	timeGauge: 480,
	totalpoint: 0,
	volum: true,
	gameStart: false,
	gameWin: false,
	gameOver: false,
	connect: false,
	wow_face: false,
	clear_wow: false,
	sec_face: false,
	over_s_pop: false,
	dragClass: '',
	/* 신규추가 : 희재 : S*/
	activate: 0,
	dragbbObj: {
		historyOffsetArry: [],
		historyPositionArry: [],
		crrtOffset: null,
		dragDisable: true,
	},
	//201803209 추가
	dragDataName: 'data-success-num',
	dragAttrSecNum: 0,
	dragStartEl: null,
	dragStartItemsType: '',
	dragEndEl: null,
	/* 신규추가 : 희재 : E*/
	update: function() {
		//score 업데이트
		if (YammyPuzzle.score == 0) {
			$('#gain_score').html('0');
		} else if (YammyPuzzle.score == 100) {
			// 성공했을때 (100)
			$('#gain_score').html(YammyPuzzle.score);
			if (YammyPuzzle.stage < 4) {
				if (YammyPuzzle.next_stage) {
					YammyPuzzle.stage += 1;
					YammyPuzzle.score = 0;
					$('.stage').addClass('stage' + YammyPuzzle.stage);
				}
			}
		} else {
			$('#gain_score').html(YammyPuzzle.score);
		}

		if (YammyPuzzle.stage == 4) {
			YammyPuzzle.gameWin = true;
			if (YammyPuzzle.gameWin == true && YammyPuzzle.stage == 4) {
				YammyPuzzle.gameOver_popup();
				YammyPuzzle.stage++;
			}
		}


		YammyPuzzle.timer();
		if (YammyPuzzle.next_stage && YammyPuzzle.stage == 2 || YammyPuzzle.next_stage && YammyPuzzle.stage == 3) {
			YammyPuzzle.food_run();
			$('#timer_gauge').css('width', '480px');
		}
		if (YammyPuzzle.gameOver && YammyPuzzle.over_s_pop) {
			YammyPuzzle.game_overpop();
			YammyPuzzle.over_s_pop = false;
			return;
		}
	},
	timer: function() {
		var left_width = 480 / 30 / 10;
		// 총길이 / 초 / 0.1초  -->1.6
		var time_gauge = Number($('#timer_gauge').css('width').slice(0, -2));
		YammyPuzzle.timeGauge = time_gauge;
		var left_time = '';
		if (YammyPuzzle.score == 100 || YammyPuzzle.gameWin) {
			left_time = time_gauge;
			$('audio')[1].pause();
		} else {
			$('audio')[1].loop = true;
			$('audio')[1].play();
			left_time = YammyPuzzle.timeGauge - left_width;
		};
		if (location.href.indexOf(':8000') != -1) {
			left_time = 500;
		}
		$('#timer_gauge').css('width', (left_time + 'px'));
		if (left_time < 0 && (YammyPuzzle.gameOver != true)) {
			YammyPuzzle.gameOver = true;
			YammyPuzzle.over_s_pop = true;
		}
	},
	render: function() {
		if (!!YammyPuzzle.gameStart) {
			YammyPuzzle.update();
		}
	},
	start_cancel: function() {
		// 연결취소시 표정
		if (YammyPuzzle.wow_face) {
			// $('#character').removeClass('wow_face');
			// $('#character').removeClass('wow_face2');
			// YammyPuzzle.wow_face = false;
		} else if (YammyPuzzle.sec_face) {
			clearInterval(firstface);
			YammyPuzzle.sec_face = false;
		}
		var cancel_sound = $('#game_sound')[0];
		cancel_sound.src = gamePath + "sound/cancel_sound.mp3";
		cancel_sound.play();
		$('#character').addClass('cancel_face');
		setTimeout(function() {
			$('#character').removeClass('cancel_face');
			$('#character').addClass('cancel_face1');
		}, 300);
		setTimeout(function() {
			$('#character').removeClass('cancel_face1');
			$('#character').addClass('cancel_face2');
		}, 600);
		setTimeout(function() {
			$('#character').removeClass('cancel_face2');
			if (YammyPuzzle.sec_face == false) {
				YammyPuzzle.start_winkle();
				YammyPuzzle.sec_face = true;
			}
		}, 900);
	},

	start_winkle: function() {
		// 처음 표정
		// if (YammyPuzzle.wow_face) {
		//     YammyPuzzle.wow_face = false;
		// }
		firstface = setInterval(function() {
			$('#character').toggleClass('first_face');
			$('#character').toggleClass('sec_face');
			YammyPuzzle.sec_face = true;
		}, 800);
	},

	start_connect: function() {
		// 연결성공시 표정
		if (YammyPuzzle.sec_face) {
			clearInterval(firstface);
			YammyPuzzle.sec_face = false;
		}
		$('#character').addClass('wow_face');

		connectface = setInterval(function() {
			$('.wow_face').toggleClass('wow_face2');
		}, 600);

		var wow_sound = $('#game_sound')[0];
		wow_sound.src = gamePath + "sound/wow_sound.wav";
		wow_sound.play();
		YammyPuzzle.wow_face = true;

		if (YammyPuzzle.clear_wow == false) {
			setTimeout(function() {
				clearInterval(connectface);
				$('#character').removeClass('wow_face');
				$('#character').removeClass('wow_face2');
				YammyPuzzle.wow_face = false;

				if (YammyPuzzle.sec_face == false) {
					YammyPuzzle.start_winkle();
					YammyPuzzle.sec_face = true;
				}
				// YammyPuzzle.wow_face = false;
			}, 2000);
		} else {
			YammyPuzzle.clear_wow = false;
		}

		// $('#character').addClass('wow_face');

	},


	game_overpop: function() {
		$('.dim, .game_over_s').css('display', 'inline-block');
		$('audio')[1].muted = true;
		var over_sound = $('#game_sound')[0];
		over_sound.src = gamePath + "sound/over_sound.mp3";
		over_sound.play();
		gameover = setInterval(function() {
			$('.game_over_s').toggleClass('game_over2');
		}, 600);
		setTimeout(function() {
			clearInterval(gameover);
			$('.dim, .game_over_s').remove();
			YammyPuzzle.gameOver_popup();
		}, 2200);
	},
	food_run: function() {
		if (!(YammyPuzzle.stage == 1)) {
			// 처음 셋팅
			clearInterval(firstface);
			YammyPuzzle.sec_face = false;
			clearInterval(connectface);
			$('#character').removeClass('wow_face');
			$('#character').removeClass('wow_face2');
		}
		$('#character').removeClass('wow_face');


		function shuffle(min, max) {
			var RandVal = Math.random() * (max - min) + min;
			return Math.floor(RandVal);
		}

		$(".food").remove();
		var addFood = $(".food_wrap").append(jQuery(Array(37).join("<div class='food'></div>")));
		$('.food.blue ,.food.brown ,.food.purple ,.food.green ,.food.pink ,.food.skyblue ,.food.mint ,.food.yellow, .food.hotpink').draggable({ disabled: false });
		var stage1 = [
			['blue fir', '', 'brown fir', 'pink fir', '', '', 'brown fir', '', '', 'hotpink fir', '', '', '', '', '', 'yellow fir', '', '', '', 'blue fir', '', '', '', '', '', '', '', '', '', '', 'yellow fir', '', '', '', 'hotpink fir', 'pink fir'],
			['pink fir', 'purple fir', 'pink fir', 'brown fir', 'green fir', 'yellow fir', '', '', '', '', '', '', '', '', '', '', '', '', '', 'purple fir', '', '', '', '', '', '', '', '', '', 'yellow fir', 'brown fir', '', '', '', '', 'green fir'],
			['blue fir', '', '', '', '', 'green fir', '', '', '', 'brown fir', '', '', '', 'purple fir', 'green fir', 'blue fir', '', '', '', '', '', '', '', '', '', '', '', '', 'purple fir', 'pink fir', 'brown fir', 'pink fir', '', '', '', '']
		];
		var stage2 = [
			['', '', '', '', '', 'mint fir', '', '', '', '', 'skyblue fir', 'hotpink fir', '', '', '', '', '', '', 'mint fir', 'skyblue fir', '', '', '', '', '', '', '', 'blue fir', 'brown fir', '', 'hotpink fir', 'brown fir', '', '', '', 'blue fir'],
			['mint fir', 'pink fir', '', '', '', 'pink fir', '', '', '', '', '', 'green fir', '', '', '', '', '', '', '', '', 'blue fir', 'yellow fir', 'mint fir', '', '', '', 'green fir', '', '', '', 'yellow fir', '', '', '', '', 'blue fir'],
			['', '', '', '', '', '', '', 'skyblue fir', 'purple fir', 'brown fir', 'skyblue fir', '', 'purple fir', '', '', '', '', 'brown fir', '', '', '', '', '', '', '', '', '', '', 'hotpink fir', '', 'yellow fir', 'hotpink fir', 'yellow fir', '', '', '']
		];

		var stage3 = [
			['mint fir', '', '', '', '', '', 'skyblue fir', '', '', '', 'skyblue fir', '', 'green fir', '', '', '', 'green fir', 'mint fir', '', '', 'purple fir', 'brown fir', '', '', 'purple fir', '', '', '', 'pink fir', '', 'pink fir', '', 'brown fir', '', '', ''],
			['pink fir', '', '', '', '', '', 'blue fir', '', '', '', 'mint fir', '', '', '', 'green fir', '', '', '', 'green fir', 'blue fir', '', '', 'mint fir', 'pink fir', 'skyblue fir', 'purple fir', '', '', '', 'purple fir', '', '', '', '', '', 'skyblue fir'],
			['', '', '', '', '', 'hotpink fir', '', 'hotpink fir', '', 'yellow fir', 'pink fir', '', 'yellow fir', '', '', '', 'mint fir', '', '', 'green fir', '', '', 'pink fir', '', '', 'mint fir', '', 'brown fir', '', '', '', 'green fir', 'brown fir', '', '', '']
		];

		var random_stage = location.href.indexOf(':8000') != -1 ? 1 : shuffle(0, 3);
		// 랜덤 스테이지
		var foodnum = $('.food');
		// 단계 넘어갈때
		for (var i = 0; i < foodnum.length; i++) {
			var stage = (YammyPuzzle.stage == 1) ? stage1 : (YammyPuzzle.stage == 2) ? stage2 : stage3;
			foodnum.eq(i).addClass(stage[random_stage][i]);
			/* 신규추가 : 희재 : S*/
			var classn = stage[random_stage][i].split(' '); //아이탬별로 속성추가. 중간에 드래그시 겹치는 현상 막기위해.
			if (classn[0]) {
				foodnum.eq(i).attr('data-items-type', classn[0]);
			} else {
				foodnum.eq(i).attr('data-not-droppable', true); //성공후 이유는 모르겟지만 drag&drop이 발생할때가 있음
			}
			/* 신규추가 : 희재 : E*/
		}

		YammyPuzzle.start_winkle();
		var _this = this;
		$('.food.fir.blue ,.food.fir.brown ,.food.fir.purple ,.food.fir.green ,.food.fir.pink ,.food.fir.skyblue ,.food.fir.mint ,.food.fir.yellow, .food.fir.hotpink').draggable({
			grid: [100, 100],
			containment: ".food_wrap",
			snap: ".food_wrap",
			revert: "invalid",
			disabled: false,
			helper: "clone",
			scroll: false,
			start: function(ev, ui) {
				var idx = $(this).index();
				$('food').eq(idx).addClass('in');
				_this.dragStartEl = $(this);
				_this.dragStartItemsType = _this.dragStartEl.data('itemsType');
				_this.dragbbObj.historyOffsetArry = [ui.offset];
				_this.dragbbObj.historyPositionArry = [];
			},
			drag: function(ev, ui) {
				// 지금 드래그 중인 특정 배경의 클레스 (컬러로 지정된 라벨) 가져오기
				var classList = $(this).attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
					YammyPuzzle.dragClass = classList[1];
				});
				var dragElm = $(ui.helper);
				var food_offset = $(ui.helper).offset();
				// console.log(food_offset)
				/* 신규추가 : 희재 : S*/
				if (_this.dragbbObj.crrtOffset) {
					if (_this.dragbbObj.crrtOffset.top != food_offset.top || _this.dragbbObj.crrtOffset.left != food_offset.left) {
						if (_this.dragAttrSamFun(ui.position)) {
							_this.dragbbObj.historyOffsetArry.push(food_offset);
							_this.dragbbObj.historyPositionArry.push(ui.position);
						}
					}
				}
				_this.dragbbObj.crrtOffset = food_offset;
				/* 신규추가 : 희재 : E*/
				$.each($('.food'), function(idx, item) {
					// 여기서 this는 food_bg 위쪽의 dragElm 는 헬퍼
					if (JSON.stringify($(this).offset()) == JSON.stringify(food_offset)) {
						if ($(this).hasClass('in')) {
							dragElm.css('opacity', 0);
							var done_class = $(this).attr('class').split(/\s+/);
							if (done_class[1] != YammyPuzzle.dragClass) {
								// 이미 차있는 공간을 지나옴
								// console.log(done_class[1], YammyPuzzle.dragClass);
								dragElm.addClass('stranger');
								return false;
							}
						} else {
							if ($(this).hasClass('ui-droppable')) {
								// dragElm.css('opacity', 1);
								if ($(this).hasClass(YammyPuzzle.dragClass)) {
									$(this).addClass(YammyPuzzle.dragClass + " in");
									dragElm.css('opacity', 1);
								} else {

									dragElm.css('opacity', 0);
								}
							} else {
								/**/
								$(this).addClass(YammyPuzzle.dragClass + " in");
								dragElm.css('opacity', 1);
							}
						}
					}
				});
			},
			stop: function(ev, ui) {
				_this.dragbbObj.historyPositionArry.push(ui.position);
				if (!_this.dragStepGubunFun()) {
					YammyPuzzle.connect = false;
				}
				//console.log(YammyPuzzle.connect)
				var dragElm = $(ui.helper);
				dragElm.remove();

				if (YammyPuzzle.connect) {

					YammyPuzzle.score = Math.floor(100 / 36 * $('.in').length);





					/* 신규추가 희재 : S*/
					/*
					 * 연결이 성공했을때 처음엘리먼트와 마지막엘리먼트를 누르면 연결 취소되게끔 하기윈한
					 * 처음~마지막엘리먼트에 구분값넣기. activate속성 , cancel_d클래스 추가
					 */
					_this.dragStartToEndAddAttr(_this.dragbbObj.historyPositionArry, function() {
						//_this.dragStartEl.attr(_this.dragDataName, _this.dragAttrSecNum);
						_this.dragStartEl.attr('activate', true).addClass('cancel_d');
					}); //처음 엘리먼트 포지션, (이동중에포지션+ 마지막포지션 모두 포함)






					/* 신규추가 희재 : E*/
					if (YammyPuzzle.sec_face) {
						clearInterval(firstface);
						YammyPuzzle.sec_face = false;
					}
					if (YammyPuzzle.score == 100) {
						// 스테이지 클리어
						// 다시 연결
						setTimeout(function() {
							var clear_sound = $('#game_sound')[0];
							clear_sound.src = gamePath + "sound/clear_sound.wav";
							clear_sound.play();
							$('#character').addClass('stage_c');

							$('.cpl_num').css('display', 'inline-block');
							$('.cpl_num').text(YammyPuzzle.stage);

							setTimeout(function() {
								$('#character').removeClass('stage_c');
								$('.cpl_num').css('display', 'none');
								YammyPuzzle.next_stage = true;
							}, 1300);
						}, 900);

					} else {
						// YammyPuzzle.start_connect();

						// if (YammyPuzzle.sec_face == false) {
						//     YammyPuzzle.start_winkle();
						//     YammyPuzzle.sec_face = true;
						// }
					}
					YammyPuzzle.connect = false;

					// return false;

				} else {
					//  안들어갔을때 돌아가기
					$(this).css('opacity', 1);
					$.each($('.food'), function(idx, item) {
						if ($(item).hasClass(YammyPuzzle.dragClass)) {
							if ($(item).hasClass('fir')) {
								$(item).removeClass('in');
							} else {
								$(item).removeClass('in ' + YammyPuzzle.dragClass);
							}

						}
					});
					// 점수 계산
					YammyPuzzle.score = Math.floor(100 / 36 * $('.in').length);
				}
			}
		});
		$(".food.fir").droppable({
			accept: function() {
				if ($(this).hasClass(YammyPuzzle.dragClass)) {
					// console.log(YammyPuzzle.dragClass,$(this));
					return true;
				} else {
					return false;
				}
			},
			tolerance: 'fit',
			drop: function(event, ui) {
				_this.dragbbObj.historyOffsetArry.push(ui.offset);
				if (!_this.dragStepGubunFun()) {
					return false;
				}
				if ($(ui.helper).hasClass('stranger')) {
					return false;
				} else if ($(this).hasClass("in")) {

					if (YammyPuzzle.wow_face) {
						YammyPuzzle.clear_wow = true;
						// 연결중일때 또 연결줄으로 들어오면 연결끊고
						clearInterval(connectface);
						$('#character').removeClass('wow_face');
						$('#character').removeClass('wow_face2');

						YammyPuzzle.wow_face = false;
						YammyPuzzle.start_connect();

						// YammyPuzzle.clear_wow = false;
					} else {
						// 처음에 천천히 한번 연결될때
						YammyPuzzle.start_connect();
					}
					// 연결됬을때
					YammyPuzzle.connect = true;
					$('.fir.' + YammyPuzzle.dragClass).draggable({ disabled: true });
					return false;
				} else {
					return false;
				}
			},
			over: function(event, ui) {},
			out: function(event, ui) {}
		});
		YammyPuzzle.next_stage = false;

		// reset
		$('.fir').mouseup(function() {
			var classList = $(this).attr('class').split(/\s+/);
			$.each(classList, function(index, item) {
				YammyPuzzle.dragClass = classList[1];
			});
			if ($(this).hasClass('in')) {
				$(this).toggleClass('cancel_d');
			}
			$(this).attr("activate", false);
			// 18.03.06 김규남 수정
			if ($(this).hasClass("ui-draggable-disabled")) {
				$(this).attr("activate", true);
				var dragClass_1 = $(".food_wrap").find("." + YammyPuzzle.dragClass + ".fir").eq(1).attr("activate");
				var dragClass_0 = $(".food_wrap").find("." + YammyPuzzle.dragClass + ".fir").eq(0).attr("activate");
				console.log(dragClass_1)
				console.log(dragClass_0)
				if (dragClass_0 === dragClass_1) {
					YammyPuzzle.start_cancel();
					$('.' + YammyPuzzle.dragClass).removeClass('cancel_d');
					if ($('.' + YammyPuzzle.dragClass).hasClass('in')) {
						$.each($('.' + YammyPuzzle.dragClass), function(idx, itm) {
							if ($(this).hasClass('fir')) {
								$(this).removeClass('in');
								$('.' + YammyPuzzle.dragClass).draggable({ disabled: false });
							} else {
								$(this).removeClass('in ui-draggable ui-draggable-handle ui-draggable-disabled ' + YammyPuzzle.dragClass);
							}
						});
					}

					$(".food_wrap").find("." + YammyPuzzle.dragClass + ".fir").eq(0).attr("activate", false);
					$(".food_wrap").find("." + YammyPuzzle.dragClass + ".fir").eq(1).attr("activate", false);
				}
			}

			// 원본 소스
			/*if (document.querySelectorAll('.cancel_d').length == 2 ) {
				if (document.querySelectorAll('.' + YammyPuzzle.dragClass + '.cancel_d').length == 2 ) {
			
					YammyPuzzle.start_cancel();
					$('.' + YammyPuzzle.dragClass).removeClass('cancel_d');
					if ($('.' + YammyPuzzle.dragClass).hasClass('in')) {
						$.each($('.' + YammyPuzzle.dragClass), function(idx, itm) {
							if ($(this).hasClass('fir')) {
								$(this).removeClass('in');
								$('.' + YammyPuzzle.dragClass).draggable({ disabled: false });
							} else {
								$(this).removeClass('in ui-draggable ui-draggable-handle ui-draggable-disabled ' + YammyPuzzle.dragClass);
							}
						});
					}
				} else {
					$('.food').removeClass('cancel_d');
					$(this).addClass('cancel_d');
				}
			
			}*/

		});


	},
	init: function() {
		// 소리한번 실행시키기
		$.preloadImages = function() {
			for (var i = 0; i < arguments.length; i++) {
				$("<img />").attr("src", arguments[i]);
			}
		}

		$.preloadImages(gamePath + '/images/sec_face.png', gamePath + '/images/complete_pop.png', gamePath + '/images/cancel_face.png', gamePath + '/images/cancel_face1.png', gamePath + '/images/cancel_face2.png', gamePath + '/images/ok_face2.png', gamePath + '/images/ok_face.png', gamePath + '/images/ok_face2.png');


		YammyPuzzle.food_run();
		// 게임 시작
		$("#start_game").click(function() {
			$('#game_sound')[0].play();
			// 시작 버튼 클릭시
			$('#ybm_game_13_pop_bg, #game_13_ready').css("display", 'none');
			YammyPuzzle.gameStart = true;
			// time시작
		});

		YammyPuzzle.start();
	},
	start: function() {
		randerInt = setInterval(YammyPuzzle.render, 1000 / 10);
		// 랜더 시작 타이머
		$("#ios_audio_button").click(function() {
			YammyPuzzle.volum_on_off();
		});

		$('#game_13_over').click(function() {
			// 여기부터
			Game.saved = callback(Game.gameCode, Game.schedIndex, Game.seqNo, Game.point);
			clearInterval(randerInt);
			if (Game.saved) {
				Game.ending();
			} else {
				if (confirm("통신상태가 원할하지 못해 게임점수가 저장되지 않았습니다.\n그래도 진행하시겠습니까?")) Game.ending();
			}
			// 여기까지 공통
		});
	},
	gameOver_popup: function() {
		$('#ybm_game_13_pop_bg, #game_13_next').css("display", 'block');
		$('#ybm_game_13_pop_bg .how_to_play').css("display", 'none');
		var result_sound = $('#game_sound')[0];
		result_sound.src = gamePath + "sound/result.mp3";
		result_sound.play();
		if (YammyPuzzle.score == 0) { YammyPuzzle.score = 10 }
		// 영점일 경우에도 점수를 줌
		// 25는 Game.pointMax
		YammyPuzzle.totalpoint = Math.ceil((Game.pointMax / 100 * 10) + ((YammyPuzzle.stage - 1) * 30 * Game.pointMax / 100) + (((Game.pointMax / 100) * 30) / 100 * YammyPuzzle.score));

		if (YammyPuzzle.totalpoint > Game.pointMax) {
			YammyPuzzle.totalpoint = Game.pointMax;
		}
		$('#game_point').text(YammyPuzzle.totalpoint);
		try { Game.point = YammyPuzzle.totalpoint } //cny 획득포인트 추가 - 공통
		catch (error) {};
		return;
	},
	volum_on_off: function() {
		if (YammyPuzzle.volum == true) {
			$('#ios_audio_button').addClass('off');
			$('audio')[0].muted = true;
			$('audio')[1].muted = true;
			YammyPuzzle.volum = false;
		} else {
			$('#ios_audio_button').removeClass('off');
			$('audio')[0].muted = false;
			$('audio')[1].muted = false;
			YammyPuzzle.volum = true;
		}
	},
	dragAttrSamFun: function(qz) {
		var _this = this;
		var nm = false;
		_this.dragStartItemsType = 123
		$('.food').each(function() {
			var $this = $(this);
			var $thisOffset = {
				top: $this[0].offsetTop,
				left: $this[0].offsetLeft
			}

			if ($thisOffset.left == qz.left && $thisOffset.top == qz.top) {
				if (!$this.data('itemsType') || $this.data('itemsType') == _this.dragStartItemsType) {
					nm = true;
				}
			}
		});
		// return nm == _this.dragStartItemsType ? true : false;
		return nm;
	},
	dragStartToEndAddAttr: function(ingend, callback) {
		var _this = this;
		var lastIdx = 0;
		for (var i = 0; i < ingend.length; i++) {
			lastIdx++;
			$('.food').each(function() {
				var $this = $(this);
				var $thisOffset = {
					left: $this[0].offsetLeft,
					top: $this[0].offsetTop
				}
				if ($thisOffset.left == ingend[i].left && $thisOffset.top == ingend[i].top) {
					//$this.attr(_this.dragDataName, _this.dragAttrSecNum);
					if (lastIdx == ingend.length) {
						$this.attr('activate', true).addClass('cancel_d');
					}
				}
			});
		}
		if (typeof callback === 'function') {
			callback();
		}
		this.dragAttrSecNum++;
	},
	dragStepGubunFun: function() {
		var _this = this;
		var gubun = true;
		console.log(_this.dragbbObj.historyOffsetArry)
		if (_this.dragbbObj.historyOffsetArry.length) {
			var cnCnt = 0;
			for (var i = 0; i < _this.dragbbObj.historyOffsetArry.length; i++) {
				cnCnt++;
				if (_this.dragbbObj.historyOffsetArry[cnCnt]) {
					if (_this.dragbbObj.historyOffsetArry[i].top != _this.dragbbObj.historyOffsetArry[cnCnt].top && _this.dragbbObj.historyOffsetArry[i].left != _this.dragbbObj.historyOffsetArry[cnCnt].left) {
						gubun = false;
					}
				}
			}
		}
		return gubun;
	}

}
YammyPuzzle.init();


if (location.href.indexOf(':8000') != -1) {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
	$('#start_game').click();
}