import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Producto } from 'src/app/models/producto.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {

  tutorials?: Producto[];
  currentTutorial: Producto = {};
  currentIndex = -1;
  title = '';
  previewAnverso: any;
  previewReverso: any;
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
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Producto, index: number): void {
    this.currentTutorial = tutorial; 
    this.currentIndex = index;

    let objectURL1 = 'data:image/jpeg;base64,' + this.currentTutorial.imgAnverso;
    let objectURL2 = 'data:image/jpeg;base64,' + this.currentTutorial.imgReverso;
    this.previewAnverso = this.sanitizer.bypassSecurityTrustUrl(objectURL1);
    this.previewReverso = this.sanitizer.bypassSecurityTrustUrl(objectURL2);

    
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
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

}