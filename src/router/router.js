import { createRouter,createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';



const routes = [
    {path:'/',component:HomeView,name:'HomeView'},
    {path:'/login',component:LoginView,name:'LoginView'},
    {path:'/register',component:RegisterView,name:'RegisterView'}
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router