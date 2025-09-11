<template>
  <div style="width: 350px; margin: 50px auto">
    <h2 style="margin-bottom: 20px">Create an Account</h2>
    <form @submit.prevent="submitForm">
      <div style="margin-bottom: 20px">
        <label>Email:</label><br />
        <input type="text" v-model="email" style="width: 100%; padding: 5px" />
        <p v-if="emailError" style="color: red; margin: 5px 0 0">
          {{ emailError }}
        </p>
      </div>

      <div style="margin-bottom: 20px">
        <label>Password:</label><br />
        <input type="password" v-model="password" style="width: 100%; padding: 5px" />
        <p v-if="passwordError" style="color: red; margin: 5px 0 0">
          {{ passwordError }}
        </p>
      </div>

      <button type="submit" style="margin-top: 20px; padding: 5px 15px">Register</button>
    </form>

    <div style="margin-top: 50px" v-if="users.length > 0">
      <h3>Registered Users</h3>
      <DataTable :value="users">
        <Column field="email" header="Email"></Column>
        <Column field="password" header="Password"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const users = ref([])

const auth = getAuth()
const router = useRouter()

const submitForm = () => {
  if (email.value === '') {
    emailError.value = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = ''
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

  if (emailError.value === '' && passwordError.value === '') {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        alert('Register successful!')
        users.value.push({
          email: email.value,
          password: password.value,
        })
        email.value = ''
        password.value = ''
        router.push('/FireLogin')
      })
      .catch((error) => {
        alert('Register failed: ' + error.code)
      })
  } else {
    alert('Register failed, please fill in the correct information.')
  }
}
</script>
