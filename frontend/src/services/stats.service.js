import http from "../http-common";
class StatsService {
  getNumLikes(username) {
    return http.get("/api/stats/numLikes?user="+username);
  }
}
export default new StatsService();