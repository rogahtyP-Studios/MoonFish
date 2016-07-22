
    var bullets = [];
    var terrain = [];
    var spawners = [];

    var chats;
    var pause = false;
    var time = 0;
    var money = 0;

    //Mouse info
    var mx = 0;
    var my = 0;
    var canFire = false;
    var fire = false;
    var shots = 1;

    var Shot;
    var Theme;

    function startgame() {
        Area.start();

        a = new ShipCore(480, 270);

        for (var i = 0; i < 10; i++) {
            spawners[i] = new Spawner(Math.floor((Math.random() * 100)), Math.floor((Math.random() * 100)));
        }

        //Shop section
        buttons[0] = new button(10, 10, "Upgrade Ship",0);
        buttons[1] = new button(10, 110, "Upgrade health", 5);
        buttons[2] = new button(10, 210, "Buy Cannon", 10);
        buttons[3] = new button(10, 260, "Buy Armor", 5);

        chats = new Chat("Queen Davida: <To be added>", 5);
        Shot = new sound("assets/shot.mp3");
        Theme = new sound("assets/to_space.mp3");
    }

    function sound(src) {   //Sound elements
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    }

    function Chat(text, duration) {
        this.time = 0;

        this.text = text;
        this.duration = duration;

        this.update = function () {
            if (this.time < this.duration * 25) {
                ctx = Area.context;
                ctx.fillStyle = "#6495ED";
                ctx.fillRect(0, 450, 960, 90);

                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("Transmission Recieved", 100, 500);

                this.time++;
            }else if (this.time < this.duration * 75) {
                ctx = Area.context;
                ctx.fillStyle = "#6495ED";
                ctx.fillRect(0, 450, 960, 90);

                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText(this.text, 100, 500);

                this.time++;
            }
        }
    }

    var keys = [];
    var Area = {
        canvas: document.createElement("canvas"),

        start: function () {

            for (var i = 0; i < 1000; i++) {
                keys[i] = false;
            }
            this.canvas.width = 960;
            this.canvas.height = 540;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);

            //Timer for Updates
            this.interval = setInterval(updateGame, 20);
            this.reload = setInterval(reload, 1000);

            //Add KeyListeners
            window.addEventListener('keydown', function (e) {
                if (e.keyCode == 80 && inshop == false) {
                    pause = !pause;
                }
               keys[e.keyCode] = true;
            })
            window.addEventListener('keyup', function (e) {
                keys[e.keyCode] = false;
            })
            window.addEventListener('mousemove', function (e) {
                mx = e.pageX;
                my = e.pageY;
            })
            window.addEventListener('mousedown', function (e) {
                fire = true;
                Explode(a.turrets[0]);
            })
            window.addEventListener('mouseup', function (e) {
                fire = false;
            })

        },

        clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

       
    }
    
    
    function Block(x, y) {
        this.x = x;
        this.y = y;

        this.random = Math.floor(100 * Math.random());

        this.health = Math.floor(5 * Math.random()) + 1;

        this.update = function () {
            if (this.health > 0) {
                ctx = Area.context;
                ctx.fillStyle = "#00FF" + (40 * this.health).toString(16);
                ctx.fillRect(this.x - a.x, this.y - a.y, 5, 5);

                if (Math.random() < 0.01 && Math.sqrt((a.x - this.x + 480) * (a.x - this.x + 480) + (a.y - this.y + 270) * (a.y - this.y + 270)) < 1000) {       //Fire
                    bullets.push(new Bullet(this.x, this.y, 5, 480, 270, this));
                }

                if (this.x > a.x + 500 + this.random / 10) {
                    this.x -= 0.5;
                } else if (this.x < a.x + 460 + this.random / 10) {
                    this.x += 0.5;
                } else {
                    this.x += Math.random() - 0.5;
                }

                if (this.y > a.y + 290 + this.random / 10) {
                    this.y -= 0.5;
                } else if (this.y < a.y + 250 + this.random / 10) {
                    this.y += 0.5;
                } else {
                    this.y += Math.random() - 0.5;
                }

                for (var i = 0; i < bullets.length; i++) {      //Hit detection
                    if (Math.abs((bullets[i].x - this.x)) < 20 && Math.abs((bullets[i].y - this.y)) < 20) {
                        if (bullets[i].owner != this) {
                            bullets[i].time += 500;
                            this.health--;
                        } else {
                            //Friendly Fire
                        }
                    }
                }
            } else {
                if (this.random != -1) {
                    this.random = -1;
                    money++;
                }
            }
        }

    }
    
    function Spawner(x, y, rate) {
        this.time = 0;
        this.random = 0;

        this.x = x;
        this.y = y;
        this.rate = rate;

        this.update = function () {
            if (time - this.time > 100) {
                this.time = time;

                terrain.push(new Block(this.x + 100, this.y + 100));

            }
            ctx = Area.context;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - a.x, this.y - a.y, 15, 15);

            
        }
    }

    function Tank(x, y) {
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.health = 50;
        this.maxhealth = 50;


        this.update = function () {
            if (this.health > 0) {
                this.x += this.vx;
                this.y += this.vy;


                ctx = Area.context;
                ctx.fillStyle = "black";
                ctx.fillRect(480, 270, 5, 5);

                ctx.font = "20px Consolas";     //Display health
                ctx.fillStyle = "black";
                ctx.fillText("Health " + this.health, 800, 50);

                ctx.font = "20px Consolas";     //Display money
                ctx.fillStyle = "black";
                ctx.fillText("Money " + money, 800, 100);

                ctx.font = "20px Consolas";     //Display speed
                ctx.fillStyle = "black";
                ctx.fillText("Speed " + Math.round(100 * Math.sqrt(this.vx * this.vx + this.vy * this.vy)) / 100, 10, 50);

                ctx.font = "20px Consolas";     //Display coords
                ctx.fillStyle = "black";
                ctx.fillText("( " + Math.round(100*this.x)/100 +" , " + Math.round(100*this.y)/100 + " )", 10, 100);

                if (canFire && fire) {      //Fire a bullet
                    var slope = (mx - this.x) / (my - this.y);
                    for (var i = 0; i < shots; i++) {
                        bullets.push(new Bullet(480 + this.x, 270 + this.y, Math.floor(5 + 10 * Math.random()), mx, my, this));
                        mx += 100/shots;
                        my += slope;
                    }

                    Shot.play();
                    canFire = false;    //Play ze sound
                }

                for (var i = 0; i < bullets.length; i++) {
                    if (Math.abs((bullets[i].x - 480 - a.x)) < 10 && Math.abs((bullets[i].y - 270 - a.y)) < 10) {
                        if (bullets[i].owner != this) {
                            this.health--;
                            bullets[i].time += 500;
                        } else {
                            //Friendly Fire
                        }
                    }
                }

               
            } else {
                ctx.font = "100px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("You Lose", 50, 400);

                pause = true;
            }

        }

    }


    function ShipCore(x, y) {       //Player ship core
        this.x = x;
        this.y = y;
       
        this.angle = 1;
        this.vangle = 1;
        this.vx = 0;
        this.vy = 0;
        this.health = 50;

        this.turrets = [];
        this.blocks = [];
        this.shields = 50;
        this.maxshields = 50;

        //Blueprints?
        this.turrets[0] = new Turret(10, 10, this);
        for (var i = 0; i < 11; i++) {
            this.turrets[i] = new Turret(10 * i - 50, 0, this);
        }
        for (var i = 0; i < 11; i++) {
            this.turrets[i + 11] = new Turret(0, 10 * i - 50, this);
        }


        this.update = function () {
            for (var i = 0; i < this.blocks.length; i++) {      //Armor gets hit first
                this.blocks[i].update();
            }
            for (var i = 0; i < this.turrets.length; i++) {
                this.turrets[i].update();
            }

            this.x += this.vx;
            this.y += this.vy;
                
            this.angle += this.vangle * Math.PI / 180;


            ctx = Area.context;
            ctx.save();
            ctx.translate(480, 270);
            ctx.rotate(this.angle);
            ctx.fillStyle = "black";
            ctx.fillRect(-5/2,-5/2, 5, 15);
            ctx.restore();

            ctx.font = "20px Consolas";     //Display health
            ctx.fillStyle = "black";
            ctx.fillText("Health " + this.health, 800, 50);

            ctx.font = "20px Consolas";     //Display money
            ctx.fillStyle = "black";
            ctx.fillText("Money " + money, 800, 100);

            ctx.font = "20px Consolas";     //Display shields
            ctx.fillStyle = "black";
            ctx.fillText("Shields: " + this.shields, 800, 150);

            ctx.font = "20px Consolas";     //Display speed
            ctx.fillStyle = "black";
            ctx.fillText("Speed " + Math.round(100 * Math.sqrt(this.vx * this.vx + this.vy * this.vy)) / 100, 10, 50);
            
            ctx.font = "20px Consolas";     //Display coords
            ctx.fillStyle = "black";
            ctx.fillText("( " + Math.round(10 * this.x) / 100 + " , " + Math.round(10 * this.y) / 10 + " )", 10, 100);


            
            
            if (canFire && fire) {
                if (!shipyard) {
                    for (var i = 0; i < this.turrets.length; i++) {
                        this.turrets[i].fire(mx, my);        //Player only
                    }
                }
            }


            if (this.shields < this.maxshields && time % 100 == 0) {     //Healing!
                this.shields++;
            }
            this.vangle = 0;

        }

    }

    function Turret(x, y, main/*, reload*/) {       //X and y relative to main body
   
        this.x = x;
        this.y = y;
        this.main = main;
        this.health = 5;
        this.image = new Image();
        this.image.src = "assets/turret.png";

        this.dis = Math.sqrt(x * x+y * y);
        this.angle = 0;
        this.pangle = Math.atan(y / x);     //Starting angle
        if (this.x < -0.1) {
            this.pangle += Math.PI;
        }
       

        this.reload = 100 + Math.floor(100 * Math.random());

        this.level = 0;     //Built in for upgrades later on
        this.time = 0;

        this.update = function () {
            if (this.health > 0) {
                this.angle = this.main.angle;

                this.x =  this.dis * Math.cos(this.main.angle + this.pangle);
                this.y =  this.dis * Math.sin(this.main.angle + this.pangle);

                ctx = Area.context;
                ctx.save();
                ctx.translate(480 + this.x, 270 + this.y);
                ctx.rotate(this.main.angle);
                ctx.fillStyle = "red";
                ctx.drawImage(this.image,-5,-5,10,10)
                ctx.restore();

                for (var i = 0; i < bullets.length; i++) {
                    if (Math.abs((bullets[i].x - 480 - this.x - this.main.x)) < 5 && Math.abs((bullets[i].y - 270 - this.y - this.main.y)) < 5) {
                        bullets[i].time += 1000;
                        if (bullets[i].owner != this.main) {            //Bullets grouped by main
                            if (this.main.shields > 0) {
                                this.main.shields--;
                            } else {
                                this.health--;
                            }

                        } else {
                            //Friendly Fire
                        }
                        bullets[i].update();
                    }
                }

            }
        }

        this.fire = function (xpos, ypos) {      //Coords of target
            if (this.health > 0) {
                if (time - this.time > this.reload) {       //Can fire
                    bullets.push(new Bullet(this.x + this.main.x + 480, this.y + this.main.y + 270, 5, xpos, ypos, this.main));
                    this.time = time;

                    bullets[bullets.length - 1].x += 2 * bullets[bullets.length - 1].vx;
                    bullets[bullets.length - 1].y += 2 * bullets[bullets.length - 1].vy;

                    bullets[bullets.length - 1].vx += this.main.vx;
                    bullets[bullets.length - 1].vy += this.main.vy;
                }

            }
        }
        

    }

    function Armor(x,y,main) {
        this.x = x;
        this.y = y;
        
        this.main = main;
        this.health = 15;
        this.image = new Image();
        this.image.src = "assets/armor.png";

        this.dis = Math.sqrt(x * x + y * y);
        this.angle = 0;
        this.pangle = Math.atan(y / x);     //Starting angle
        if (this.x < -0.1) {
            this.pangle += Math.PI;
        }

        this.time = 0;
        this.update = function () {
            if (this.health > 0) {
                this.angle = this.main.angle;

                this.x = this.dis * Math.cos(this.main.angle + this.pangle);
                this.y = this.dis * Math.sin(this.main.angle + this.pangle);
                

                ctx = Area.context;
                ctx.save();
                ctx.translate(480 + this.x, 270 + this.y);
                ctx.rotate(this.main.angle);
                ctx.fillStyle = "red";
                ctx.drawImage(this.image, -5, -5, 10, 10)
                ctx.restore();

                for (var i = 0; i < bullets.length; i++) {
                    if (Math.abs((bullets[i].x - 480 - a.x)) < 5 && Math.abs((bullets[i].y - 270 - a.y)) < 5) {
                        bullets[i].time += 1000;
                        if (bullets[i].owner != this.main) {            //Bullets grouped by main
                            if (this.main.shields > 0) {
                                this.main.shields--;
                            } else {
                                this.health--;
                            }

                        } else {
                            //Friendly Fire
                        }
                        bullets[i].update();
                    }
                }

            }
        }
    }


    function Bullet(xpos, ypos, speed, x, y, owner) {       //Owners: 0 = Player 1 = Enemy
        this.x = xpos;
        this.y = ypos;
        this.owner = owner;

        var z = Math.sqrt((x - this.x + a.x) * (x - this.x + a.x) + (y - this.y + a.y) * (y - this.y + a.y));
        this.vx = speed * (x - this.x + a.x) / z;
        this.vy = speed * (y - this.y + a.y) / z;

        this.time = 0;

        this.update = function () {


            if (this.time < 1000) {
                this.x += this.vx;
                this.y += this.vy;
                this.time++;

                ctx = Area.context;
                ctx.fillStyle = "red";
                ctx.fillRect(this.x - a.x, this.y - a.y, 5, 5);
            } else {
                this.x = 10000000;
                this.y = 10000000;
            }


        }
    }

    function reload() {     //Reload ~May bring into updateGame()
        canFire = true;
    }

    function move() {       //Move
        var move = 0;
        if (keys[37]) { a.vangle -= 20 / (a.turrets.length + a.blocks.length); }
        if (keys[38]) { move = -1; }
        if (keys[39]) { a.vangle += 20 / (a.turrets.length + a.blocks.length); }
        if (keys[40]) { move = 1; }

        a.vx += move * Math.sin(a.angle) / (a.turrets.length + a.blocks.length);
        a.vy -= move * Math.cos(a.angle) / (a.turrets.length + a.blocks.length);
    }

    var selection = -1;      //0 is cannon; 1 is armor
    var shoptime = 0;
    var buttons = [];
    var inshop = false;
    var shipyard = false;
    function shop() {
        if (keys[83] && time - shoptime > 50) {
            pause = !pause;
            shoptime = time;
            inshop = !inshop;
            shipyard = false;
        }

            if (pause == true && inshop == true) {
                Area.context.clearRect(0, 0, Area.canvas.width, Area.canvas.height);    //Clean stuff for moi!

                buttons[0].update();

                if (buttons[0].clicked == -10) {
                    shipyard = true;
                }

                

                if (shipyard) {     //Building!
                    a.angle = 0;

                    a.update();
                    buttons[1].update();
                    buttons[2].update();
                    buttons[3].update();
                    if (buttons[1].clicked == -10) {
                        a.maxhealth += 10;
                    }

                    if (buttons[2].clicked == -10) {
                        selection = 0;
                        shoptime = time;
                    }

                    if (buttons[3].clicked == -10) {
                        selection = 1;
                        shoptime = time;
                    }

                    if (fire && time - shoptime > 15) {
                        if (selection == 0) {
                            if (money > 0) {
                                a.turrets.push(new Turret(Math.floor((mx - 480) / 10) * 10, Math.floor((my - 270) / 10) * 10, a));
                               
                                money -= 10;
                                shoptime = time;

                                a.update();


                                for (var i = 0; i < a.turrets.length - 2; i++) {
                                    if (a.turrets[a.turrets.length - 1].x == a.turrets[i].x && a.turrets[a.turrets.length - 1].y == a.turrets[i].y) {       //Block already placed
                                        crossing = true;
                                    }
                                }
                                if (crossing) {
                                    a.turrets.splice(a.turrets.length - 1, 1);
                                    money += 10;
                                }
                            }
                        } else if (selection == 1) {
                            if (money > 5) {
                                a.blocks.push(new Armor(Math.floor((mx - 480) / 10) * 10, Math.floor((my - 270) / 10) * 10, a));
                                money -= 5;
                                shoptime = time;

                                a.update();

                                var crossing = false;
                                for(var i = 0; i < a.turrets.length - 1; i++){
                                    if (a.blocks[a.blocks.length - 1].x == a.turrets[i].x && a.blocks[a.blocks.length - 1].y == a.turrets[i].y) {       //Block already placed
                                        crossing = true;
                                    }
                                }
                                if (crossing) {
                                    a.blocks.splice(a.blocks.length - 1, 1);
                                    money += 5;
                                }
                            }
                        } else {

                        }


                    }
                }
            }

    }
    
    

    function button(x, y, text,price) {     //Used in shop
        this.time = 0;
        this.x = x;
        this.y = y;
        this.text = text;
        this.price = price;

        this.update = function () {
            ctx = Area.context;
            if (this.clicked < 0) {
                ctx.fillStyle = "green";
                this.clicked++;
            } else {
                ctx.fillStyle = "red";
            }
            ctx.fillRect(this.x, this.y, 250, 50);

            ctx.font = "20px Consolas";     //Display text
            ctx.fillStyle = "black";
            ctx.fillText(this.text + " - " + this.price, this.x + 25, this.y + 25);

            if (fire && mx > this.x && mx < this.x + 250 && my > this.y && my < this.y + 50 && time - this.time > 25 && money >= this.price) {
                this.clicked = -10;
                money -= price;
                this.time = time;
            }


        }
    }

    function updateGame() {     //Update all events
        Theme.play();
        time++;     //Used for time based events
        if (!pause) {
            Area.clear();
            move();
            ParticleManager.update();
            a.update();

            


            for (var i = 0; i < bullets.length; i++) {  //Update bullets
                if (bullets[i] != null) {
                    bullets[i].update();
                }
            }

            for (var i = 0; i < terrain.length; i++) {      //Update terrain
                terrain[i].update();
            }

            for (var i = 0; i < spawners.length; i++) {      //Update spawnrs
                spawners[i].update();
            }

            chats.update(); //Update text
        }

        shop();

        if (time % 2000 == 250) {
            chats = new Chat("This is a WIP btw", 10);
        }
        
    }
    
