import {environment} from "../../environments/environment";


const basePath = environment.server;
export const apiUrl = {
  login: basePath + '/login',
  searchBooks: basePath + '/book/search',
  register: basePath + '/user/registration',
  retrieveBooks: basePath + '/book/retrieve',
  retrieveBooksByParams: basePath + '/book/retrieve-by-params',
  borrow: basePath + '/book/borrow',
  returnBook: basePath + '/book/return',
  getLogs: basePath + '/login/log/retrieve',
  addBook: basePath + '/book/add',
  exportLogs: basePath + '/login/log/export',
  rank:basePath + '/ranking/retrieve',
  editUser:basePath + '/user/update',
  // getBookDetails: basePath + '',
  editBook: basePath + '/book/edit',
  deleteBook: basePath + '/book/delete',
  getReturnBook: basePath + '/book/getReturn',
  testUser: basePath + '/book/searchUser'
};
