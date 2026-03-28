<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/UserInfo'
import apiClient from '@/apiClient/apiClient'
import '@/style/index.css'

let userName = useUserInfoStore().userInfo.name
let userPhone = useUserInfoStore().userInfo.phone
let userEmail = useUserInfoStore().userInfo.email
const editName = ref(false)
const editDesc = ref(false)
const editPhone = ref(false)
const editEmail = ref(false)
const router = useRouter()

if (!localStorage.getItem('token')) {
    const router = useRouter()
    router.push('/login')
}
function exit_login() {
    localStorage.removeItem('token')
    useUserInfoStore().clearUserInfo()
    
    router.push('/login')
}
async function saveName() {
    apiClient.post('apiForChargingStation/user/updateUserInfo', {
        id: useUserInfoStore().userInfo.id,
        name: userName,
        phone: userPhone,
        email: userEmail
    }).then((response) => {
        if (response.data) {
            alert("修改成功");
            useUserInfoStore().updateUserInfo(userName, userPhone, userEmail);
        } else {
            alert("修改失败");
        }
    }).catch((error) => {
        alert("服务器连接异常，请稍后重试");
    }).finally(() => {
        editName.value = false
    })    
}
async function savePhone() {
    apiClient.post('apiForChargingStation/user/updateUserInfo', {
        id: useUserInfoStore().userInfo.id,
        name: userName,
        phone: userPhone,
        email: userEmail
    }).then((response) => {
        if (response.data) {
            alert("修改成功");
            useUserInfoStore().updateUserInfo(userName, userPhone, userEmail);
        } else {
            alert("修改失败");
        }
    }).catch((error) => {
        alert("服务器连接异常，请稍后重试");
    })
    editPhone.value = false
}
async function saveEmail() {
    apiClient.post('apiForChargingStation/user/updateUserInfo', {
        id: useUserInfoStore().userInfo.id,
        name: userName,
        phone: userPhone,
        email: userEmail
    }).then((response) => {
        if (response.data) {
            alert("修改成功");
            useUserInfoStore().updateUserInfo(userName, userPhone, userEmail);
        } else {
            alert("修改失败");
        }
    }).catch((error) => {
        alert("服务器连接异常，请稍后重试");
    })
    editEmail.value = false
}
</script>

<template>
    <div class="user-container">
        <div class="profile-header">
            <img class="avatar" src="https://i.pravatar.cc/120?img=3" alt="头像" />
            <div class="header-info">
                <div class="header-row">
                    <span class="label">昵称</span>
                    <template v-if="!editName">
                        <span class="value">{{ userName }}</span>
                        <button class="edit-btn" @click="editName = true">编辑</button>
                    </template>
                    <template v-else>
                        <input class="input" v-model="userName" />
                        <button class="save-btn" @click="saveName">保存</button>
                    </template>
                </div>
            </div>
        </div>
        <div class="select">
            <div class="header-row">
                <span class="label">电话</span>
                <template v-if="!editPhone">
                    <span class="value">{{ userPhone }}</span>
                    <button class="edit-btn" @click="editPhone = true">编辑</button>
                </template>
                <template v-else>
                    <input class="input" v-model="userPhone" />
                    <button class="save-btn" @click="savePhone">保存</button>
                </template>
            </div>
            <div class="header-row">
                <span class="label">邮箱</span>
                <template v-if="!editEmail">
                    <span class="value">{{ userEmail }}</span>
                    <button class="edit-btn" @click="editEmail = true">编辑</button>
                </template>
                <template v-else>
                    <input class="input" v-model="userEmail" />
                    <button class="save-btn" @click="saveEmail">保存</button>
                </template>
            </div>
            <!-- <div class="header-row">
                <span class="label">昵称</span>
                <template v-if="!editName">
                    <span class="value">{{ userName }}</span>
                    <button class="edit-btn" @click="editName = true">编辑</button>
                </template>
                <template v-else>
                    <input class="input" v-model="userName" />
                    <button class="save-btn" @click="saveName">保存</button>
                </template>
            </div> -->
        </div>
        <div class="select">
            <div class="exit-btn" @click="exit_login">退出</div>
        </div>
    </div>
</template>

<style scoped>
img.avatar {
    border-radius: 50%;
}

.user-container {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    color: var(--text-main);
    background:
        var(--page-background);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    gap: 24px;
}

.profile-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f3f3f3;
    border-radius: 22px;
    margin: 20px;
    box-sizing: border-box;
    width: calc(100% - 40px);
    background: var(--title-background);
    box-shadow:
        var(--box-shadow);
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
    max-width: 800px;
}

.header-info {
    display: flex;
    margin-left: 20px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .header-row {
        font-size: larger;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: left;
        margin-bottom: 10px;
        .label {
            font-weight: bold;
            margin-right: 10px;
        }
        input{
            max-width: calc(100vw - 300px);
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-bottom: 2px solid var(--text-main);
            background: transparent;
            color: var(--text-main);
            font-size: inherit;
            transition: all 0.3s ease;
            outline: none;
            &:focus {
                border-bottom-color: #00d4ff;
                box-shadow: var(--box-shadow);
                transform: translateY(-2px);
            }
            &:hover {
                border-bottom-color: var(--button-background);
            }
        }
    }
}

.select {
    margin: 20px;
    padding: 20px;
    color: var(--text-main);
    background: var(--first-background);
    box-shadow:
        var(--box-shadow);
    border-radius: 22px;
    box-sizing: border-box;
    width: calc(100% - 40px);
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
    max-width: 800px;
    .header-row {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .label {
            font-weight: bold;
            margin-right: 10px;
        }
        input{
            max-width: calc(100vw - 200px);
            min-width: calc(200px);
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-bottom: 2px solid var(--text-main);
            background: transparent;
            color: var(--text-main);
            font-size: inherit;
            transition: all 0.3s ease;
            outline: none;
            &:focus {
                border-bottom-color: #00d4ff;
                box-shadow: var(--box-shadow);
                transform: translateY(-2px);
            }
            &:hover {
                border-bottom-color: var(--button-background);
            }
        }
    }
}

.edit-btn,
.save-btn {
    margin-left: 10px;
    background-color: #f4f4f4;
    color: var(--text-soft);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background: var(--button-background);
}

.edit-btn:hover,
.save-btn:hover {
    background-color: #e0e0e0;
}

.input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
}
.select:last-child {
    
    .exit-btn {
        
        color: red;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
        display: flex;
    align-items: center;
    justify-content: center;

    }
}
</style>