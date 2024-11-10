import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./auth/auth-guard.service";
import { CanEditService } from "./auth/can-edit.service";
import { CanDeactivateGuard } from "./shared/guards/can-deactivate-guard.service";

const routes: Routes = [
  {
    path: 'log-in',
    loadComponent: () => import('./user/log-in/log-in.component').then(m => m.LogInComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./user/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'point/new/:routeId',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./map-location/map-location-edit/map-location-edit.component').then(m => m.MapLocationEditComponent),
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'point/:pointId/edit',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./map-location/map-location-edit/map-location-edit.component').then(m => m.MapLocationEditComponent),
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'yourRoutes/new',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./route/route-edit/route-edit.component').then(m => m.RouteEditComponent),
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'users/:id',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./user/user-profile/user-profile.component').then(m => m.UserProfileComponent),
  },
  {
    path: 'routes',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./route/routes/routes.component').then(m => m.RoutesComponent),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./route/route-list/route-list.component').then(m => m.RouteListComponent),
        children: [
          {
            path: ':id',
            loadComponent: () => import('./route/route-info/route-info.component').then(m => m.RouteInfoComponent),
          }
        ]
      },
      {
        path: 'vicinity',
        loadComponent: () => import('./vicinity/vicinity.component').then(m => m.VicinityComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./route/route-detail/route-detail.component').then(m => m.RouteDetailComponent),
      },
    ]
  },
  {
    path: 'yourRoutes',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./route/routes/routes.component').then(m => m.RoutesComponent),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./route/route-list/route-list.component').then(m => m.RouteListComponent),
        children: [
          {
            path: ':id',
            loadComponent: () => import('./route/route-info/route-info.component').then(m => m.RouteInfoComponent),
          }
        ]
      },
      {
        path: ':id',
        loadComponent: () => import('./route/route-detail/route-detail.component').then(m => m.RouteDetailComponent),
      }
    ]
  },
  {
    path: 'yourRoutes/:id/edit',
    canActivate: [AuthGuardService, CanEditService],
    canDeactivate: [CanDeactivateGuard],
    loadComponent: () => import('./route/route-edit/route-edit.component').then(m => m.RouteEditComponent),
  },
  {
    path: '',
    redirectTo: 'routes/list', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
