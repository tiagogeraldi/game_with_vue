<template>
  <div>
    <div id="tank" :style="tankStyle" v-if="life > 0"></div>
    <span
      v-for="bullet in bullets"
      v-bind:id="bullet.id"
      class="bullet"
      :style="bulletStyle(bullet)"
      :visible="!bullet.hit"
    >
    </span>
  </div>
</template>

<script>
import { eventBus } from "../main";
import { mapGetters, mapMutations } from "vuex";

const TANK_MOVEMENT = 10;
const TANK_WIDTH = 50;
const TANK_HEIGHT = 50;
const BULLET_SPEED = 999;
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 10;

export default {
  name: "tank",
  data: function() {
    return {
      width: TANK_WIDTH,
      height: TANK_HEIGHT,
      top: window.innerHeight - (TANK_HEIGHT + 10),
      left: window.GAME_WIDTH / 2 + window.GAME_OFFSET - TANK_WIDTH / 2,
      bullets: [],
    };
  },
  methods: {
    ...mapMutations(["damage", "gameover"]),
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
        left: this.left + TANK_WIDTH / 2,
        height: BULLET_HEIGHT,
        width: BULLET_WIDTH,
        hit: 0,
        id: this.bulletsCounter,
      });
      var lastBullet = this.bullets[this.bullets.length - 1];
      this.fireBullet(lastBullet);
    },
    fireBullet: function(bullet) {
      bullet.top -= BULLET_HEIGHT;
      if (this.isPlaying && bullet.top > 0 && bullet.hit === 0) {
        // global event of an attack.
        // All the enemies will catch this event to check a collison
        eventBus.attack(20, bullet);

        // move bullet
        setTimeout(() => {
          this.fireBullet(bullet);
        }, 1000 - BULLET_SPEED);
      } else {
        this.removeBullet(bullet);
      }
    },
    removeBullet: function(b) {
      let bulletIndex = this.bullets.map((b) => b.id).indexOf(b.id);
      this.bullets.splice(bulletIndex, 1);
    },
    bulletStyle(bullet) {
      let css = {
        top: bullet.top + "px",
        left: bullet.left + "px",
        width: BULLET_WIDTH + "px",
        height: BULLET_HEIGHT + "px",
      };
      if (bullet.hit) {
        css.display = "none";
      }
      return css;
    },
  },
  computed: {
    ...mapGetters(["life", "status", "isPlaying"]),
    tankStyle() {
      return {
        left: this.left + "px",
        top: this.top + "px",
        height: TANK_HEIGHT + "px",
        width: TANK_WIDTH + "px",
      };
    },
  },
  created() {
    // can't create this event with Vue, this is an event for the whole page.
    window.addEventListener("keydown", (event) => {
      if (!this.isPlaying) {
        return;
      }
      if (event.code == "ArrowRight") {
        this.moveRight();
      } else if (event.code == "ArrowLeft") {
        this.moveLeft();
      } else if (event.code == "KeyA") {
        this.shoot();
      }
    });

    eventBus.$on("counterAttack", (damage, fireEl) => {
      if (this.life > 0 && this.isPlaying) {
        var collison = eventBus.doElsCollide(this, fireEl);
        if (collison === true) {
          fireEl.hit = 1;
          this.damage(damage);


          var el1 = this
          var el2 = fireEl
          el1.offsetTop = el1.top;
          el1.offsetLeft = el1.left;
          el1.offsetBottom = el1.offsetTop + el1.height;
          el1.offsetRight = el1.offsetLeft + el1.width;

          el2.offsetTop = el2.top + el2.height;
          el2.offsetLeft = el2.left + el2.width;
          el2.offsetBottom = el2.offsetTop + el2.height;
          el2.offsetRight = el2.offsetLeft + el2.width;

          console.log(el1.offsetBottom < el2.offsetTop)
          console.log(el1.offsetTop > el2.offsetBottom)
          console.log(el1.offsetRight < el2.offsetLeft)
          console.log(el1.offsetLeft > el2.offsetRight)
        }
      }
    });

    eventBus.$on("tankCollision", (bastard) => {
      if (eventBus.doElsCollide(this, bastard) === true) {
        this.gameover();
      }
    });
  },
};
</script>

<style scoped>
#tank {
  background-color: green;
  position: fixed;
}

.bullet {
  background-color: black;
  position: fixed;
}
</style>
