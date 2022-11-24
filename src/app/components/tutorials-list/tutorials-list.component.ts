import { Component, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Producto } from 'src/app/models/producto.model';
import { ProductoFile } from 'src/app/models/productofile.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {

  productos?: Producto[];
  currentProducto: Producto = {};
  currentProductoFile: ProductoFile = {};
  currentIndex = -1;
  codigo = '';
  previewAnverso:any;
  previewReverso:any;
  sanitizer: DomSanitizer
  constructor(private tutorialService: TutorialService,sanitizerInit: DomSanitizer) { 
    this.sanitizer=sanitizerInit;
  }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll()
      .subscribe({
        next: (data) => {
          this.productos = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentProducto = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(producto: Producto, index: number): void {
    this.currentProducto = producto; 
    this.currentIndex = index;
    this.getTutorial(this.currentProducto.codigo);
    /*this.preview = '';
    const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log(e.target.result);
        this.preview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);

      };
      this.preview=reader.readAsDataURL(new Blob([this.currentTutorial.imgAnverso],{ type: 'image/jpeg'}));
     */ 
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  searchTitle(): void {
    this.currentProducto = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.codigo)
      .subscribe({
        next: (data) => {
          this.productos = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  getTutorial(id: any): void {
    this.tutorialService.get(id)
      .subscribe({
        next: (data) => {
          this.currentProductoFile = data;
          console.log(data);
          let objectURL1 = 'data:image/jpeg;base64,' + (this.currentProductoFile.imgAnverso);
          let objectURL2 = 'data:image/jpeg;base64,' + (this.currentProductoFile.imgReverso);
          this.previewAnverso = this.sanitizer.bypassSecurityTrustUrl(objectURL1);
          this.previewReverso = this.sanitizer.bypassSecurityTrustUrl(objectURL2);
        },
        error: (e) => console.error(e)
      });
  }

}