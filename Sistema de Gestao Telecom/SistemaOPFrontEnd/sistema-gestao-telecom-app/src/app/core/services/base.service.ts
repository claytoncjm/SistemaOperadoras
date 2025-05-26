import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  protected baseUrl: string;

  constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) {
    this.baseUrl = `${environment.apiUrl}${endpoint}`;
  }

  getAll(): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(this.baseUrl);
  }

  getPaged(page: number = 1, pageSize: number = 10): Observable<PagedResponse<T>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<T>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`);
  }

  create(entity: T): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.baseUrl, entity);
  }

  update(id: number, entity: T): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${id}`, entity);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
