<template>
  <div>
    <div id="tank" :style="tankStyle" v-if="life > 0">
    </div>
    <span v-for="bullet in bullets" v-bind:id="bullet.id" class="bullet" :style="{ top: bullet.top + 'px', left: bullet.left + 'px' }">
    </span>
  </div>
</template>

<script>
  import { eventBus } from '../main';

  var TANK_MOVEMENT = 10;
  var TANK_WIDTH = 50;
  var TANK_HEIGHT = 50;
  var BULLET_SPEED = 999;
  var BULLET_WIDTH = 3;
  var BULLET_HEIGHT = 3;

  export default {
    name: 'tank',
    data: function() {
      return {
        width: TANK_WIDTH,
        height: TANK_HEIGHT,
        top: (window.innerHeight - (TANK_HEIGHT + 10)),
        left: (window.GAME_WIDTH / 2 + window.GAME_OFFSET - (TANK_WIDTH / 2)),
        bullets: [],
        life: 100
      };
    },
    methods: {
      moveRight: function() {
        if (this.left < window.GAME_OFFSET + window.GAME_WIDTH - TANK_WIDTH) {
          this.left += TANK_MOVEMENT;
        }
      },
      moveLeft: function() {
        if (this.left > window.GAME_OFFSET) {
          this.left -= TANK_MOVEMENT;
        }
      },
      shoot: function() {
        this.bullets.push({
          top: this.top,
          left: (this.left + TANK_WIDTH / 2),
          height: BULLET_HEIGHT,
          width: BULLET_WIDTH,
          hit: 0,
          id: this.bulletsCounter
        });
        var lastBullet = this.bullets[this.bullets.length - 1]
        this.fireBullet(lastBullet);
      },
      fireBullet: function(bullet) {
        bullet.top -= BULLET_HEIGHT;
        if (bullet.top < window.innerHeight && bullet.hit === 0) {
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
          top: this.top + 'px',
          height: TANK_HEIGHT + 'px',
          width: TANK_WIDTH + 'px'
        }
      }
    },
    created() {
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

      var vm = this;
      eventBus.$on('counterAttack', (damage, fireEl) => {
        if (this.life > 0) {
          var collison = eventBus.doElsCollide(this, fireEl);
          if (collison === true) {
            vm.life -= damage;
            fireEl.hit = 1;
          }
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
    width: 3px;
    height: 3px;
    background-color: black;
    position: fixed;
  }
</style>
