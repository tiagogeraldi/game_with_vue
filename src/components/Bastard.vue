<template>
  <div>
    <div :style="style" v-if="life > 0" class="bastard">
    </div>
    <span v-for="bullet in bullets" v-bind:id="bullet.id" class="bullet" :style="{ top: bullet.top + 'px', left: bullet.left + 'px' }">
    </span>
  </div>
</template>

<script>
  import { eventBus } from '../main';

  export const CONF = Object.freeze({
    WIDTH: 50,
    HEIGHT: 50,
    BULLET_SPEED: 990,
    BULLET_WIDTH: 4,
    BULLET_HEIGHT: 4,
    SHOOT_INTERVAL: 900,
    MOVE_INTERVAL: 500
  })

  export default {
    props: ['status', 'bastards', 'id'],
    data: function() {
      return {
        life: 0,
        top: 10,
        left: 0,
        width: CONF.WIDTH,
        height: CONF.HEIGHT,
        bullets: [],
        ready: false
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
      this.findPosition()
      // Fire!!!
      this.shoot()
      this.move()
    },
    methods: {
      findPosition() {
        // Do not allow a new bastard overlay
        // any existing bastard
        let collide = false
        do {
          this.left = eventBus.enemyPositionX(50) // random position
          collide = false
          this.bastards.forEach((b) => {
            if (b.id != this.id && eventBus.doElsCollide(b.obj, this)) {
              collide = true
            }
          })
        } while (collide)
        this.life = 100 // ready to go
        this.$emit('addBastard', this)
      },
      alive() {
        return (this.status === 'playing' && this.life > 0)
      },
      shoot() {
        this.bullets.push({
          top: this.top + this.height,
          left: (this.left + this.width / 2),
          height: CONF.BULLET_HEIGHT,
          width: CONF.BULLET_WIDTH,
          hit: 0,
          id: this.bulletsCounter
        });
        var lastBullet = this.bullets[this.bullets.length - 1]
        this.fireBullet(lastBullet);
        if (this.alive()) {
          setTimeout(this.shoot, CONF.SHOOT_INTERVAL);
        }
      },
      fireBullet(bullet) {
        bullet.top += CONF.BULLET_HEIGHT;
        if (this.alive() && bullet.top < window.innerHeight && bullet.hit === 0) {
          console.log(this.status)
          // global event of an attack.
          // Thank might catch this event
          eventBus.counterAttack(20, bullet);

          // move bullet
          var vm = this;
          setTimeout(function () {
            vm.fireBullet(bullet);
          }, 1000 - CONF.BULLET_SPEED);
        } else {
          this.removeBullet(bullet);
        }
      },
      removeBullet: function(b) {
        let bulletIndex = this.bullets.map(b => b.id).indexOf(b.id);
        this.bullets.splice(bulletIndex, 1);
      },
      move() {
        this.top += 10
        if (this.alive() && (this.top + this.height) < window.innerHeight) {
          setTimeout(this.move, CONF.MOVE_INTERVAL)
        } else {
          this.$destroy()
        }
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
          height: CONF.HEIGHT + 'px',
          width: CONF.WIDTH + 'px'
        }
      },
      bulletStyle: function(bullet) {
        return {
          top: bullet.top + 'px',
          left: bullet.left + 'px',
          width: CONF.BULLET_WIDTH + 'px',
          height: CONF.BULLET_HEIGHT + 'px'
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
