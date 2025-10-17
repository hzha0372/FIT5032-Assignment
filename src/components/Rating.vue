<template>
  <div style="width: 350px; margin: 50px auto; text-align: center">
    <h2 style="margin-bottom: 20px">Rate this page</h2>

    <div style="font-size: 2rem; margin-bottom: 20px">
      <span
        v-for="n in 5"
        :key="n"
        @click="setRating(n)"
        :style="{
          cursor: 'pointer',
          color: n <= userRating ? 'gold' : '#ddd',
          marginRight: '5px',
        }"
      >
        ★
      </span>
    </div>

    <button @click="submitRating" style="padding: 5px 15px; margin-bottom: 20px">
      Submit Rating
    </button>

    <div v-if="averageRating !== null" style="font-weight: bold">
      Average Rating: {{ averageRating.toFixed(1) }} / 5
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userRating = ref(0)
const ratings = ref([])
const averageRating = ref(null)

onMounted(() => {
  const storedRatings = localStorage.getItem('ratings')
  if (storedRatings) {
    ratings.value = JSON.parse(storedRatings)
    calculateAverage()
  }
})

const setRating = (value) => {
  userRating.value = value
}

const submitRating = () => {
  if (userRating.value === 0) {
    alert('Please select a rating before submitting.')
    return
  }

  ratings.value.push(userRating.value)
  localStorage.setItem('ratings', JSON.stringify(ratings.value))
  calculateAverage()
  alert('Thanks for your feedback!')
}

const calculateAverage = () => {
  if (ratings.value.length > 0) {
    const sum = ratings.value.reduce((a, b) => a + b, 0)
    averageRating.value = sum / ratings.value.length
  } else {
    averageRating.value = null
  }
}
</script>
