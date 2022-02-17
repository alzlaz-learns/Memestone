import http from "../http-common";
class MemeService {
  /*upload(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);
    return http.post("/meme", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }*/
  getMemes() {
    return http.get("/memes");
  }
}
export default new MemeService();