<template>
  <div style="width: 350px; margin: 50px auto">
    <h2 style="margin-bottom: 20px">Create an Account</h2>
    <form @submit.prevent="submitForm">
      <!-- Email -->
      <div style="margin-bottom: 20px">
        <label>Email:</label><br />
        <input type="text" v-model="email" style="width: 100%; padding: 5px" />
        <p v-if="emailError" style="color: red; margin: 5px 0 0">{{ emailError }}</p>
      </div>

      <!-- Password -->
      <div style="margin-bottom: 20px">
        <label>Password:</label><br />
        <input type="password" v-model="password" style="width: 100%; padding: 5px" />
        <p v-if="passwordError" style="color: red; margin: 5px 0 0">{{ passwordError }}</p>
      </div>

      <!-- Verification Code + Button -->
      <div style="margin-bottom: 20px">
        <label>Verification Code:</label><br />
        <div style="display: flex; align-items: center; gap: 10px">
          <input
            type="text"
            v-model="codeInput"
            placeholder="Enter code"
            style="flex: 1; padding: 5px"
          />
          <button
            type="button"
            @click="sendCode"
            :disabled="sending"
            style="padding: 5px 10px; white-space: nowrap"
          >
            {{ sending ? 'Sending...' : 'Send Code' }}
          </button>
        </div>
        <p v-if="codeError" style="color: red; margin: 5px 0 0">{{ codeError }}</p>
      </div>

      <button type="submit" style="margin-top: 20px; padding: 5px 15px">Register</button>
    </form>

    <!-- Table -->
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
const codeInput = ref('')
const verificationCode = ref('')
const sending = ref(false)

const emailError = ref('')
const passwordError = ref('')
const codeError = ref('')

const users = ref([])
const auth = getAuth()
const router = useRouter()

// ✅ 改成调用后端接口发送邮件
const sendCode = async () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    alert('Please enter a valid email before sending code.')
    return
  }

  verificationCode.value = Math.floor(100000 + Math.random() * 900000).toString()
  sending.value = true

  try {
    const res = await fetch('http://localhost:3000/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: verificationCode.value }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message)
    alert('Verification code sent to ' + email.value)
  } catch (error) {
    console.error(error)
    alert('Failed to send verification email.')
  } finally {
    sending.value = false
  }
}

// ✅ 表单提交逻辑不变
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

  if (codeInput.value === '') {
    codeError.value = 'Please enter the verification code.'
  } else if (!/^\d{6}$/.test(codeInput.value)) {
    codeError.value = 'Verification code must be 6 digits.'
  } else if (codeInput.value !== verificationCode.value) {
    codeError.value = 'Incorrect verification code.'
  } else {
    codeError.value = ''
  }

  if (emailError.value === '' && passwordError.value === '' && codeError.value === '') {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        alert('Register successful!')
        users.value.push({ email: email.value, password: password.value })
        email.value = ''
        password.value = ''
        codeInput.value = ''
        verificationCode.value = ''
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
