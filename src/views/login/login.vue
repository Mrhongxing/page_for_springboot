<script setup lang="ts" name="login">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import apiClient from '@/apiClient/apiClient';
    import axios from 'axios';

    const router = useRouter();
    const loginform = ref<HTMLElement | null>(null);
    const registerform = ref<HTMLElement | null>(null);

    interface LoginForm {
        username: string;
        password: string;
    }
    const LoginForm: LoginForm = {
        username: '',
        password: '',
    };

    function showLoginForm() {
        if (loginform.value && registerform.value&& loginform.value.classList.contains('load')) {
            loginform.value.classList.remove('load');

        }
        registerform.value?.classList.add('load');
    }
    function showRegisterForm() {
        if (loginform.value && registerform.value&& registerform.value.classList.contains('load')) {
            registerform.value.classList.remove('load');
        }
        loginform.value?.classList.add('load');
    }

    async function handleSubmit() {
        // Handle login logic here
        try {
            const response = await apiClient.post('http://localhost:8080/apiForChargingStation/user/login', {
                username: LoginForm.username,
                password: LoginForm.password
            });
            if(response.data.token){
                localStorage.setItem('token', 'Bearer ' + response.data.token);
                alert('登录成功！');
                console.log('Login successful:', response.data);
                router.push('/car');
            }else{
                alert("用户名或密码错误");
            }
        } catch (error) {
            alert("服务器连接异常，请稍后重试");
            console.error('Login failed:', error);
        }
    }
    async function handleRegister() {
        // Handle registration logic here
        try {
            const response = await apiClient.post('apiForChargingStation/user/register', LoginForm);
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
        <div class="loginarea">
        <div class="loginimg"><img src="@/images/loginimg/login.png" alt=""></div>
        <div ref="loginform" class="loginform">
            <h1>登录</h1>
            <form @submit.prevent="handleSubmit">
                <div>
                    <label for="username">用户:</label>
                    <input type="text" id="username" placeholder="请输入电话或邮箱" v-model="LoginForm.username" required />
                </div>
                <div>
                    <label for="password">密码:</label>
                    <input type="password" id="password" placeholder="请输入密码" v-model="LoginForm.password" required />
                </div>
                <button type="submit">登录</button>
                <div class="loadbutton" @click="showRegisterForm">没有账号？注册一个</div>
            </form>
        </div>
        <div ref="registerform" class="registerform">
            <h1>注册</h1>
            <form @submit.prevent="handleRegister">
                <div>
                    <label for="reg-username">用户:</label>
                    <input type="text" id="reg-username" placeholder="请输入电话或邮箱"  v-model="LoginForm.username" required />
                </div>
                <div>
                    <label for="reg-password">密码:</label>
                    <input type="password" id="reg-password" placeholder="请输入密码" v-model="LoginForm.password" required />
                </div>
                <button type="submit">注册</button>
                <div class="loadbutton" @click="showLoginForm">已有账号？登录</div>
            </form>
        </div>
        </div>
    </div>
</template>
<style>
    @media (min-width: 768px) {
        .login{
            background-color: #fff;
        }
        .loginarea {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 50vw;
            height: 50vh;
        }
        .loadbutton{
            margin-top: 15px;
            color: #007bff;
            cursor: pointer;
            text-align: center;
        }
        .loginform, .registerform {
            box-sizing: border-box;
            height: 100%;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 0 10px 10px 0;
            width: 50%;
            position: absolute;
            left: 25vw;
            z-index: 11;
            background-color: #fff;
        }
        .registerform {
            z-index: 10;
        }
        .loginimg{
            width: 50%;
            height: 100%;
            position: absolute;
            border-radius: 10px 0 0 10px;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .load{
            animation: spin 2s ease;
            z-index: 9;
            border-radius: 10px;
        }
        @keyframes spin {
        0% { translate: translateX(0); }
        50% { transform: translateX(25vw); }
        100% { transform: translateX(0); }
        }
    }


form div {
    margin-bottom: 15px;
}
label {
    display: block;
    margin-bottom: 5px;
}
input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover {
    background-color: #218838;
}
</style>