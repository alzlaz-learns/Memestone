import http from "../http-common";
import authHeader from './auth-header';

class InteractionService {
  isMemeLikedBy(memeID, userID) {
    return http.get("/api/likes?meme="+memeID, { headers: authHeader() });
  }

  //Submit a like to the database
  submitLike(meme) {
    return http.post("/api/like", { meme }, { headers: authHeader() });
  }

  //Submit a dislike to the database
  submitDislike(meme) {
    return http.post("/api/dislike", { meme }, { headers: authHeader() });
  }

  //Mark a meme as viewed by the current user in the database
  markViewed(meme) {
    return http.post("/api/markViewed", { meme }, { headers: authHeader() });
  }

  //Delete a meme from the database
  deleteMeme(meme) {
    return http.post("/api/deleteMeme", { meme }, { headers: authHeader() });
  }
}
export default new InteractionService();