const initialState = {
  types: [],
  loading: false,
  error: null,
  success: null,
  type: null,
  type: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CLEAR_MEMBER_TYPES":
      return {
        ...state,
        loading: false,
        error: null,
        success: null,
        type: null,
      };
    case "MEMBER_TYPES_CHANGE_POSITION_START":
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case "MEMBER_TYPES_CHANGE_POSITION_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        success: "Өөрчлөлт хадгалагдлаа",
      };
    case "MEMBER_TYPES_CHANGE_POSITION_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        success: null,
      };

    case "LOAD_MEMBER_TYPES_START":
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };

    case "LOAD_MEMBER_TYPES_SUCCESS":
      return {
        ...state,
        types: action.resultAll,
        loading: false,
      };

    case "LOAD_MEMBER_TYPES_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    // Single type
    case "LOAD_MEMBER_TYPE_START":
      return {
        ...state,
        loading: true,
        error: null,
        type: null,
      };
    case "LOAD_MEMBER_TYPE_SUCCESS":
      return {
        ...state,
        type: action.result,
        loading: false,
        error: null,
      };

    case "LOAD_MEMBER_TYPE_ERROR":
      return {
        ...state,
        type: null,
        loading: false,
        error: action.error,
      };

    // save travel type
    case "CREATE_MEMBER_TYPE_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "CREATE_MEMBER_TYPE_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай шинэ ангилал нэмэгдлээ",
        error: null,
      };
    case "CREATE_MEMBER_TYPE_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
      };
    case "DELETE_MEMBER_TYPE_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
        type: null,
      };
    case "DELETE_MEMBER_TYPE_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай ангилалыг устгаллаа",
        error: null,
        type: null,
      };
    case "DELETE_MEMBER_TYPE_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
        success: null,
        type: null,
      };

    // Update
    case "UPDATE_MEMBER_TYPE_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "UPDATE_MEMBER_TYPE_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай ангилалын нэр солигдлоо",
        error: null,
      };
    case "UPDATE_MEMBER_TYPE_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        success: null,
      };

    default:
      return state;
  }
};

export default reducer;
