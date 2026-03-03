<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/UserInfo'

let userName = useUserInfoStore().userInfo.name
let userPhone = useUserInfoStore().userInfo.phone
let userEmail = useUserInfoStore().userInfo.email
const editName = ref(false)
const editDesc = ref(false)
const editPhone = ref(false)
const editEmail = ref(false)

if (!localStorage.getItem('token')) {
    const router = useRouter()
    router.push('/login')
}

function saveName() {
    editName.value = false
}
function saveDesc() {
    editDesc.value = false
}
function savePhone() {
    editPhone.value = false
}
function saveEmail() {
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
</template>

<style scoped>
img.avatar {
    border-radius: 50%;
}

.user-container {
    background-color: #f2f2f2;
    min-height: 100vh;
}

.profile-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f3f3f3;
    border-radius: 8px;
    margin: 20px;
    box-sizing: border-box;
    width: calc(100% - 40px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
        margin-bottom: 10px;
        .label {
            font-weight: bold;
            margin-right: 10px;
        }
    }
}
.select {
    margin: 20px;
    padding: 20px;
    background-color: #f3f3f3;
    border-radius: 8px;
    box-sizing: border-box;
    width: calc(100% - 40px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    .header-row {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .label {
            font-weight: bold;
            margin-right: 10px;
        }
    }
}
.edit-btn, .save-btn {
    margin-left: 10px;
    background-color: #f4f4f4;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.edit-btn:hover, .save-btn:hover {
    background-color: #e0e0e0;
}
.input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
}
</style>