<template>
  <div style="width: 350px; margin: 50px auto">
    <h2 style="margin-bottom: 20px">Login</h2>
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

      <div style="margin-bottom: 20px">
        <label>Please select your role:</label><br />
        <label style="display: block; margin-top: 5px">
          <input type="radio" value="teen" v-model="selectedRole" />
          I'm a young person
        </label>
        <label style="display: block; margin-top: 5px">
          <input type="radio" value="staff" v-model="selectedRole" />
          I'm supporting a young person
        </label>
        <p v-if="roleError" style="color: red; margin: 5px 0 0">{{ roleError }}</p>
      </div>

      <button type="submit" style="margin-top: 20px; padding: 5px 15px">Login</button>
    </form>

    <div style="margin-top: 50px" v-if="users.length > 0">
      <h3>Signed in Users</h3>
      <DataTable :value="users">
        <Column field="email" header="Email"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="role" header="Role"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import isAuthenticated from '@/authenticate'
const email = ref('')
const password = ref('')
const selectedRole = ref('')

const emailError = ref('')
const passwordError = ref('')
const roleError = ref('')

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
  } else {
    passwordError.value = ''
  }

  if (selectedRole.value === '') {
    roleError.value = 'Please select a role.'
  } else {
    roleError.value = ''
  }

  if (emailError.value === '' && passwordError.value === '' && roleError.value === '') {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        alert('Login successful!')
        isAuthenticated.value = true
        users.value.push({
          email: email.value,
          password: password.value,
          role: selectedRole.value,
        })
        email.value = ''
        password.value = ''
        const redirectPath = selectedRole.value === 'teen' ? '/TeenPage' : '/StaffPage'
        router.push(redirectPath)
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alert('This account does not exist. Please register first.')
        } else if (error.code === 'auth/wrong-password') {
          alert('Incorrect password. Please try again.')
        } else {
          alert('Login failed: ' + error.code)
        }
      })
  } else {
    alert('Login failed, please fill in the correct information.')
  }
}
</script>
