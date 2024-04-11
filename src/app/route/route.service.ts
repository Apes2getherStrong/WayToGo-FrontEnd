import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Route} from "./route.model";
import {Page} from "../shared/page.model";
import {Subject, tap} from "rxjs";


@Injectable({providedIn: 'root'})
export class RouteService {

  constructor(private http: HttpClient) {
  }

  getRoutes(pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Page<Route>>('http://localhost:8090/api/v1/routes', {params});
  }

  getRouteById(id: string) {
    const url = `http://localhost:8090/api/v1/routes/${id}`;
    return this.http.get<Route>(url);
  }

  patchRouteById(id: string, route: Route) {
    const url = `http://localhost:8090/api/v1/routes/${id}`;
    return this.http.patch<Route>(
      url,
      route
    );
  }
}