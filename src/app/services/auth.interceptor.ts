import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { BASE_PATH } from '@libs/api-client/variables';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router, @Inject(BASE_PATH) private baseURL: string) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Check if token is expired
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired && !this.isRefreshing) {
        return this.handleExpiredToken(req, next);
      }

      req = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handleExpiredToken(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleExpiredToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;

    return this.refreshToken().pipe(
      switchMap((newToken) => {
        this.isRefreshing = false;
        localStorage.setItem('accessToken', newToken);
        return next.handle(this.addTokenHeader(req, newToken));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.handleAuthError();
        return throwError(() => error);
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
