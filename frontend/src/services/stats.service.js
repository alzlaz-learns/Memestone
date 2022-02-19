import http from "../http-common";
class StatsService {
  getNumLikes(userID) {
    return http.get("/api/stats/numLikes?user="+userID);
  }
}
export default new StatsService();