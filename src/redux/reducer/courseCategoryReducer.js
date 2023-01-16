const initialState = {
  loading: false,
  error: null,
  success: null,
  categories: [],
  paginationLast: {},

  selectData: {
    singleLoad: false,
    category: {
      _id: "",
    },
  },

  //count
  countLoading: false,
  totalCount: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_CATEGORIES_START":
      return {
        ...state,
        loading: true,
        categories: [],
        error: null,
      };

    case "LOAD_CATEGORIES_SUCCESS":
      return {
        ...state,
        categories: action.categories,
        loading: false,
        error: null,
      };

    case "LOAD_CATEGORIES_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        categories: [],
      };

    case "CATEGORY_UPDOWN_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };

    case "CATEGORY_UPDOWN_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
      };

    case "CATEGORY_UPDOWN_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Байршил солигдлоо",
        error: null,
      };
    // Single category
    case "GET_CATEGORY_START":
      return {
        ...state,
        loading: true,
        error: null,
        selectData: {
          category: {
            _id: "",
          },
        },
      };
    case "GET_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        selectData: {
          ...state.selectData,
          category: action.category,
        },
      };
    case "GET_CATEGORY_ERROR":
      return {
        ...state,
        error: action.error,
        success: null,
        selectData: {
          ...state.selectData,
        },
      };

    // save travel category
    case "CREATE_CATEGORY_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "CREATE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай шинэ цэс нэмэгдлээ",
        error: null,
      };
    case "CREATE_CATEGORY_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
      };
    case "DELETE_CATEGORY_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "DELETE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай цэсийг устгаллаа",
        error: null,
      };
    case "DELETE_CATEGORY_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
        success: null,
      };

    // Update
    case "UPDATE_CATEGORY_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "UPDATE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай цэсний солигдлоо",
        error: null,
      };
    case "UPDATE_CATEGORY_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        success: null,
      };

    case "GET_COUNT_CATEGORY_START":
      return {
        ...state,
        countLoading: true,
        totalCount: null,
        error: null,
      };
    case "GET_COUNT_CATEGORY_SUCCESS":
      return {
        ...state,
        coutLoading: false,
        totalCount: action.orderCount,
        error: null,
      };
    case "GET_COUNT_CATEGORY_ERROR":
      return {
        ...state,
        countLoading: false,
        totalCount: null,
        error: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
