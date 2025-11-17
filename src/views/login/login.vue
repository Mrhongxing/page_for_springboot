<script setup lang="ts" name="login">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import apiClient from '@/apiClient/apiClient';

    const router = useRouter();

    interface LoginForm {
        username: string;
        password: string;
        email?: string;
    }
    const LoginForm: LoginForm = {
        username: '',
        password: '',
        email: ''
    };

    async function handleSubmit() {
        // Handle login logic here
        try {
            const response = await apiClient.post('/api/api/auth/login', {
                username: LoginForm.username,
                password: LoginForm.password
            });
            alert('Login successful!');
            console.log('Login successful:', response.data);
            router.push('/3D');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
    async function handleRegister() {
        // Handle registration logic here
        try {
            const response = await apiClient.post('/api/api/auth/register', LoginForm);
            const responseData = response.data;
            if(responseData.isSuccess){
                alert('Registration successful!');
            }else{
                alert('Registration failed: ' + responseData.message);
            }
            console.log(typeof responseData);
            console.log(responseData.isSuccess);
            console.log(JSON.stringify(responseData));
            console.log(JSON.parse(JSON.stringify(responseData)).isSuccess);
            console.log(responseData);
        } catch (error) {
            console.error('Registration failed:', error);
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
        <h1>Register Page</h1>
        <form @submit.prevent="handleRegister">
            <div>
                <label for="reg-username">Username:</label>
                <input type="text" id="reg-username" v-model="LoginForm.username" required />
            </div>
            <div>
                <label for="reg-password">Password:</label>
                <input type="password" id="reg-password" v-model="LoginForm.password" required />
            </div>
            <div>
                <label for="reg-email">Email:</label>
                <input type="email" id="reg-email" v-model="LoginForm.email" required />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
</template>