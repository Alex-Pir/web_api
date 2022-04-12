import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Task} from "./tasks/task.interface";

@Injectable()
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  getAllData(url: string) {
    return this.httpClient.get<Array<Task>>(url);
  }

  addData(url: string, data: any) {
    return this.httpClient.post<number>(url, data);
  }

  updateData(url: string, data: any) {
    return this.httpClient.put<Task>(url, data);
  }
}
