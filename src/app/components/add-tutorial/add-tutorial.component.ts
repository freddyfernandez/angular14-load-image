import { Component } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent {
  fileToUploadReverso: File;
  fileToUploadAnverso: File;

  tutorial: Tutorial = {
    title: '',
    description: '',
    published: false,
    nombre:''
  };
  submitted = false;

  constructor(private tutorialService: TutorialService) { }

  saveTutorial(): void {
    const datatype = {
      nombre: this.tutorial.nombre,
    };
    const data = JSON.stringify(datatype);
    
    this.tutorialService.create(data,this.fileToUploadReverso,this.fileToUploadAnverso)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false
    };
  }

  handleFileInputA(event:any) {
    const file:File = event.target.files[0];
    this.fileToUploadAnverso = file
  }
  handleFileInputB(event:any) {
    const file:File = event.target.files[0];
    this.fileToUploadReverso = file;
  }

}