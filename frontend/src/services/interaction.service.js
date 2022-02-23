import http from "../http-common";
import authHeader from './auth-header';

class InteractionService {
  isMemeLikedBy(memeID, userID) {
    return http.get("/api/likes?meme="+memeID+"&user="+userID, { headers: authHeader() });
  }

  submitLike(meme, userID) {
    return http.post("/api/like", {
      userID,
      meme
    }, { headers: authHeader() });
  }

  submitDislike(meme, userID) {
    return http.post("/api/dislike", {
      userID,
      meme
    }, { headers: authHeader() });
  }
}
export default new InteractionService();