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
    dragClass: '',
    update: function() {
        //score 업데이트
        if (YammyPuzzle.score == 0) {
            $('#gain_score').html('00');
        } else if (YammyPuzzle.score == 100) {
            // 성공했을때 (100)
            $('#gain_score').html(YammyPuzzle.score);

            if (YammyPuzzle.stage < 4) {
                YammyPuzzle.stage += 1;
                YammyPuzzle.score = 0;
                $('.stage').addClass('stage' + YammyPuzzle.stage);
                YammyPuzzle.next_stage = true;
            } else {
                YammyPuzzle.gameWin = true;
                if (YammyPuzzle.gameWin == true) {
                    YammyPuzzle.gameOver_popup();
                }
            }
        } else {
            $('#gain_score').html(YammyPuzzle.score);
        }
        // YammyPuzzle.timer();
        if (YammyPuzzle.next_stage && YammyPuzzle.stage == 2 || YammyPuzzle.next_stage && YammyPuzzle.stage == 3) {

            YammyPuzzle.food_run();
        }
    },
    timer: function() {
        var left_width = 480 / 30 / 10;
        // 총길이 / 초 / 0.1초  -->1.6
        var time_gauge = Number($('#timer_gauge').css('width').slice(0, -2));
        YammyPuzzle.timeGauge = time_gauge - left_width;
        $('#timer_gauge').css('width', (YammyPuzzle.timeGauge + 'px'));
        if (YammyPuzzle.timeGauge < 0) {
            YammyPuzzle.gameOver = true;
            YammyPuzzle.gameOver_popup();
        }
    },
    render: function() {
        if (!!YammyPuzzle.gameStart) {
            // YammyPuzzle.update();
        }
        // 시작 안하고 바로 타이머 돌려보기
        // YammyPuzzle.timer();
        YammyPuzzle.update();

    },
    food_run: function() {
        $(".food_bg").remove();
        $(".food").remove();
        var addFoodbg = $(".block_wrap").append(jQuery(Array(37).join("<div class='food_bg'></div>")));
        var addFood = $(".food_wrap").append(jQuery(Array(37).join("<div class='food'></div>")));
        // $(".food_bg.blue ,.food_bg.brown ,.food_bg.purple ,.food_bg.green ,.food_bg.pink ,.food_bg.skyblue ,.food_bg.mint ,.food_bg.yellow, .food_bg.hotpink").droppable({ disabled: false });
        $('.food.blue ,.food.brown ,.food.purple ,.food.green ,.food.pink ,.food.skyblue ,.food.mint ,.food.yellow, .food.hotpink').draggable({ disabled: false });
        var stage1 = ['blue fir', '', 'brown fir', 'pink fir', '', '', 'brown fir', '', '', 'hotpink fir', '', '', '', '', '', 'yellow fir', '', '', '', 'blue fir', '', '', '', '', '', '', '', '', '', '', 'yellow fir', '', '', '', 'hotpink fir', 'pink fir'];
        var stage2 = ['blue fir', '', '', '', '', 'green fir', '', '', '', 'brown fir', '', '', '', 'purple fir', 'green fir', 'blue fir', '', '', '', '', '', '', '', '', '', '', '', '', 'purple fir', 'pink fir', 'brown fir', 'pink fir', '', '', '', ''];
        var stage3 = ['mint fir', '', '', '', '', '', 'skyblue fir', '', '', '', 'skyblue fir', '', 'green fir', '', '', '', 'green fir', 'mint fir', '', '', 'purple fir', 'brown fir', '', '', 'purple fir', '', '', '', 'pink fir', '', 'pink fir', '', 'brown fir', '', '', ''];
        var foodnum = $('.food');
        for (var i = 0; i < foodnum.length; i++) {
            if (i > 0) {
                var stage = (YammyPuzzle.stage == 2) ? stage1 : (YammyPuzzle.stage == 3) ? stage2 : stage1;
                foodnum.eq(i).removeClass(stage[i]);
                $('.food_bg').eq(i).removeClass(stage[i]);
                $('.food_bg').eq(i).removeClass('in');
            }

            var stage = (YammyPuzzle.stage == 1) ? stage1 : (YammyPuzzle.stage == 2) ? stage2 : stage3;
            foodnum.eq(i).addClass(stage[i]);
            $('.food_bg').eq(i).addClass(stage[i]);
        }



        $('.food.blue ,.food.brown ,.food.purple ,.food.green ,.food.pink ,.food.skyblue ,.food.mint ,.food.yellow, .food.hotpink').draggable({
            grid: [100, 100],
            containment: ".block_wrap",
            snap: ".block_wrap",
            revert: "invalid",
            disabled: false,
            helper: "clone",
            scroll: false,
            start: function() {
                // console.log(YammyPuzzle.dragClass);
                if ($(this).hasClass('in')) {
                    $('.food.' + YammyPuzzle.dragClass).draggable({ revert: true });
                    if ($('.food_bg').hasClass(YammyPuzzle.dragClass)) $('.food_bg.' + YammyPuzzle.dragClass).removeClass('in');
                }
                var idx = $(this).index();
                $('.food_bg').eq(idx).addClass('in');
            },
            drag: function(ev, ui) {
                var classList = $(this).attr('class').split(/\s+/);
                $.each(classList, function(index, item) {
                    YammyPuzzle.dragClass = classList[1];
                });
                // var idx = $(ui.helper).index();
                // console.log(idx);

                var dragElm = $(ui.helper);
                var food_offset = $(ui.helper).offset();
                $.each($('.food_bg'), function(idx, item) {
                    // 여기서 this는 food_bg 위쪽의 dragElm 는 헬퍼
                    if (JSON.stringify($(this).offset()) == JSON.stringify(food_offset)) {
                        if ($(this).hasClass('in')) {
                            dragElm.css('opacity', 0);
                            return false;
                        } else {
                            if ($(this).hasClass('ui-droppable')) {
                                dragElm.css('opacity', 1);
                                if ($(this).hasClass(YammyPuzzle.dragClass)) {
                                    $(this).addClass("in " + YammyPuzzle.dragClass);
                                    dragElm.css('opacity', 1);
                                } else {
                                    dragElm.css('opacity', 0);
                                }

                            } else {
                                $(this).addClass("in " + YammyPuzzle.dragClass);
                                dragElm.css('opacity', 1);

                            }
                            // console.log($(this).hasClass('ui-droppable'));

                            // if ($('this').hasClass(YammyPuzzle.dragClass)) {

                            // }

                        }
                    }
                });
            },
            stop: function() {
                if (YammyPuzzle.connect) {
                    // console.log($( YammyPuzzle.dragClass));
                    // $('.' + YammyPuzzle.dragClass).draggable({ disabled: true });

                    YammyPuzzle.connect = false;
                } else {
                    //  안들어갔을때 돌아가기
                    $(this).css('opacity', 1);
                    if ($('.food_bg').hasClass(YammyPuzzle.dragClass)) {
                        if ($('.food_bg').hasClass('fir')) {
                            $('.food_bg.' + YammyPuzzle.dragClass).removeClass('in ');
                            // $('.food_bg').addClass(YammyPuzzle.dragClass);
                        } else {
                            $('.food_bg').removeClass(YammyPuzzle.dragClass);
                        }
                    }

                    // if ($('.food_bg').hasClass(YammyPuzzle.dragClass)) {
                    //     if ($('.food_bg').hasClass('fir')) {
                    //         return false;
                    //     } else {
                    //         $('.food_bg.' + YammyPuzzle.dragClass).removeClass('in ' + YammyPuzzle.dragClass)

                    //     }

                    // };
                }
                // 점수 계산
                YammyPuzzle.score = Math.ceil(100 / 36 * $('.food_bg.in').length);
            }
        });
        $(".food_bg.blue ,.food_bg.brown ,.food_bg.purple ,.food_bg.green ,.food_bg.pink ,.food_bg.skyblue ,.food_bg.mint ,.food_bg.yellow, .food_bg.hotpink").droppable({
            accept: function() {
                if ($(this).hasClass(YammyPuzzle.dragClass)) {
                    // console.log(YammyPuzzle.dragClass,$(this));
                    return true;
                } else {
                    return false;
                }
            },
            classes: {
                "ui-droppable-active": "ui-state-active",
                "ui-droppable-hover": "ui-state-hover"
            },
            tolerance: 'fit',
            drop: function(event, ui) {
                if ($(this).hasClass("in")) {
                    // 연결됬을때
                    YammyPuzzle.connect = true;
                    // $(this).droppable({ disabled: true });
                    // return false;
                } else {
                    return false;

                }

            },
            over: function(event, ui) {},
            out: function(event, ui) {}
        });



        YammyPuzzle.next_stage = false;

    },
    init: function() {
        // 소리한번 실행시키기
        $('#game_sound')[0].play();
        // var addFoodbg = $(".block_wrap").append(jQuery(Array(37).join("<div class='food_bg'></div>")));
        // var addFood = $(".food_wrap").append(jQuery(Array(37).join("<div class='food'></div>")));

        YammyPuzzle.food_run();
        // 게임 시작
        $("#start_game").click(function() {
            // 시작 버튼 클릭시
            $('#ybm_game_13_pop_bg, #game_13_ready').css("display", 'none');
            YammyPuzzle.gameStart = true;
            // time시작
        });

        YammyPuzzle.start();
    },
    start: function() {
        setInterval(YammyPuzzle.render, 1000 / 10);
        // 랜더 시작 타이머
        // 처음 눈 깜빡임 시작
        function start_winkle() {
            // 처음 표정
            firstface = setInterval(function() {

                $('#character').toggleClass('first_face');
                $('#character').toggleClass('sec_face');
            }, 800);
        }

        // start_winkle();
        $("#ios_audio_button").click(function() {
            YammyPuzzle.volum_on_off();
        });

        $('#game_13_over').click(function() {
            //여기부터
            // Game.saved = callback(Game.gameCode, Game.schedIndex, Game.seqNo, Game.point);

            // if (Game.saved) {
            //     Game.ending();
            // } else {
            //     if (confirm("통신상태가 원할하지 못해 게임점수가 저장되지 않았습니다.\n그래도 진행하시겠습니까?")) Game.ending();
            // }
            //여기까지 공통
        });
    },
    gameOver_popup: function() {
        $('#ybm_game_13_pop_bg, #game_13_next').css("display", 'block');

        if (YammyPuzzle.score == 0) { YammyPuzzle.score = 10 }
        // 영점일 경우에도 점수를 줌
        YammyPuzzle.totalpoint = Math.ceil(YammyPuzzle.score / 100 * Game.pointMax);
        if (YammyPuzzle.totalpoint > Game.pointMax) {
            YammyPuzzle.totalpoint = Game.pointMax;
        }
        $('#game_12_point').text(YammyPuzzle.totalpoint);
        try { Game.point = YammyPuzzle.totalpoint } //cny 획득포인트 추가 - 공통
        catch (error) {};
        return;
    },
    volum_on_off: function() {
        if (YammyPuzzle.volum == true) {
            $('#ios_audio_button').addClass('off');
            $('audio')[0].muted = true;
            YammyPuzzle.volum = false;
        } else {
            $('#ios_audio_button').removeClass('off');
            $('audio')[0].muted = false;
            YammyPuzzle.volum = true;
        }
    }

}
YammyPuzzle.init();