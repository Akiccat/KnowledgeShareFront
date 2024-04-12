import {environment} from "../../environments/environment";


const basePath = environment.server;
export const apiUrl = {
  login: basePath + '/auth/login',
  register: basePath + '/auth/registration',
  editUser: basePath + '/auth/update',
  getAllUser: basePath + '/auth/getAllUser',
  getAllAdmin: basePath + '/auth/getAllAdmin',
  getUserById: basePath + '/auth/getUser',
  userSearch: basePath + '/auth/searchUser',
  adminSearch: basePath + '/auth/searchAdmin',
  banUser: basePath + '/auth/banUser',
  setAsAdmin: basePath + '/auth/setAsAdmin',
  setAsUser: basePath + '/auth/setAsUser',

  uploadContent: basePath + '/editor/upload-content',

  uploadImage: basePath + '/image',

  updateContent: basePath + '/update/upload-content',
  updateImage: basePath + '/update/image',

  getNotes: basePath + '/note/getNotes',
  searchNotes: basePath + '/note/search',
  getDetail: basePath + '/note/detail',
  starNotes: basePath + '/note/starNote',
  unStarNotes: basePath + '/note/unStarNote',
  ifStart: basePath + '/note/ifStar',
  deleteNote: basePath + '/note/delete',
  getStarNotes: basePath + '/note/getStarNotes',
  searchStarNotes: basePath + '/note/searchStarNotes',

  getReply: basePath + '/getReply',
  sentReply: basePath + '/sentReply',
  getPublishCount: basePath + '/getPublishCount',
  getUserFrom: basePath + '/getUserFrom',
  getReplyCount: basePath + '/getReplyCount',
  getFavouriteCount: basePath + '/getFavouriteCount',

  userOwnNote: basePath + '/note/getNoteByUser',
  userOwnTag: basePath + '/note/getTagsByUser',
  userOwnTagDelete: basePath + '/note/deleteTag',
  userOwnTagUpdate: basePath + '/note/updateTag',
  searchUserOwnNote: basePath + '/note/searchNoteByUser',
  searchUserOwnTag: basePath + '/note/searchTagByUser',

  addReplyHistory: basePath + '/history/addReplyHistory',
  selectReplyHistory: basePath + '/history/getReplyHistory',
  deleteReplyHistory: basePath + '/history/deleteReplyHistory',

  addTempHistory: basePath + '/template/addTemplate',
  deleteTemplate: basePath + '/template/deleteTemplate',
  getTemplate: basePath + '/template/getTemplate',
};
