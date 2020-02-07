(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function () {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 2;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress).replace(/\s/g, "") + (progress & 1 ? '_' : ' '));
                // console.log(progress, current, $ele.html());
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

function timeElapse(date) {
    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> 天 <span class=\"digit\">" + hours + "</span> 小时 <br> <span class=\"digit\">" + minutes + "</span> 分 <span class=\"digit\">" + seconds + "</span> 秒啦";
    $("#date-count").html(result);
}

// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden, offsetX, offsetY, heartX, heartY;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
    $loveHeart = $("#loveHeart");
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    $("#loveHeart").width(clientWidth)
    $("#loveHeart").height(clientHeight * 0.8)
    offsetX = $loveHeart.width() / 2;
    // offsetY = $loveHeart.height() / 2 - 55;
    offsetY = clientHeight * 0.4
    if ($loveHeart.width() > 600) {
        heartX = 20;
        heartY = 20
    } else {
        heartX = 10;
        heartY = 14;
    }
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function () {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getPoint(index) {
    return points[index];
}

function startXRWAnimation() {
    var interval = 10;
    var index = 0;
    var xrw = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getPoint(index);
        var draw = true;
        for (var i = 0; i < xrw.length; i++) {
            var p = xrw[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            xrw.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (index >= points.length - 1) {
            console.log(points.length);
            clearInterval(animationTimer);
            // showMessages();
        } else {
            index += 1;
        }
    }, interval);
}

function adjustWordPosition() {
    $('#word').css("position", "absolute");
    $('#word').css("top", $("#garden").position().top + $garden.height() / 2 - 60);
    $('#word').css("left", $("#garden").position().left + $garden.width() / 2 - 105 - 20);
}

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = heartX * (16 * Math.pow(Math.sin(t), 3));
    var y = - heartY * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            // showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}