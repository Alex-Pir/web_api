import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Task} from "./tasks/task.interface";

@Injectable()
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  getAllData(url: string) {
    return this.httpClient.get<Array<Task>>(url);
  }

  addData(url: string, data: Task) {
    return this.httpClient.post<number>(url, data);
  }

  updateData(url: string, data: Task) {
    return this.httpClient.put<Task>(url, data);
  }

  deleteData(url: string) {
    return this.httpClient.delete(url);
  }
}
