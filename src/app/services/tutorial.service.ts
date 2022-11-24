import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';
import { Producto } from '../models/producto.model';
import { ProductoFile } from '../models/productofile.model';

const baseUrl = 'http://localhost:8080/producto';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
 currentProducto: Producto = {
    nombre: '',
    imgAnversoUrl: '',
    imgReversoUrl:'',
    published: false
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(baseUrl+"/listarProductos");
  }

  get(id: any): Observable<ProductoFile> {
    return this.http.get<ProductoFile>(`${baseUrl+"/buscarPorIdByte"}/${id}`);
  }
  getdata(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl+"/buscarPorId"}/${id}`);
  }

  create(data: any,fileToUploadAnverso:File,fileToUploadReverso:File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file1', fileToUploadAnverso, fileToUploadAnverso.name);
    formData.append('file2', fileToUploadReverso, fileToUploadReverso.name);
    formData.append('producto', data);
    return this.http.post(baseUrl+"/registrarProducto", formData);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }

}