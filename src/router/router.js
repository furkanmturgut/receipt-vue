import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import LoginView from "../views/auth/LoginView.vue";
import AddReceipt from "../views/AddReceipt.vue";
import ReceiptDetailView from "../views/ReceiptDetailView.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ResetPassword from '../views/auth/ResetPassword.vue'

const routes = [

  {
    path: "/login",
    component: LoginView,
    name: "LoginView",
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    component: RegisterView,
    name: "RegisterView",
    meta: { requiresAuth: false },
  },
  {
    path:"/forgot-password",
    component:ResetPassword,
    name:"ResetPassword",
    meta:{requiresAuth:false}
  },
  {
    path: "/",
    component: HomeView,
    name: "HomeView",
    meta: { requiresAuth: true },
  },
  {
    path: "/addReceipt",
    component: AddReceipt,
    name: "AddReceiptView",
    meta: { requiresAuth: true },
  },
  {
    path: "/receiptDetail/:id",
    component: ReceiptDetailView,
    name: "ReceiptDetailView",
    meta: { requiresAuth: true },
    props: true,
  },
  
  { path: "/:catchAll(.*)", component: ErrorComponent, name: "ErrorComponent" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (requiresAuth && !user) {
      next("/login");
    } else if (requiresAuth == false && user) {
      next("/");
    } else {
      next();
    }
  });
});

export default router;
