import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsComponent) },
      { path: 'skills', loadComponent: () => import('./pages/skills/skills').then(m => m.SkillsComponent) },
      { path: 'experiences', loadComponent: () => import('./pages/experiences/experiences').then(m => m.ExperiencesComponent) },
      { path: 'educations', loadComponent: () => import('./pages/educations/educations').then(m => m.EducationsComponent) },
      { path: 'messages', loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
