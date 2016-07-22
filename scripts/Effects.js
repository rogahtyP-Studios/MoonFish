function explode(block) {
    for (var i = 0; i < 100; i++) {
        particleManager.particles.push(new Particle(block.x + a.x + 480, block.y + a.y + 270));
    }
}

var particleManager = {
    particles : [], 
    update: function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }
};

function Particle(x, y) {
    this.x = x;
    this.y = y;

    this.life = 100 + Math.floor(300 * Math.random());
    this.update = function () {
        if (this.life > 0) {
            this.x -= 0.5;
            if (Math.random() > 0.5) {
                this.x++;
            }
            this.y -= 0.5;
            if (Math.random() > 0.5) {
                this.y++;
            }

            ctx = Area.context;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - a.x, this.y - a.y, 1, 1);

            this.life--;
        }
    }
}