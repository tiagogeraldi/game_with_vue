<template>
  <div id="status">
    You!
    <div id="lifebar">
      <div id="life" :style="lifebar"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["life"],
  computed: {
    lifebar() {
      let color = "green";
      if (this.life < 75 && this.life >= 50) {
        color = "yellow";
      } else if (this.life < 50 && this.life >= 25) {
        color = "orange";
      } else if (this.life < 25) {
        color = "red";
      }
      return {
        backgroundColor: color,
        width: this.life + "%",
        height: "100%",
      };
    },
  },
};
</script>

<style scoped>
#status {
  border: 1px solid black;
  padding: 5px;
  width: 150px;
  height: 50px;
  position: fixed;
  right: 10px;
  bottom: 10px;
}
#lifebar {
  width: 100%;
  width: 100%;
  height: 30px;
}
</style>
