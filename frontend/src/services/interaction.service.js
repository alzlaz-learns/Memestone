import http from "../http-common";
class InteractionService {
  isMemeLikedBy(memeID, username) {
    return http.get("/api/likes?meme="+memeID+"&user="+username);
  }

  submitLike(meme, username) {
    return http.post("/api/like", {
      username,
      meme
    });
  }

  submitDislike(meme, username) {
    return http.post("/api/dislike", {
      username,
      meme
    });
  }
}
export default new InteractionService();