export const ACTIONS = {
  ADD_USER: "ADD_USER",
  REMOVE_USER: "REMOVE_USER",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  TOGGLE_ADD_USER_MODAL_TO: "TOGGLE_ADD_USER_MODAL_TO",
  TOGGLE_SETTING_MODAL_TO: "TOGGLE_SETTING_MODAL_TO",
};

export function reducer(state, action) {
  let newUsernames;
  switch (action.type) {
    case ACTIONS.ADD_USER:
      const lowerUsername = action.payload.toLowerCase();
      newUsernames = [...state.usernames, lowerUsername];
      return {
        ...state,
        usernames: newUsernames,
      };
    case ACTIONS.REMOVE_USER:
      newUsernames = state.usernames.filter(
        (currUsername) => currUsername !== action.payload
      );
      return {
        ...state,
        usernames: newUsernames,
      };
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case ACTIONS.TOGGLE_ADD_USER_MODAL_TO:
      return {
        ...state,
        isUserModalOpen: action.payload,
      };
    case ACTIONS.TOGGLE_SETTING_MODAL_TO:
      return {
        ...state,
        isSettingModalOpen: action.payload,
      };
    default:
      return state;
  }
}
