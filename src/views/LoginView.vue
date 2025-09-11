<template>
  <div style="width: 350px; margin: 50px auto">
    <h2 style="margin-bottom: 20px">Login</h2>
    <form @submit.prevent="submitForm">
      <div style="margin-bottom: 20px">
        <label>Username:</label><br />
        <input type="text" v-model="username" style="width: 100%; padding: 5px" />
        <p v-if="usernameError" style="color: red; margin: 5px 0 0">
          {{ usernameError }}
        </p>
      </div>

      <div style="margin-bottom: 20px">
        <label>Password:</label><br />
        <input type="text" v-model="password" style="width: 100%; padding: 5px" />
        <p v-if="passwordError" style="color: red; margin: 5px 0 0">
          {{ passwordError }}
        </p>
      </div>

      <button type="submit" style="margin-top: 20px; padding: 5px 15px">Login</button>
    </form>

    <div style="margin-top: 50px" v-if="users.length > 0">
      <h3>Users Information</h3>
      <DataTable :value="users">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')
const users = ref([])

const submitForm = () => {
  if (username.value === '') {
    usernameError.value = 'Please enter your username.'
  } else if (username.value.length < 6) {
    usernameError.value = 'Username must be at least 6 characters.'
  } else {
    usernameError.value = ''
  }

  if (password.value === '') {
    passwordError.value = 'Please enter your password.'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.'
  } else if (!/[A-Z]/.test(password.value)) {
    passwordError.value = 'Password must contain at least one uppercase letter.'
  } else if (!/[a-z]/.test(password.value)) {
    passwordError.value = 'Password must contain at least one lowercase letter.'
  } else {
    passwordError.value = ''
  }

  if (usernameError.value === '' && passwordError.value === '') {
    alert('Login successful.')
    users.value.push({
      username: username.value,
      password: password.value,
    })
    username.value = ''
    password.value = ''
  } else {
    alert('Login failed, please fill in the correct information.')
  }
}
</script>
