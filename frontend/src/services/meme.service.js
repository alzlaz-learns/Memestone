import http from "../http-common";
import authHeader from './auth-header';

class MemeService {
  getMemes() {
    return http.get("/api/memes", { headers: authHeader() });
  }

  getTopMemes() {
    return http.get("/api/memes?top", { headers: authHeader() });
  }

  getMemesByUser(userID) {
    return http.get("/api/memes?byUser="+userID, { headers: authHeader() });
  }

  getLikedMemes(userID) {
    return http.get("/api/memes?likedBy="+userID, { headers: authHeader() });
  }

  getNewMemesFor(userID) {
    return http.get("/api/memes?newMemesFor="+userID, { headers: authHeader() });
  }
}
export default new MemeService();