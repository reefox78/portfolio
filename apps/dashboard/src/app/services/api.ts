import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  // Projects
  getProjects() { return this.http.get<any[]>(`${this.base}/projects`); }
  createProject(data: any) { return this.http.post<any>(`${this.base}/projects`, data, { headers: this.headers() }); }
  updateProject(id: number, data: any) { return this.http.patch<any>(`${this.base}/projects/${id}`, data, { headers: this.headers() }); }
  deleteProject(id: number) { return this.http.delete<void>(`${this.base}/projects/${id}`, { headers: this.headers() }); }

  // Skills
  getSkills() { return this.http.get<any[]>(`${this.base}/skills`); }
  createSkill(data: any) { return this.http.post<any>(`${this.base}/skills`, data, { headers: this.headers() }); }
  updateSkill(id: number, data: any) { return this.http.patch<any>(`${this.base}/skills/${id}`, data, { headers: this.headers() }); }
  deleteSkill(id: number) { return this.http.delete<void>(`${this.base}/skills/${id}`, { headers: this.headers() }); }

  // Experiences
  getExperiences() { return this.http.get<any[]>(`${this.base}/experiences`); }
  createExperience(data: any) { return this.http.post<any>(`${this.base}/experiences`, data, { headers: this.headers() }); }
  updateExperience(id: number, data: any) { return this.http.patch<any>(`${this.base}/experiences/${id}`, data, { headers: this.headers() }); }
  deleteExperience(id: number) { return this.http.delete<void>(`${this.base}/experiences/${id}`, { headers: this.headers() }); }

  // Educations
  getEducations() { return this.http.get<any[]>(`${this.base}/educations`); }
  createEducation(data: any) { return this.http.post<any>(`${this.base}/educations`, data, { headers: this.headers() }); }
  updateEducation(id: number, data: any) { return this.http.patch<any>(`${this.base}/educations/${id}`, data, { headers: this.headers() }); }
  deleteEducation(id: number) { return this.http.delete<void>(`${this.base}/educations/${id}`, { headers: this.headers() }); }

  // Messages
  getMessages() { return this.http.get<any[]>(`${this.base}/messages`, { headers: this.headers() }); }
  deleteMessage(id: number) { return this.http.delete<void>(`${this.base}/messages/${id}`, { headers: this.headers() }); }
}
