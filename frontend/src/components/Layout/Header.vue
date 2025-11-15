<template>
  <router-link to="/dashboard" class="logo-container">
    <!-- <img src="@/assets/img/admin-page-logo.svg" alt="" class="logo" /> -->
    <p class="logo-text">
      <span class="logo-text__first">Blue</span><span class="logo-text__second">Moon</span>
    </p>
  </router-link>

  <div class="el-header__action">
    <a href="#!" class="adjust" @click="$emit('toggleSidebar')">
      <img src="@/assets/img/toggle-sidebar.svg" alt="" />
    </a>
    <div class="header-right">
      <!--      <div class="notification-icon">-->
      <!--        <a href="#!">-->
      <!--          <img src="@/assets/img/Admin/noti.svg" alt="Notifications"/>-->
      <!--        </a>-->
      <!--      </div>-->
      <!--      <div class="language-switcher">-->
      <!--        <img src="@/assets/img/Admin/language.svg" alt="Language" class="language-icon"/>-->
      <!--        <span class="language">English</span>-->
      <!--        <a href="#!">-->
      <!--          <img src="@/assets/img/Admin/dropdown-icon-1.svg" alt="" style="margin-bottom: 2px"/>-->
      <!--        </a>-->
      <!--      </div>-->
      <div class="user__profile">
        <img src="@/assets/img/user-avatar.webp" alt="User Avatar" class="profile-avatar" />
        <div class="user__infor">
          <span class="user--name" :data-full-name="fullName">{{ fullName }}</span>
          <span class="user--role">Admin</span>
        </div>
        <!-- <a href="#!">-->
        <!--          <img src="@/assets/img/Admin/dropdown-icon-2.svg" alt="" class="dropdown-icon"/>-->
        <!--        </a> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { profile } from '@/services/authService'

const fullName = ref('')

onMounted(async () => {
  try {
    const response = await profile()
    fullName.value = response.data.full_name
  } catch (error) {
    console.error('Fail to fetch profile: ', error)
  }
})
</script>
<style lang="scss">
.el-header {
  display: flex;
  align-items: center;

  &__action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.adjust {
  margin-top: 4px;
  margin-left: 30px;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #f5f6fa;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  padding: 10px 14px;
  width: 388px;
  height: 15px;
  margin-top: 3px;
  margin-left: 25px;
  margin-right: 450px;
}

.search-icon {
  margin-right: 10px;
  margin-bottom: 1.5px;
}

.search-form {
  flex: 1;
}

.search-input {
  font-family: 'Nunito Sans', sans-serif;
  border: none;
  outline: none;
  background-color: transparent;
  width: 100%;
  font-size: 16px;
  color: #4a4a4a;
}

.search-input::placeholder {
  font-size: 15px;
}

.search-input:focus {
  border: none;
  outline: none;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 35px;
}

.language {
  font-weight: 600;
}

.language-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-right: -5px;
}

.user {
  &__profile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  &__infor {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-right: 10px;
    width: 120px;
  }

  &--name {
    display: inline-block;
    font-weight: 700;
    max-height: 20px;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &--role {
    font-size: 14px;
    font-weight: 600;
  }
}

.dropdown-icon {
  margin-top: 5px;
}

.logo-container {
  width: 200px;
  height: 70px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 140px;
  margin-top: 2px;
}

// .user--name:hover::after {
//   content: attr(data-full-name);
//   font-size: 15px;
//   position: absolute;
//   background-color: #fff;
//   border: 1px solid #ccc;
//   padding: 2px 10px;
//   border-radius: 5px;
//   color: #000;
//   white-space: nowrap;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
//   z-index: 1000;
//   margin-top: 50px;
//   transform: translateY(-25px);
//   left: 1440px;
// }

.profile-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__first {
    color: #007bff;
  }

  &__second {
    color: #000;
  }
}
</style>
