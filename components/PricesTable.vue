<template>
  <v-card class="mt-4">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-data-table
        hide-default-footer
        disable-filtering
        disable-sort
        :items="items"
        :items-per-page="1000"
        :headers="headers"
      >
        <template #item.color="{ item }">
          <div
            :style="{ backgroundColor: $consts.colors[item.color] }"
            class="Item--color"
          />
        </template>

        <template #item.delete="{ item }">
          <v-btn icon color="error" @click="$emit('delete', item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-row>
        <v-col v-if="withColors" align-self="center">
          <v-btn v-ripple="false" width="100%" class="white--text" :style="{'background-color': $consts.colors[newItem.color]}" @click="switchColor()">
            Color
          </v-btn>
        </v-col>

        <v-col align-self="center">
          <v-text-field
            v-model="newItem.name"
            label="Name"
            dense
            hide-details
            outlined
          />
        </v-col>

        <v-col align-self="center">
          <v-text-field
            v-model="newItem.value"
            label="Value"
            type="number"
            hide-details
            dense
            outlined
          />
        </v-col>

        <v-col align-self="center">
          <v-btn
            color="primary"
            class="AddButton"
            :loading="loading"
            @click="$emit('add', newItem)"
          >
            +
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },

    items: {
      type: Array,
      required: true
    },

    withColors: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      deafult: false
    }
  },

  data () {
    return {
      newItem: {
        color: 0,
        name: '',
        value: ''
      }
    }
  },

  computed: {
    headers () {
      const common = [
        { text: 'Name', value: 'name' },
        { text: 'Value', value: 'value' },
        { text: 'Delete', value: 'delete', width: 1 }
      ]

      if (this.withColors) {
        return [
          { text: 'Color', value: 'color', width: 1 },
          ...common
        ]
      }

      return common
    }
  },

  methods: {
    switchColor () {
      this.newItem.color++
      if (this.newItem.color === this.$consts.colors.length) {
        this.newItem.color = 0
      }
    }
  }
}
</script>

<style scoped>
.Item--color {
  border-radius: 999px;
  width: 20px;
  height: 20px;
}

.AddButton {
  margin-top: 4px;
  width: 100%;
}
</style>
