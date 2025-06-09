import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/components/not-found/not-found.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {path:"",
    loadComponent:()=>import('./layouts/blank-layout/blank-layout.component').then((m)=>m.BlankLayoutComponent),
  children:[
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',
      loadComponent:() => import('./components/components/home/home.component').then((m)=>m.HomeComponent),title:'Home',
     canActivate: [authGuard]
    }
    ,
    {path:"model",
     loadComponent:()=>import('./components/components/model/model.component').then((m)=>m.ModelComponent),title:'Model'
    ,canActivate: [authGuard]
  }
   ,
    {path:"aboutUs",
     loadComponent:()=>import('./components/components/about-us/about-us.component').then((m)=>m.AboutUsComponent),title:'AboutUs'
    ,canActivate: [authGuard]
  }
  ]
  },
  {path:"",
    loadComponent:()=>import('./layouts/auth-layout/auth-layout.component').then((m)=>m.AuthLayoutComponent),
    children:[
     {path:'',redirectTo:'login',pathMatch:'full'},
     {path:'login',
       loadComponent:()=>import('./components/components/login/login.component').then((m)=>m.LoginComponent),title:'Login'
     },
     {path:'register',
      loadComponent:()=>import('./components/components/register/register.component').then((m)=>m.RegisterComponent),title:'Register'
     },
     {path:'forgot',loadComponent:()=>import('./components/components/forget-pass/forget-pass.component').then((m)=>m.ForgetPassComponent),title:'ForgotPassword'},
    ]

  },
  {path:'**',component:NotFoundComponent}


];
