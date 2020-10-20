import { Component } from "@angular/core";
import { Chooser, ChooserResult } from "@ionic-native/chooser/ngx";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  fileObj: ChooserResult;
  croppedImagepath = "";
  isLoading = false;
  selectedVideo: string;
  uploadedVideo: string;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  constructor(
    private _chooser: Chooser,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File
  ) {}

  pickFile() {
    const acceptedFiles = 'image/*,video/*,audio/*,application/pdf'
    this._chooser.getFile(acceptedFiles).then(
      (value: ChooserResult) => {
        this.fileObj = value;
        console.log("File NAME", this.fileObj.name);
        console.log("File dataURI BASE64", this.fileObj.dataURI);
        console.log("File dataURI mediaType", this.fileObj.mediaType);
        // this.getBase64StringByFilePath(this.fileObj.dataURI)
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        console.log("imageData:", imageData);
        this.croppedImagepath = "data:image/jpeg;base64," + imageData;
      },
      (err) => {
        // Handle error
      }
    );
  }

  selectFrom(mediaType) {
    const options: CameraOptions = {
      mediaType: mediaType,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
console.log('options : ', options);

    this.camera.getPicture(options).then(
      async (videoUrl) => {
        if (videoUrl) {
          this.uploadedVideo = null;
          console.log("videoUrl : ", videoUrl);
          this.getBase64StringByFilePath(videoUrl);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Gallery iOS",
          handler: () => {
            this.selectFrom(this.camera.MediaType.ALLMEDIA);
          },
        },

        {
          text: "File Manager",
          handler: () => {
            this.pickFile();
          },
        },

        {
          text: "Gallery Android",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },

        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  getBase64StringByFilePath(fileURL): Promise<string> {
    return new Promise((resolve, reject) => {
      let fileName = fileURL.substring(fileURL.lastIndexOf("/") + 1);
      let filePath = fileURL.substring(0, fileURL.lastIndexOf("/") + 1);
      console.log("fileName: ", fileName); //base64url...
      console.log("filePath: ", filePath); //base64url...

      this.file
        .readAsDataURL(filePath, fileName)
        .then((file64) => {
          console.log("base64url: ", file64); //base64url...
          resolve(file64);
        })
        .catch((err) => {
          console.log("base64url error ", JSON.stringify(err)); //base64url...

          reject(err);
        });
    });
  }
}
