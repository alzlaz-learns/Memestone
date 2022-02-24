import http from "../http-common";
import authHeader from './auth-header';

class StatsService {
  getNumLikes(userID) {
    return http.get("/api/stats/numLikes?user="+userID, { headers: authHeader() });
  }
}
export default new StatsService();