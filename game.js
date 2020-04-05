var TANK_MOVEMENT = 10;
var TANK_WIDTH = 50;
var TANK_HEIGHT = 50;
var BULLET_MOVEMENT = 1;
var BULLET_SPEED = 1500;

var app = new Vue({
  el: '#game',
  data: {
    tankRight: (window.innerWidth / 2),
    bullets: [],
    bulletsCounter: 0
  },
  methods: {
    keyPressed: function(event) {
      if (event.code == 'ArrowRight') {
        this.moveRight();
      } else if (event.code == 'ArrowLeft') {
        this.moveLeft();
      } else if (event.code == 'KeyA') {
        this.trigger();
      }
    },
    moveRight: function() {
      this.tankRight -= TANK_MOVEMENT;
    },
    moveLeft: function() {
      this.tankRight += TANK_MOVEMENT;
    },
    trigger: function() {
      this.bulletsCounter++;
      this.bullets.push({
        bottom: TANK_HEIGHT,
        right: (this.tankRight + TANK_WIDTH / 2),
        id: this.bulletsCounter
      });
      var lastBullet = this.bullets[this.bullets.length - 1]
      this.fireBullet(lastBullet);
    },
    fireBullet: function(bullet) {
      bullet.bottom += BULLET_MOVEMENT;

      // move bullet
      vm = this;
      if (bullet.bottom < window.innerHeight) {
        setTimeout(function () {
          vm.fireBullet(bullet);
        }, 1000 - BULLET_SPEED);
      } else {
        // Remove bullet from list
        let bulletIndex = this.bullets.map(b => b.id).indexOf(bullet.id);
        this.bullets.splice(bulletIndex, 1);
      }
    }
  },
  computed: {
    tankStyle: function() {
      return {
        right: this.tankRight + 'px'
      }
    }
  }
});

// can't create this event with Vue, this is an event for the whole page.
window.addEventListener('keydown', function(e) {
  app.keyPressed(e);
});
