const API_URLS = {
  //auth
  signup: "auth/register",
  login: "auth/login",
  refreshToken: "auth/refresh-token",
//   verifyOtp: "auth/verify/otp",
//   resendOTP: "auth/resend/otp",
//   getUser: "auth/user/get_user",
  //user
  USER_PROFILE: "user/profile",
  UPDATE_PROFILE: "user/profile",
  CHANGE_PROFILE_PICTURE: "user/profile/picture",
  GET_USER_BY_ID: "user",
  SEARCH_USERS: "user/search",

  // Friends
  GET_FRIENDS: "friends",
  GET_PENDING_REQUESTS: "friends/requests/pending",
  GET_SENT_REQUESTS: "friends/requests/sent",
  SEND_FRIEND_REQUEST: "friends/request",
  ACCEPT_FRIEND_REQUEST: "friends/accept",
  REJECT_FRIEND_REQUEST: "friends/reject",
  CANCEL_FRIEND_REQUEST: "friends/cancel",
  REMOVE_FRIEND: "friends/remove",
  CHECK_FRIENDSHIP_STATUS: "friends/status",
  
  // Messages
  GET_CONVERSATIONS: "messages/conversations",
  GET_MESSAGES: "messages/conversation",  // Will append /:friendId
  SEND_TEXT_MESSAGE: "messages/text",
  SEND_IMAGE_MESSAGE: "messages/image",
  SEND_VIDEO_MESSAGE: "messages/video",
  SEND_DOCUMENT_MESSAGE: "messages/document",
  SEND_AUDIO_MESSAGE: "messages/audio",
  SEND_LINK_MESSAGE: "messages/link",
  MARK_MESSAGE_READ: "messages/read",  // Will append /:messageId
  MARK_ALL_MESSAGES_READ: "messages",  // Will append /:friendId/read-all
  DELETE_MESSAGE: "messages",  // Will append /:messageId
};

export default API_URLS;