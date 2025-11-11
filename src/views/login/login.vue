<script setup lang="ts" name="login">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import apiClient from '@/apiClient/apiClient';

    const router = useRouter();

    interface LoginForm {
        username: string;
        password: string;
    }
    const LoginForm: LoginForm = {
        username: '',
        password: ''
    };

    async function handleSubmit() {
        // Handle login logic here
        try {
            const response = await apiClient.post('/api/api/auth/login', LoginForm);
            alert('Login successful!');
            console.log('Login successful:', response.data);
            router.push('/3D');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
</script>
<template>
    <div class="login">
        <h1>Login Page</h1>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="LoginForm.username" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="LoginForm.password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>