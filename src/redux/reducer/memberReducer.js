const initialState = {
  loading: false,
  error: null,
  success: null,
  allMember: [],
  paginationLast: {},
  excelData: [],
  member: {},
  //count
  countLoading: false,
  totalCount: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CLEAR_MEMBER":
      return {
        ...state,
        error: null,
        success: null,
      };

    case "LOAD_MEMBER_START":
      return {
        ...state,
        loading: true,
        error: null,
        suceess: null,
        allMember: [],
      };

    case "LOAD_MEMBER_SUCCESS":
      return {
        ...state,
        loading: false,
        allMember: action.members,
      };

    case "LOAD_MEMBER_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        allMember: [],
        error: action.error,
      };

    case "LOAD_PAGINATION":
      return {
        ...state,
        paginationLast: action.pagination,
      };
    // EXCEL
    case "GET_MEMBER_EXCELDATA_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
        excelData: [],
      };

    case "GET_MEMBER_EXCELDATA_SUCCESS":
      return {
        ...state,
        loading: false,
        excelData: action.excel,
      };

    case "GET_MEMBER_EXCELDATA_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
        excelData: [],
      };

    // SAVE
    case "CREATE_MEMBER_INIT":
      return {
        ...state,
        loading: false,
        error: null,
        success: null,
      };

    case "CREATE_MEMBER_START":
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };

    case "CREATE_MEMBER_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        member: action.member,
        success: "Амжилттай нэмэгдлээ",
      };
    case "CREATE_MEMBER_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "DELETE_MULT_MEMBER_START":
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      };
    case "DELETE_MULT_MEMBER_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Амжилттай устгагдлаа",
        error: null,
      };
    case "DELETE_MULT_MEMBER_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
      };

    //GET
    case "GET_MEMBER_INIT":
      return {
        ...state,
        loading: false,
        success: null,
        error: null,
        member: {},
      };

    case "GET_MEMBER_START":
      return {
        ...state,
        loading: true,
        member: {},
        error: null,
      };

    case "GET_MEMBER_SUCCESS":
      return {
        ...state,
        loading: false,
        member: action.singleMember,
        error: null,
      };

    case "GET_MEMBER_ERROR":
      return {
        ...state,
        loading: false,
        member: {},
        error: action.error,
      };
    //UPDATE
    case "UPDATE_MEMBER_START":
      return {
        ...state,
        success: null,
        loading: true,
        error: null,
      };
    case "UPDATE_MEMBER_SUCCESS":
      return {
        ...state,
        loading: false,
        success: "Мэдээллийг амжилттай шинэчлэгдлээ",
        error: null,
      };
    case "UPDATE_MEMBER_ERROR":
      return {
        ...state,
        loading: false,
        success: null,
        error: action.error,
      };
    case "UPDATE_END":
      return {
        ...state,
        loading: false,
        success: null,
        error: null,
      };

    // GET COUNT
    case "GET_COUNT_MEMBER_START":
      return {
        ...state,
        countLoading: true,
        totalCount: null,
        error: null,
      };
    case "GET_COUNT_MEMBER_SUCCESS":
      return {
        ...state,
        coutLoading: false,
        totalCount: action.orderCount,
        error: null,
      };
    case "GET_COUNT_MEMBER_ERROR":
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
