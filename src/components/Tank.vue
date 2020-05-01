<template>
  <div>
    <div id="tank" :style="tankStyle">
    </div>

    <span v-for="bullet in bullets" v-bind:id="bullet.id" :style="{ top: bullet.top + 'px', left: bullet.left + 'px' }" class="bullet">
    </span>
  </div>
</template>

<script>
  import { eventBus } from '../main';

  var TANK_MOVEMENT = 10;
  var TANK_WIDTH = 50;
  var TANK_HEIGHT = 50;
  var BULLET_MOVEMENT = 1;
  var BULLET_SPEED = 1900;

  export default {
    name: 'tank',
    data: function() {
      return {
        left: (window.innerWidth / 2),
        bullets: [],
        bulletsCounter: 0
      };
    },
    methods: {
      moveRight: function() {
        this.left += TANK_MOVEMENT;
      },
      moveLeft: function() {
        this.left -= TANK_MOVEMENT;
      },
      shoot: function() {
        this.bulletsCounter++;
        this.bullets.push({
          top: this.tankTop,
          left: (this.left + TANK_WIDTH / 2),
          height: 2,
          width: 2,
          hit: 0,
          id: this.bulletsCounter
        });
        var lastBullet = this.bullets[this.bullets.length - 1]
        this.fireBullet(lastBullet);
      },
      fireBullet: function(bullet) {
        bullet.top -= BULLET_MOVEMENT;
        if (bullet.top > 0 && bullet.hit === 0) {
          // global event of an attack.
          // All the enemies will catch this event to check a collison
          eventBus.attack(20, bullet);

          // move bullet
          var vm = this;
          setTimeout(function () {
            vm.fireBullet(bullet);
          }, 1000 - BULLET_SPEED);
        } else {
          this.removeBullet(bullet);
        }
      },
      removeBullet: function(b) {
        let bulletIndex = this.bullets.map(b => b.id).indexOf(b.id);
        this.bullets.splice(bulletIndex, 1);
      }
    },
    computed: {
      tankStyle() {
        return {
          left: this.left + 'px',
          top: this.tankTop + 'px',
          height: TANK_HEIGHT + 'px',
          width: TANK_WIDTH + 'px'
        }
      },
      tankTop() {
        return (window.innerHeight - (TANK_HEIGHT + 10))
      }
    },
    created: function () {
      var vm = this;
      // can't create this event with Vue, this is an event for the whole page.
      window.addEventListener('keydown', function(event) {
        if (event.code == 'ArrowRight') {
          vm.moveRight();
        } else if (event.code == 'ArrowLeft') {
          vm.moveLeft();
        } else if (event.code == 'KeyA') {
          vm.shoot();
        }
      });
    }
  };
</script>

<style scoped>
  #tank {
    background-color: green;
    position: fixed;
  }

  .bullet {
    width: 2px;
    height: 2px;
    background-color: black;
    position: fixed;
  }
</style>
