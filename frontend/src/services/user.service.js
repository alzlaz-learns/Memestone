import http from "../http-common";
import authHeader from './auth-header';

const API_URL = '/api/test/';

class UserService {
  usernameCache = {};

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
    //Return username if it is in the cache
    if (userID in this.usernameCache) return this.usernameCache[userID];

    //Otherwise check the database
    var promise = http.get(API_URL + 'getUserName?user='+userID, { headers: authHeader() });
    promise.then((response) => {
      this.usernameCache[userID] = response.data[0].username;
    });
    return promise;
  }

  getUserID(username) {
    return http.get(API_URL + 'getUserID?user='+username, { headers: authHeader() });
  }
}

export default new UserService();
