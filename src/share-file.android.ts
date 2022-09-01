import { Application, File, Folder } from '@nativescript/core';

export class ShareFile {
  open(args: any): void {
    if (args.path) {
      try {
        const intent = new android.content.Intent();
        const map = android.webkit.MimeTypeMap.getSingleton();
        const mimeType = map.getMimeTypeFromExtension(this.fileExtension(args.path));

        intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);

        const uris = new java.util.ArrayList();
        const uri = this._getUriForPath(args.path);
        uris.add(uri);
        const builder = new android.os.StrictMode.VmPolicy.Builder();
        android.os.StrictMode.setVmPolicy(builder.build());

        intent.setAction(android.content.Intent.ACTION_SEND_MULTIPLE);
        intent.setType('message/rfc822');
        intent.putParcelableArrayListExtra(android.content.Intent.EXTRA_STREAM, uris);

        Application.android.foregroundActivity.startActivity(android.content.Intent.createChooser(intent, args.intentTitle ? args.intentTitle : 'Open file:'));
      }
      catch (e) {
        console.log('ShareFile: Android intent failed: ' + e);
      }
    } else {
      console.log('ShareFile: Please add a file path');
    }
  }

  fileExtension(filename) {
    return filename.split('.').pop();
  }
  fileName(filename) {
    return filename.split('/').pop();
  }

  _getUriForPath(path) {
    var file = new java.io.File(path);
    return androidx.core.content.FileProvider.getUriForFile(
        Application.android.foregroundActivity ||
        Application.android.startActivity,
        Application.android.packageName + ".fileprovider",
        file,
    );
  }
}
