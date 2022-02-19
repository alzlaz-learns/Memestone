import http from "../http-common";
class InteractionService {
  isMemeLikedBy(memeID, userID) {
    return http.get("/api/likes?meme="+memeID+"&user="+userID);
  }

  submitLike(meme, userID) {
    return http.post("/api/like", {
      userID,
      meme
    });
  }

  submitDislike(meme, userID) {
    return http.post("/api/dislike", {
      userID,
      meme
    });
  }
}
export default new InteractionService();