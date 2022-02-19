import http from "../http-common";
class FileUploadService {
  // upload(file, onUploadProgress) {
  upload(file, additional, onUploadProgress) { //al customizing parameters to see if we can add more to file
    let formData = new FormData();
    formData.append("file", file);
    console.log("this is line 8 of file-upload.service.js");


    const map = new Map(Object.entries(additional)); // Map(2) {"foo" => "bar", "baz" => 42}
    // console.log(map)
    console.log(map.get('id'));
    console.log(map.get('username'));

    formData.append("id", map.get('id'));
    formData.append("username", map.get('username'));

    console.log("this is line 18 of file-upload.service.js");
    for(var pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]);
   }

    return http.post("/upload?date="+Date.now(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
  getFiles() {
    return http.get("/files");
  }
}
export default new FileUploadService();