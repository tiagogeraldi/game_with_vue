<template>
  <div>
    <div :style="style" v-if="life > 0"></div>
    <span
      v-for="bullet in bullets"
      v-bind:id="bullet.id"
      class="bullet"
      :style="{ top: bullet.top + 'px', left: bullet.left + 'px' }"
    >
    </span>
  </div>
</template>

<script>
import { eventBus } from "../main";

export const CONF = Object.freeze({
  WIDTH: 80,
  HEIGHT: 50,
  BULLET_SPEED: 990,
  BULLET_WIDTH: 20,
  BULLET_HEIGHT: 20,
  SHOOT_INTERVAL: 1300,
  MOVE_INTERVAL: 500,
});

export default {
  name: "bastard",
  props: ["left", "status"],
  data: function() {
    return {
      life: 100,
      top: 10,
      width: CONF.WIDTH,
      height: CONF.HEIGHT,
      bullets: [],
    };
  },
  created() {
    var vm = this;
    eventBus.$on("attack", (damage, fireEl) => {
      if (this.life > 0) {
        var collison = eventBus.doElsCollide(this, fireEl);
        if (collison === true) {
          vm.life -= damage;
          fireEl.hit = 1;
        }
      }
    });

    // Fire!!!
    this.shoot();
    this.move();
  },
  methods: {
    shoot() {
      this.bullets.push({
        top: this.top + this.height,
        left: this.left + this.width / 2,
        height: CONF.BULLET_HEIGHT,
        width: CONF.BULLET_WIDTH,
        hit: 0,
        id: this.bulletsCounter,
      });
      var lastBullet = this.bullets[this.bullets.length - 1];
      this.fireBullet(lastBullet);
      if (this.life > 0 && this.status === "playing") {
        setTimeout(this.shoot, CONF.SHOOT_INTERVAL);
      }
    },
    fireBullet(bullet) {
      bullet.top += CONF.BULLET_HEIGHT / 2;
      if (
        this.status === "playing" &&
        this.life > 0 &&
        bullet.top < window.innerHeight &&
        bullet.hit === 0
      ) {
        // global event of an attack.
        // Thank might catch this event.
        if (bullet.top > window.innerHeight - 100) {
          // checks counterAttack colision only the bullet is near of the Tank
          eventBus.counterAttack(10, bullet);
        }

        // move bullet
        setTimeout(() => {
          this.fireBullet(bullet);
        }, 1000 - CONF.BULLET_SPEED);
      } else {
        this.removeBullet(bullet);
      }
    },
    removeBullet: function(b) {
      let bulletIndex = this.bullets.map((b) => b.id).indexOf(b.id);
      this.bullets.splice(bulletIndex, 1);
    },
    move() {
      this.top += 10;
      if (
        this.status === "playing" &&
        this.life > 0 &&
        this.top + this.height < window.innerHeight
      ) {
        // when near of bottom line, check collision with Tank - then gameover
        if (this.top > window.innerHeight - 100) {
          eventBus.tankCollision(this);
        }
        setTimeout(this.move, CONF.MOVE_INTERVAL);
      } else {
        this.$destroy();
      }
    },
  },
  computed: {
    style() {
      var backgroundColor = "black";
      if (this.life <= 30) {
        backgroundColor = "red";
      } else if (this.life <= 70) {
        backgroundColor = "yellow";
      }
      return {
        backgroundColor: backgroundColor,
        left: this.left + "px",
        top: this.top + "px",
        height: CONF.HEIGHT + "px",
        width: CONF.WIDTH + "px",
      };
    },
    bulletStyle(bullet) {
      return {
        top: bullet.top + "px",
        left: bullet.left + "px",
        width: CONF.BULLET_WIDTH + "px",
        height: CONF.BULLET_HEIGHT + "px",
      };
    },
  },
  beforeDestroy() {
    let parent = this.$root.$el.parentNode;
    if (parent) {
      parent.removeChild(this.$root.$el);
    }
  },
};
</script>

<style scoped>
div div {
  position: fixed;
}

.bullet {
  width: 20px;
  height: 20px;
  background-color: red;
  position: fixed;
}
</style>
