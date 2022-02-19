import http from "../http-common";
class MemeService {
  getMemes() {
    return http.get("/api/memes");
  }

  getTopMemes() {
    return http.get("/api/memes?top");
  }

  getMemesByUser(userID) {
    return http.get("/api/memes?byUser="+userID);
  }

  getLikedMemes(userID) {
    return http.get("/api/memes?likedBy="+userID);
  }

  getNewMemesFor(userID) {
    return http.get("/api/memes?newMemesFor="+userID);
  }
}
export default new MemeService();