import http from "../http-common";
import authHeader from './auth-header';

const API_URL = '/api/test/';

class UserService {
  getPublicContent() {
    return http.get(API_URL + 'all');
  }

  getUserBoard() {
    return http.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return http.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return http.get(API_URL + 'admin', { headers: authHeader() });
  }

  getUserName(userID) {
    return http.get(API_URL + 'getUserName?user='+userID, { headers: authHeader() });
  }

  getUserID(username) {
    return http.get(API_URL + 'getUserID?user='+username, { headers: authHeader() });
  }
}

export default new UserService();
