import http from "../http-common";
class MemeService {
  getMemes() {
    return http.get("/memes");
  }

  getTopMemes() {
    return http.get("/memes?top");
  }

  getMemesByUser(username) {
    return http.get("/memes?byUser="+username);
  }

  getLikedMemes(username) {
    return http.get("/memes?likedBy="+username);
  }
}
export default new MemeService();