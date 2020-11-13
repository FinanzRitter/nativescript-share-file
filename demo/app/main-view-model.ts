import { Observable, knownFolders, path, File } from "@nativescript/core";
import { ShareFile } from "@finanzritter/nativescript-share-file";

export class HelloWorldModel extends Observable {
  shareFile: ShareFile;
  fileName;
  documents;
  path;
  file;

  constructor() {
    super();
    this.fileName = 'report.txt';
    this.documents = knownFolders.documents();
    this.path = path.join(this.documents.path, this.fileName);
    this.file = File.fromPath(this.path);

    this.shareFile = new ShareFile();

    try {
      this.file.writeText('Send this txt to other apps').then( () => {
        setTimeout(() => {
          this.shareFile.open({
            path: this.path,
            intentTitle: 'Open text file with:',
            rect: {
                x: 110,
                y: 110,
                width: 0,
                height: 0
            },
            options: true,
            animated: true
          });
        }, 3000);

      } ).catch( (e) => {
          console.log('Creating text file failed');
          alert(JSON.stringify(e));
      });
    } catch (e) {
      alert(e);
      console.log('Error while creating text file');
    }


  }
}
