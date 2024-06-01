import {Component, Output, EventEmitter, Input} from "@angular/core";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {
  @Output() filesChange: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Input() uploadMultipleFiles: boolean = false;
  @Output() filesChangeSingle: EventEmitter<File> = new EventEmitter<File>();


  files: File[] = [];

  constructor() {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files);
      this.files = Array.from(event.target.files);
      this.filesChange.emit(this.files);
      this.filesChangeSingle.emit(this.files[0]);
    }
  }
}
