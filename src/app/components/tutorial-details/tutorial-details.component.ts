import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';;
import { Producto } from 'src/app/models/producto.model';
import { ProductoFile } from 'src/app/models/productofile.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit {

  @Input() viewMode = false;

  @Input() currentProducto: Producto = {
    nombre: '',
    imgAnversoUrl: '',
    imgReversoUrl:'',
    published: false
  };
  @Input() previewAnverso:any;
  @Input() previewReverso:any;
  @Input() currentProductoFile: ProductoFile = {};

  message = '';
  fileToUploadReverso: File;
  fileToUploadAnverso: File;
  msg = "";
  sanitizer: DomSanitizer;
  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,sanitizerInit: DomSanitizer) {
      this.sanitizer=sanitizerInit;
     }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getProducto(this.route.snapshot.params["codigo"]);
      this.getFile(this.route.snapshot.params["codigo"]);
    }
  }

  getProducto(id: any): void {
    this.tutorialService.getdata(id)
      .subscribe({
        next: (data) => {
          this.currentProducto = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  getFile(id: any): void {
    this.tutorialService.get(id)
      .subscribe({
        next: (data) => {
          this.currentProductoFile = data;
          let objectURL1 = 'data:image/jpeg;base64,' + (this.currentProductoFile.imgAnverso);
          let objectURL2 = 'data:image/jpeg;base64,' + (this.currentProductoFile.imgReverso);
          this.previewAnverso = this.sanitizer.bypassSecurityTrustUrl(objectURL1);
          this.previewReverso = this.sanitizer.bypassSecurityTrustUrl(objectURL2);
   
          
        },
        error: (e) => console.error(e)
      });
  }
  

  updatePublished(status: boolean): void {
    const data = {
      nombre: this.currentProducto.nombre,
      published: status
    };

    this.message = '';

    this.tutorialService.update(this.currentProducto.codigo, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentProducto.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });

      //addpreview anverso to param file
  }

  updateTutorial(): void {
    this.message = '';

    this.tutorialService.update(this.currentProducto.codigo, this.currentProducto)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This tutorial was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentProducto.codigo)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/productos']);
        },
        error: (e) => console.error(e)
      });
  }

  handleFileInputA(event:any) {
    const file:File = event.target.files[0];
    if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
		}
    this.fileToUploadAnverso = file
    var reader = new FileReader();
		reader.readAsDataURL(this.fileToUploadAnverso);
		reader.onload = (_event) => {
			this.previewAnverso = reader.result; 
		}
  }
  handleFileInputB(event:any) {
    const file:File = event.target.files[0];
    if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
		}
    this.fileToUploadReverso = file
    var reader = new FileReader();
		reader.readAsDataURL(this.fileToUploadReverso);
		reader.onload = (_event) => {
			this.previewReverso = reader.result; 
		}
    
  }

}