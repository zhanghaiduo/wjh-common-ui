<template>
  <div style="padding: 0 0px;" @click="toggleClick">
    <!-- <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path id="形状结合" d="M10.08,1.2490009e-15 L11.2,1.06666667 L6.72,5.33333333 L6.317,5.716 L5.6,6.4 L4.48,5.33333333 L0,1.06666667 L1.12,-4.6629367e-15 L5.599,4.266 L10.08,1.2490009e-15 Z" />
    </svg> -->
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      :class="{'is-active':isActive}"
      class="hamburger"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <!-- Generator: Sketch 57.1 (83088) - https://sketch.com -->
      <g id="编组-2备份-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="编组-2" transform="translate(6.000000, 9.000000)" fill="#909399">
          <path id="形状结合" d="M10.08,1.2490009e-15 L11.2,1.06666667 L6.72,5.33333333 L6.317,5.716 L5.6,6.4 L4.48,5.33333333 L0,1.06666667 L1.12,-4.6629367e-15 L5.599,4.266 L10.08,1.2490009e-15 Z" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 9px;
  transform: rotate(270deg);
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(90deg);
}
</style>
