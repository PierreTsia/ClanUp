class UploadImgService {
  file;
  progress = 0;
  uploadPreset = "pnegzkiq";
  apiEndPoint = "https://api.cloudinary.com/v1_1/dopecloud/upload";
  constructor(file, callback) {
    this.file = file;
    this.callback = callback;
  }

  async sendFiles() {
    let formdata = new FormData();
    formdata.append("file", this.file);
    formdata.append("upload_preset", this.uploadPreset);
    let xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", e => {
      let total = e.total;
      let loaded = e.loaded;
      this.progress = parseInt((100 / total) * loaded);
      this.callback("in progress", this.progress);
    });

    xhr.addEventListener("load", async e => {
      let response = e.target;
      this.progress = 0;
      formdata = null;
      if (response.status !== 200) {
        this.callback("error", response.responseText);
      } else {
        let uploaded = await JSON.parse(response.responseText);
        this.callback("uploaded", uploaded);
      }
    });
    xhr.open("POST", this.apiEndPoint);
    xhr.send(formdata);
  }
}

export default UploadImgService;
