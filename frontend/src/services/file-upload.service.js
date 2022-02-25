import http from "../http-common";
import authHeader from './auth-header';


/*
  This is our file upload service that makes a call to our back-end
  this creates the meta data for our images by creating a formdata an appending necessary information
  then it makes a call to our back-end which uploads the files to our database by using axios through http-commons
 */
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
    const user = JSON.parse(localStorage.getItem('user'));
    
    return http.post("/upload?date="+Date.now(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'x-access-token': user.accessToken
      },
      onUploadProgress,
    }, { headers: authHeader() });
  }
  getFiles() {
    return http.get("/files");
  }
}
export default new FileUploadService();