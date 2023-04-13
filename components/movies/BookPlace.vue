<template>
  <div class="book-section-outer-wrap">
    <div class="book-section-inner-wrap">
      <div class="screen-img-wrap">
        <div class="screen-img">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 806 21" fill="#061420">
            <path d="M3.2,20l-2,0.2l-0.3-4l2-0.2C136.2,5.3,269.6,0,403,0s266.8,5.3,400.2,16l2,0.2l-0.3,4l-2-0.2 C669.5,9.3,536.3,4,403,4S136.4,9.3,3.2,20z"></path>
          </svg>
        </div>
        <div class="screen-img-ttl text-center">{{$t('screen')}}</div>
      </div>
      <div class="seats-wrap mt-4">
        <div class="seats-row" v-for="(rowItem, rowIndex) in places" :key="rowIndex">
          <div
            class="seat-item-col"
            v-for="(colItem, colIndex) in rowItem[1]"
            :key="colIndex"
          >
            <v-tooltip top color="#000000" nudge-bottom="6">
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="seat-item"
                  :class="{'disabled': !colItem.is_free, 'active': value && value.row === rowItem[0].row && value.seat === colItem.seat}"
                  v-bind="attrs"
                  v-on="on"
                  @click="bookPlace(rowItem[0].row, colItem.seat, colItem.is_free)"
                >
                  <div class="seat-txt">
                    {{colItem.seat}}
                  </div>
                </div>
              </template>
              <span v-if="colItem.is_free">{{$t('row')}} {{rowItem[0].row}}, {{$t('seat')}} {{colItem.seat}}</span>
              <span v-else>{{$t('seatTaken')}}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookPlace",
  props: {
    value: {
      type: Object,
      default: null
    },
    places: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      place: null
    }
  },
  methods: {
    bookPlace(row, seat, isFree) {
      if(!isFree) {
        return;
      }
      const bookValue = this.value?.row === row && this.value?.seat === seat ? null : {row, seat};
      this.$emit('input', bookValue);
    }
  }
}
</script>

<style lang="scss" scoped>
.book-section-outer-wrap {
  overflow-x: auto;
}
.book-section-inner-wrap {
  min-width: 1200px;
}
.screen-img {
  svg {
    width: 100%;
  }
}
.screen-img-ttl {
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  text-transform: uppercase;
}
.seats-row {
  display: flex;
}
.seat-item-col {
  padding: 2px;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  width: 100%;
}
.seat-item {
  position: relative;
  font-size: 12px;
  border: 1px solid #1976d2;
  border-radius: 4px;
  cursor: pointer;
  padding-bottom: 110%;
  transition: all 250ms ease;
  &.active {
    background-color: #1976d2;
    color: #fff;
  }
  &.disabled {
    border: 1px solid #ccc;
    background-color: #ccc;
    cursor: default;
  }
  @media screen and (max-width: 1300px)  {
    font-size: 11px;
  }
  &:not(.disabled):hover {
    opacity: 0.7;
  }
}
.seat-txt {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
