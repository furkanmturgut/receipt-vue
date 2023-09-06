import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import AddReceipt from '../views/AddReceipt.vue';
import CopyDemo from '../views/CopyDemo.vue';
import ReceiptDetailView from '../views/ReceiptDetailView.vue';

// const authControl = (to,from,next) => {
//   let auth = getAuth().currentUser.uid;
//   console.log(auth);
//   if (auth) {
//     console.log('to:',to)
//     if (to.path === "/login" || to.path == "/register") {
//       console.log("SA");
//       next({ name: "HomeView" });
//     } else {
//         next()
//     }
//   }else {
//       console.log("ASE");
//       next("/login");
    
//   }
// };

  const routes = [
    { path: "/copy", component: CopyDemo},

  { path: "/login", component: LoginView, name: "LoginView" },
  { path: "/register", component: RegisterView, name: "RegisterView" },
  {
    path: "/",
    component: HomeView,
    name: "HomeView",
  },
  {path:'/addReceipt',component:AddReceipt,name:'AddReceiptView'},
  {path:'/receiptDetail/:id',component:ReceiptDetailView,name:'ReceiptDetailView',props:true}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
