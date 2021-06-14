<template>
  <div>
    <vc-donut
      class="mt-8"
      :total="1.0001"
      unit="px"
      :size="500"
      :thickness="40"
      :sections="sections"
    >
      <div>
        <div>
          {{ displayMonth }}
        </div>
        <div :style="{ color: expensesColor() }">
          {{ expenses.toFixed(2) }}
        </div>
      </div>
    </vc-donut>
  </div>
</template>

<script>
export default {
  props: {
    sections: {
      type: Array,
      required: true
    },

    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    expenses: {
      type: Number,
      required: true
    },

    incomes: {
      type: Number,
      required: true
    }
  },

  computed: {
    displayMonth () {
      let monthDisplay = this.month
      if (this.year !== new Date().getFullYear()) {
        monthDisplay = `${monthDisplay} ${this.year}`
      }

      return monthDisplay
    }
  },

  methods: {
    expensesColor () {
      if (this.expenses >= this.incomes) {
        return 'crimson'
      } else if (this.expenses < this.incomes / 2) {
        return 'green'
      }
      return 'tomato'
    }
  }
}
</script>

<style scoped>
</style>
