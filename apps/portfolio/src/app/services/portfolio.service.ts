import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/projects`);
  }

  getSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/skills`);
  }

  getExperiences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/experiences`);
  }

  getEducations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/educations`);
  }

  sendMessage(data: { name: string; email: string; subject: string; message: string }): Observable<any> {
    return this.http.post(`${this.api}/messages`, data);
  }
}
