import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BASE_PATH } from '@libs/api-client/variables';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router, @Inject(BASE_PATH) private baseURL: string) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    const token = localStorage.getItem('accessToken');
    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.refreshToken().pipe(
            switchMap((newToken) => {
              this.isRefreshing = false;
              localStorage.setItem('accessToken', newToken);
              return next.handle(this.addTokenHeader(req, newToken));
            }),
            catchError((refreshError) => {
              this.isRefreshing = false;
              this.handleAuthError();
              return throwError(() => refreshError);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  private refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(`${this.baseURL}/auth/refresh-token`, {}).pipe(
      switchMap((response) => {
        return new Observable<string>((observer) => {
          observer.next(response.accessToken);
          observer.complete();
        });
      })
    );
  }

  private handleAuthError() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }
}
