import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddPractitionerAvailabilityDTO } from '@libs/api-client';
import { GetPractitionerAvailabilityDTO } from '@libs/api-client';
import { map, Observable } from 'rxjs';
import { EcliHttpResponse } from '@models/ecli-http-response.model';
import { BACKEND_URL } from '@constants/environment.constants';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private baseUrl = BACKEND_URL + '/practitioneravailabilities';

  constructor(private http: HttpClient) { }
  GetAll(): Observable<GetPractitionerAvailabilityDTO[]> {
    return this.http.get<EcliHttpResponse<GetPractitionerAvailabilityDTO[]>>(this.baseUrl).pipe(
      map((response) => response.data)
    );

  }


}
