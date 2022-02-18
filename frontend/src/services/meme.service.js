import http from "../http-common";
class MemeService {
  getMemes() {
    return http.get("/api/memes");
  }

  getTopMemes() {
    return http.get("/api/memes?top");
  }

  getMemesByUser(username) {
    return http.get("/api/memes?byUser="+username);
  }

  getLikedMemes(username) {
    return http.get("/api/memes?likedBy="+username);
  }
}
export default new MemeService();