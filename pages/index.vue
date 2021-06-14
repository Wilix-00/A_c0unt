<template>
  <div>
    <main>
      <v-btn
        color="primary"
        height="550"
        :loading="loadingMonth"
        :disabled="isMinMonth"
        @click="handleChangeMonth(-1)"
      >
        PREV_MONTH
        <br>
        <br>
        &lt;
      </v-btn>

      <chart
        v-if="!loadingMonth"
        :sections="sections"
        :month="monthName"
        :year="year"
        :expenses="totalExpenses"
        :incomes="totalIncomes"
      />

      <v-progress-circular
        v-if="loadingMonth"
        class="mt-8"
        :size="500"
        :width="100"
        color="grey"
        indeterminate
      />

      <v-btn
        color="primary"
        height="550"
        :loading="loadingMonth"
        :disabled="isMaxMonth"
        @click="handleChangeMonth(1)"
      >
        NEXT_MONTH
        <br>
        <br>
        &gt;
      </v-btn>
    </main>

    <v-row>
      <v-col cols="6">
        <prices-table
          title="Expenses"
          with-colors
          :items="expenses"
          :loading="loadingExpenses"
          @delete="handleDeleteExpense($event)"
          @add="handleAddExpense($event)"
        />
      </v-col>

      <v-col cols="6">
        <prices-table
          title="Incomes"
          :items="incomes"
          :loading="loadingIncomes"
          @delete="handleDeleteIncome($event)"
          @add="handleAddIncome($event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    const now = new Date()

    return {
      loadingExpenses: false,
      loadingIncomes: false,
      loadingMonth: false,

      year: now.getFullYear(),
      month: now.getMonth(),

      expenses: [],

      incomes: []
    }
  },

  computed: {
    monthName () {
      return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ][this.month]
    },

    totalExpenses () {
      return this.expenses.reduce((prev, e) => {
        return prev + e.value
      }, 0)
    },

    totalIncomes () {
      return this.incomes.reduce((prev, e) => {
        return prev + e.value
      }, 0)
    },

    isMinMonth () {
      return ((this.month === 0) && (this.year === 2020))
    },

    isMaxMonth () {
      const now = new Date()
      return ((this.month === now.getMonth()) && (this.year === now.getFullYear()))
    },

    sections () {
      return this.expenses.map((e) => {
        return {
          label: e.name,
          value: e.value / this.totalExpenses,
          color: this.$consts.colors[e.color]
        }
      })
    },

    monthDocument () {
      return this.$fire.firestore
        .collection('users')
        .doc(this.$store.state.auth.user)
        .collection('months')
        .doc(`${this.year}${this.month}`)
    }
  },

  created () {
    this.loadData()
  },

  methods: {
    async loadData () {
      this.loadingMonth = true
      try {
        const expensesSnapshot = await this.monthDocument.collection('expenses').get()
        const expenses = expensesSnapshot.docs.map(e => ({
          ...e.data(),
          id: e.id
        }))
        this.expenses = expenses

        const incomesSnapshot = await this.monthDocument.collection('incomes').get()
        const incomes = incomesSnapshot.docs.map(e => ({
          ...e.data(),
          id: e.id
        }))
        this.incomes = incomes
      } finally {
        this.expenses.sort(this.compareColor)
        this.loadingMonth = false
      }
    },

    handleChangeMonth (diff) {
      const nextMonth = this.month + diff
      if (nextMonth < 0) {
        this.month = 11
        this.year -= 1
      } else if (nextMonth > 11) {
        this.month = 0
        this.year += 1
      } else {
        this.month = nextMonth
      }

      this.loadData()
    },

    async handleDeleteIncome (item) {
      await this.monthDocument.collection('incomes').doc(item.id).delete()
      this.incomes = this.incomes.filter(e => e.id !== item.id)
    },

    async handleDeleteExpense (item) {
      await this.monthDocument.collection('expenses').doc(item.id).delete()
      this.expenses = this.expenses.filter(e => e.id !== item.id)
    },

    async handleAddIncome (newItem) {
      this.loadingIncomes = true
      try {
        const data = {
          name: newItem.name,
          value: Number(newItem.value)
        }

        const res = await this.monthDocument.collection('incomes').add(data)

        data.id = res.id
        this.incomes.push(data)
      } finally {
        this.loadingIncomes = false
        newItem.name = ''
        newItem.value = ''
      }
    },

    async handleAddExpense (newItem) {
      this.loadingExpenses = true
      try {
        const data = {
          color: newItem.color,
          name: newItem.name,
          value: Number(newItem.value)
        }

        const res = await this.monthDocument.collection('expenses').add(data)

        data.id = res.id
        this.expenses.push(data)
        this.expenses.sort(this.compareColor)
      } finally {
        this.loadingExpenses = false
        newItem.name = ''
        newItem.value = ''
      }
    },

    compareColor (a, b) {
      if (a.color < b.color) {
        return -1
      }
      if (a.color > b.color) {
        return 1
      }
      return 0
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  justify-content: space-between;
}
</style>
