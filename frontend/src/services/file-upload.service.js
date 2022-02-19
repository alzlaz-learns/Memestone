import http from "../http-common";
class FileUploadService {
  // upload(file, onUploadProgress) {
  upload(file, additional, onUploadProgress) { //al customizing parameters to see if we can add more to file
    let formData = new FormData();

    const map = new Map(Object.entries(additional)); // Map(2) {"foo" => "bar", "baz" => 42}

    formData.append("file", file, map.get('filename'));
    //formData.append("file", file);

    formData.append("id", map.get('id'));
    formData.append("username", map.get('username'));

    //for(var pair of formData.entries()) {
    //  console.log(pair[0]+ ', '+ pair[1]);
    //}

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