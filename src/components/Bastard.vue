<template>
  <div>
    <div :style="style" v-if="life > 0">
    </div>
    <span v-for="bullet in bullets" v-bind:id="bullet.id" class="bullet" :style="{ top: bullet.top + 'px', left: bullet.left + 'px' }">
    </span>
  </div>
</template>

<script>
  import { eventBus } from '../main';

  var WIDTH = 50
  var HEIGHT = 50
  var BULLET_SPEED = 990;
  var BULLET_WIDTH = 4;
  var BULLET_HEIGHT = 4;
  var SHOOT_INTERVAL = 500;

  export default {
    name: 'bastard',
    data: function() {
      return {
        life: 100,
        left: eventBus.enemyPositionX(WIDTH),
        top: 10,
        width: WIDTH,
        height: HEIGHT,
        bullets: []
      };
    },
    created() {
      var vm = this;
      eventBus.$on('attack', (damage, fireEl) => {
        if (this.life > 0) {
          var collison = eventBus.doElsCollide(this, fireEl);
          if (collison === true) {
            vm.life -= damage;
            fireEl.hit = 1;
          }
        }
      });

      // Fire!!!
      setTimeout(this.shoot, SHOOT_INTERVAL);
    },
    methods: {
      shoot() {
        this.bullets.push({
          top: this.top + this.height,
          left: (this.left + this.width / 2),
          height: BULLET_HEIGHT,
          width: BULLET_WIDTH,
          hit: 0,
          id: this.bulletsCounter
        });
        var lastBullet = this.bullets[this.bullets.length - 1]
        this.fireBullet(lastBullet);
        if (this.life > 0) {
          setTimeout(this.shoot, SHOOT_INTERVAL);
        }
      },
      fireBullet(bullet) {
        bullet.top += BULLET_HEIGHT;
        if (bullet.top > 0 && bullet.hit === 0) {
          // global event of an attack.
          // Thank might catch this event
          eventBus.counterAttack(20, bullet);

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
      style: function() {
        var backgroundColor = 'black'
        if (this.life <= 30) {
          backgroundColor = 'red'
        } else if (this.life <= 70) {
          backgroundColor = 'yellow'
        }
        return {
          backgroundColor: backgroundColor,
          left: this.left + 'px',
          top: this.top + 'px',
          height: HEIGHT + 'px',
          width: WIDTH + 'px'
        }
      },
      bulletStyle: function(bullet) {
        return {
          top: bullet.top + 'px',
          left: bullet.left + 'px',
          width: BULLET_WIDTH + 'px',
          height: BULLET_HEIGHT + 'px'
        }
      }
    }
  };
</script>

<style scoped>
  div div{
    position: fixed;
  }

  .bullet {
    width: 4px;
    height: 4px;
    background-color: red;
    position: fixed;
  }
</style>
