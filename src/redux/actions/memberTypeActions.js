import axios from "../../axios-base";

export const clear = () => {
  return function (dispatch, getState) {
    dispatch(clearStart);
    dispatch(loadMemberTypes);
  };
};

const errorMessage = (error) => {
  let resError = "Алдаа гарлаа дахин оролдож үзнэ үү";

  if (resError) {
    resError = error.message;
  }

  if (error.response !== undefined && error.response.status !== undefined) {
    resError = error.response.status;
  }
  if (
    error.response !== undefined &&
    error.response.data !== undefined &&
    error.response.data.error !== undefined
  ) {
    resError = error.response.data.error.message;
  }
  return resError;
};

export const clearStart = () => {
  return {
    type: "CLEAR_MEMBERTYPES",
  };
};

export const loadMemberTypes = () => {
  return function (dispatch, getState) {
    dispatch(loadMemberTypesStart());
    axios
      .get("memberstype")
      .then((response) => {
        const result = response.data.data;
        dispatch(loadMemberTypesSuccess(result));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadMemberTypesError(resultError));
      });
  };
};
export const loadMemberTypesStart = () => {
  return {
    type: "LOAD_MEMBER_TYPES_START",
  };
};

export const loadMemberTypesSuccess = (result) => {
  return {
    type: "LOAD_MEMBER_TYPES_SUCCESS",
    resultAll: result,
  };
};

export const loadMemberTypesError = (error) => {
  return {
    type: "LOAD_MEMBER_TYPES_ERROR",
    error,
  };
};

// SINGLE CATEGORY

export const loadMemberType = (id) => {
  return function (dispatch, getState) {
    dispatch(loadMemberTypeStart());
    axios
      .get(`memberstype/${id}`)
      .then((response) => {
        const loadedMemberType = response.data.data;
        dispatch(loadMemberTypeSuccess(loadedMemberType));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadMemberTypeError(resultError));
      });
  };
};

export const loadMemberTypeStart = () => {
  return {
    type: "LOAD_MEMBER_TYPE_START",
  };
};

export const loadMemberTypeSuccess = (result) => {
  return {
    type: "LOAD_MEMBER_TYPE_SUCCESS",
    result,
  };
};

export const loadMemberTypeError = (error) => {
  return {
    type: "LOAD_MEMBER_TYPE_ERROR",
    error,
  };
};

// Change positions
export const changePosition = (data) => {
  return function (dispatch) {
    dispatch(changePositionStart());

    axios
      .post("memberstype/change", data)
      .then((response) => {
        const result = response.data.data;
        dispatch(changePositionSuccess(result));
        dispatch(loadMemberTypes());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(changePositionError(resultError));
      });
  };
};

export const changePositionStart = (result) => {
  return {
    type: "MEMBERTYPES_CHANGE_POSITION_START",
  };
};

export const changePositionSuccess = (data) => {
  return {
    type: "MEMBERTYPES_CHANGE_POSITION_SUCCESS",
    menus: data,
  };
};

export const changePositionError = (error) => {
  return {
    type: "MEMBERTYPES_CHANGE_POSITION_ERROR",
    error: error,
  };
};

// DELETE CATEGORY

export const deleteMemberType = (typeId, data) => {
  return function (dispatch, getState) {
    dispatch(deleteMemberTypeStart());

    axios
      .delete(`memberstype/${typeId}`, data)
      .then((response) => {
        const resultType = response.data.data;
        dispatch(deleteMemberTypeSuccess(resultType));
        dispatch(loadMemberTypes());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(deleteMemberTypeError(resultError));
      });
  };
};

export const deleteMemberTypeStart = () => {
  return {
    type: "DELETE_MEMBER_TYPE_START",
  };
};

export const deleteMemberTypeSuccess = (result) => {
  return {
    type: "DELETE_MEMBER_TYPE_SUCCESS",
    dlNews: result,
  };
};

export const deleteMemberTypeError = (error) => {
  return {
    type: "DELETE_MEMBER_TYPE_ERROR",
    error,
  };
};

// SAVE CATEGORY

export const saveMemberType = (type) => {
  return function (dispatch, getState) {
    dispatch(saveMemberTypeStart());
    let data = {
      name: type.name,
      status: type.status,
    };

    if (type.parentId !== null) {
      data = {
        name: type.name,
        parentId: type.parentId,
      };
    }

    data.language = type.language;
    data.status = type.status;

    axios
      .post(`memberstype`, data)
      .then((response) => {
        const resultType = response.data.data;
        dispatch(saveMemberTypeSuccess(resultType));
        dispatch(loadMemberTypes());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(saveMemberTypeError(resultError));
      });
  };
};

export const saveMemberTypeStart = () => {
  return {
    type: "CREATE_MEMBER_TYPE_START",
  };
};

export const saveMemberTypeSuccess = (resultType) => {
  return {
    type: "CREATE_MEMBER_TYPE_SUCCESS",
    resultType: resultType,
  };
};

export const saveMemberTypeError = (error) => {
  return {
    type: "CREATE_MEMBER_TYPE_ERROR",
    error: error,
  };
};

// UPDATE CATEGORY

export const updateMemberType = (type, id) => {
  return function (dispatch) {
    dispatch(updateMemberTypeStart());
    const data = {
      name: type.name,
    };

    axios
      .put(`memberstype/${id}`, data)
      .then((response) => {
        const resultType = response.data.data;
        dispatch(updateMemberTypeSuccess(resultType));
        dispatch(loadMemberTypes());
        dispatch(loadMemberType(id));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(updateMemberTypeError(resultError));
      });
  };
};

export const updateMemberTypeStart = () => {
  return {
    type: "UPDATE_MEMBER_TYPE_START",
  };
};

export const updateMemberTypeSuccess = (resultType) => {
  return {
    type: "UPDATE_MEMBER_TYPE_SUCCESS",
    resultType: resultType,
  };
};

export const updateMemberTypeError = (error) => {
  return {
    type: "UPDATE_MEMBER_TYPE_ERROR",
    error: error,
  };
};
