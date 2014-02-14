var nmbNetwork = function() {
    var graph = new joint.dia.Graph;

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1000,
        height: 600,
        gridSize: 10,
        perpendicularLinks: true,
        model: graph
    });


    joint.shapes.basic.Ball = joint.shapes.basic.Generic.extend({
        markup: '<g class="rotatable"><g class="scalable"><image/></g></g><text/>',

        defaults: joint.util.deepSupplement({
            type: 'basic.Ball',
            angle: 0,
            attrs: {
                text: {
                    'text-anchor': 'middle',
                    'ref-x': .5,
                    'ref-y': 0,
                    ref: 'image',
                    fill: 'black',
                    'font-size': 12
                },
                image: {
                    'width': 50,
                    'height': 50
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    var pn = joint.shapes.pn;
    var uml = joint.shapes.uml;
    var org = joint.shapes.org;
    var erd = joint.shapes.erd;
    var basic = joint.shapes.basic;

//var pReady = new pn.Place({ position: { x: 140, y: 50 }, attrs: { '.label': { text: 'ready' }  }, tokens: 1 });
//var pIdle = new pn.Place({ position: { x: 140, y: 260 }, attrs: { '.label': { text: 'idle' } }, tokens: 0 });
//var buffer = new pn.Place({ position: { x: 350, y: 160 }, attrs: { '.label': { text: 'buffer' }  }, tokens: 0});
//var cAccepted = new pn.Place({ position: { x: 550, y: 50 }, attrs: { '.label': { text: 'accepted' }  }, tokens: 0 });
//var cReady = new pn.Place({ position: { x: 560, y: 260 }, attrs: { '.label': { text: 'ready' } }, tokens: 0 });


//var pProduce = new pn.Transition({ position: { x: 50, y: 160 }, attrs: { '.label': { text: 'produce' }  } });
//var pSend = new pn.Transition({ position: { x: 270, y: 160 }, attrs: { '.label': { text: 'send' }  } });
//var cAccept = new pn.Transition({ position: { x: 470, y: 160 }, attrs: { '.label': { text: 'accept' }  } });
//var cConsume = new pn.Transition({ position: { x: 680, y: 160 }, attrs: { '.label': { text: 'consume' } } });


    var nmbUser = new pn.Actor({
        position: { x: 0, y: 200 },
        attrs: {

        },
        tokens: 0
    });


    var frontendVip = new pn.Transition({
        position: { x: 150, y: 200 },
        attrs: {
            '.label': { text: 'Load Balancer' }
        },
        tokens: 0
    });

    var wwwSrvs = [];
    for (var i = 0; i < 4; i++) {
        wwwSrvs.push(new basic.Ball({
            position: { x: 280, y: (i) * 130 },
            size: { width: 90, height: 90 },
            attrs: {
                text: { text: 'WWW Srv' },
                image: { 'xlink:href': "css/85px-Server-web.svg.png" }
            },
            tokens: 0
        }));
    }

    var backedVip = new pn.Transition({
        position: { x: 500, y: 200 },
        attrs: {
            '.label': { text: 'Load Balancer' }
        },
        tokens: 0
    });


    var appSrvs = [];
    for (var i = 0; i < 2; i++) {
        appSrvs.push(new basic.Ball({
            position: { x: 600, y: i * 260 + 65 },
            size: { width: 90, height: 90 },
            attrs: {
                text: { text: 'App Srv' },
                image: { 'xlink:href': "css/85px-Server.svg.png" }
            },
            tokens: 0
        }));
    }

    var hostVip = new pn.Transition({
        position: { x: 750, y: 200 },
        attrs: {
            '.label': { text: 'Load Balancer' }
        },
        tokens: 0
    });

    var hostSrvs = [];
    for (var i = 0; i < 3; i++) {
        hostSrvs.push(new basic.Ball({
            position: { x: 900, y: i * 120+65 },
            size: { width: 90, height: 90 },
            attrs: {
                text: { text: '"DB systems"' },
                image: { 'xlink:href': "css/85px-Server-accounting.svg.png" }
            },
            tokens: 0
        }));
    }


    function link(a, b) {

        return new pn.Link({
            source: { id: a.id, selector: '.root' },
            target: { id: b.id, selector: '.root' }
        });
    }

    function backLink(a, b) {

        return new pn.Link({
            source: { id: b.id, selector: '.root' },
            target: { id: a.id, selector: '.root' }
        });
    }

    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

//graph.addCell([ pReady, pIdle, buffer, cAccepted, cReady, pProduce, pSend, cAccept, cConsume ]);
    graph.addCell([nmbUser, frontendVip].concat(wwwSrvs).concat(appSrvs).concat(hostSrvs));
    graph.addCell(backedVip);
    graph.addCell(hostVip);


    var arrayOfLinks = [[link(nmbUser, frontendVip)], [], [], [], [], []];
    var arrayOfBackLinks = [[backLink(nmbUser, frontendVip)], [], [], [], [], []];
    for (var i = 0; i < wwwSrvs.length; i++) {
        arrayOfLinks[1].push(link(frontendVip, wwwSrvs[i]));
        arrayOfBackLinks[1].push(backLink(frontendVip, wwwSrvs[i]));
        arrayOfLinks[2].push(link(wwwSrvs[i], backedVip));
        arrayOfBackLinks[2].push(backLink(wwwSrvs[i], backedVip));
    };

    for (var i = 0; i < appSrvs.length; i++) {
        arrayOfLinks[3].push(link(backedVip, appSrvs[i]));
        arrayOfBackLinks[3].push(backLink(backedVip, appSrvs[i]));
        arrayOfLinks[4].push(link(appSrvs[i], hostVip));
        arrayOfBackLinks[4].push(backLink(appSrvs[i], hostVip));
    }

    for (var i = 0; i < hostSrvs.length; i++) {
        arrayOfLinks[5].push(link(hostVip, hostSrvs[i]));
        arrayOfBackLinks[5].push(backLink(hostVip, hostSrvs[i]));
    }

    var allLinks = [];
    for (var i = 0; i < arrayOfLinks.length; i++) {
        allLinks = allLinks.concat(arrayOfLinks[i]).concat(arrayOfBackLinks[i]);
    }
    graph.addCell(allLinks);

    var indexPath = [];
    var currentColor = get_random_color();
    var token;
    function doAnimation(nowInPart, prevIndex, front) {
        var sec = 1;
        var currentLinks;
        //debugger;
        if(front==false)
            currentLinks = arrayOfBackLinks[nowInPart];
        else
            currentLinks= arrayOfLinks[nowInPart];
        var currentIndex = 0;

        if (front == false) {
            currentIndex = indexPath.pop();
        } else {
            if (nowInPart == 0)
                currentIndex = 0;
            else if (nowInPart % 2 == 0)
                currentIndex = prevIndex;
            else
                currentIndex = Math.floor((Math.random() * 100)) % currentLinks.length;
            indexPath.push(currentIndex);
        }
        var path = paper.findViewByModel(currentLinks[currentIndex]).$('.connection')[0];
        var r = 5;
        /*if (front == false)
            r += 5+ (arrayOfLinks.length - nowInPart);
        else {
            r = 5 + nowInPart;
        }*/
        token = V('circle', { r: r, fill: currentColor });
        $(paper.viewport).append(token.node);
        token.animateAlongPath({ dur: sec + 's', repeatCount: 1 },
            path
        );
        //var end = paper.findViewByModel(links[0]).$('.connection')[0];

        _.delay(function() {
            //var x = token.bbox().x+15;
            //var y = token.bbox().y+5;
            token.remove();
            if (front == false) {
                if (nowInPart <= 0) {
                    front = true;
                    nowInPart = 0;
                    currentColor = get_random_color();
                } else {
                    nowInPart--;
                }
            } else {
                if ((nowInPart + 1) >= arrayOfLinks.length) {
                    front = false;
                    nowInPart = arrayOfLinks.length - 1;
                } else {
                    nowInPart++;
                }
                //nowInPart = (nowInPart + 1) % arrayOfLinks.length;
            }
            doAnimation(nowInPart, currentIndex, front);
            //token = V('circle', { r: 5, fill: 'red',  cx: x, cy: y });
            //$(paper.viewport).append(token.node);
        }, (sec) * 1000);
    }
    this.start = function(){
        doAnimation(0, 0, true);
    }
    this.stop = function(){
        token.remove();
    }
    
    return this;
};
