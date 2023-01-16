import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Tree,
  Upload,
  InputNumber,
  message,
  DatePicker,
  Space,
  DatePickerProps,
} from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";
import {
  clear as clearCat,
  loadcostTypes,
} from "../../../redux/actions/costTypeActions";
import * as actions from "../../../redux/actions/costActions";

// Lib
import base from "../../../base";
import axios from "../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { menuGenerateData } from "../../../lib/menuGenerate";
import { convertFromdata } from "../../../lib/handleFunction";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const { Dragger } = Upload;

const Add = (props) => {
  const [form] = Form.useForm();
  const [pictures, setPictures] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [sDate, setDate] = useState(null);
  const [gData, setGData] = useState([]);
  const [setProgress] = useState(0);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  // FUNCTIONS
  const init = () => {
    props.loadcostTypes();
  };

  const clear = () => {
    props.clear();
    props.clearCat();
    form.resetFields();
    setPictures([]);
    setExpandedKeys([]);
    setSelectedKeys([]);
    setCheckedKeys([]);
    setGData([]);
    setLoading(false);
  };

  // -- TREE FUNCTIONS
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  const onChange = (event) => {};

  const handleAdd = (values, status = null) => {
    if (pictures && pictures.name) values.picture = pictures.name;
    if (status === "draft") values.status = false;
    if (!values.status) values.status = true;
    if (checkedKeys && checkedKeys.length > 0) values.type = [...checkedKeys];
    else delete values.type;

    if (!values.averagePrice)
      values.averagePrice = (values.minPirce + values.maxPrice) / 2;
    console.log(values);
    const data = {
      ...values,
    };

    const sendData = convertFromdata(data);
    props.saveCost(sendData);
  };

  const handleRemove = (stType, file) => {
    let index;
    let deleteFile;
    let list;

    setPictures({});

    axios
      .delete("/imgupload", { data: { file: file.name } })
      .then((succ) => {
        toastControl("success", "Амжилттай файл устгагдлаа");
      })
      .catch((error) =>
        toastControl("error", "Файл устгах явцад алдаа гарлаа")
      );
  };

  // CONFIGS

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    fmData.append("file", file);
    try {
      const res = await axios.post("/imgupload", fmData, config);
      const img = {
        name: res.data.data,
        url: `${base.cdnUrl}${res.data.data}`,
      };
      setPictures(img);
      onSuccess("Ok");
      message.success(res.data.data + " Хуулагдлаа");
      return img;
    } catch (err) {
      toastControl("error", err);
      onError({ err });
      return false;
    }
  };

  const uploadOptions = {
    onRemove: (file) => handleRemove("pictures", file),
    fileList: pictures && pictures.name && [pictures],
    customRequest: uploadImage,
    accept: "image/*",
    name: "picture",
    maxCount: 1,
    listType: "picture",
  };

  // USEEFFECT
  useEffect(() => {
    init();
    return () => clear();
  }, []);

  useEffect(() => {
    const data = menuGenerateData(props.categories);
    setGData(data);
  }, [props.categories]);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/costs"), 2000);
    }
  }, [props.success]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Үнийн мэдээлэл нэмэх" />
        <div className="page-sub-menu"></div>
        <div className="content">
          <Loader show={loading.visible}> {loading.message} </Loader>
          <div className="container-fluid">
            <Form layout="vertical" form={form}>
              <div className="row">
                <div className="col-8">
                  <div className="card card-primary">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <Form.Item
                            label="Материалын нэр"
                            name="name"
                            rules={[requiredRule]}
                          >
                            <Input placeholder="Материалын нэр оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item
                            label="Материалын дээд үнэ"
                            name="maxPrice"
                            rules={[requiredRule]}
                          >
                            <InputNumber
                              placeholder="Материалын үнэ оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item
                            label="Материалын доод үнэ"
                            name="minPrice"
                            rules={[requiredRule]}
                          >
                            <InputNumber
                              placeholder="Материалын үнэ оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item
                            label="Материалын дундаж үнэ"
                            name="averagePrice"
                          >
                            <InputNumber
                              placeholder="Материалын дундаж үнэ оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item
                            label="нөат-гүй үнэ"
                            name="priceNotNoat"
                            rules={[requiredRule]}
                          >
                            <InputNumber
                              placeholder="Материалын үнэ оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item label="Марк/ хэмжээ" name="mark">
                            <Input
                              placeholder="Марк/ хэмжээ оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item label="Хэмжих нэгж" name="unit">
                            <Input
                              placeholder="Хэмжих нэгж оруулна уу"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Огноо"
                            name="date"
                            rules={[requiredRule]}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              onChange={(date, dateString) =>
                                setDate(dateString)
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card">
                    <div class="card-header">
                      <h3 class="card-title">ТОХИРГОО</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <Form.Item label="Идэвхтэй эсэх" name="status">
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              defaultChecked
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="control-bottons">
                        <Button
                          key="submit"
                          htmlType="submit"
                          className="add-button"
                          loading={props.loading}
                          onClick={() => {
                            form
                              .validateFields()
                              .then((values) => {
                                handleAdd(values);
                              })
                              .catch((info) => {});
                          }}
                        >
                          Нэмэх
                        </Button>
                        <Button
                          key="draft"
                          type="primary"
                          onClick={() => {
                            form
                              .validateFields()
                              .then((values) => {
                                handleAdd(values, "draft");
                              })
                              .catch((info) => {});
                          }}
                        >
                          Ноороглох
                        </Button>
                        <Button onClick={() => props.history.goBack()}>
                          Буцах
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div class="card-header">
                      <h3 class="card-title">АНГИЛАЛ</h3>
                    </div>
                    <div className="card-body">
                      <Form.Item name="type">
                        <Tree
                          checkable
                          onExpand={onExpand}
                          expandedKeys={expandedKeys}
                          autoExpandParent={autoExpandParent}
                          onCheck={onCheck}
                          checkedKeys={checkedKeys}
                          onSelect={onSelect}
                          selectedKeys={selectedKeys}
                          treeData={gData}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="card">
                    <div class="card-header">
                      <h3 class="card-title">Зураг оруулах</h3>
                    </div>
                    <div className="card-body">
                      <Dragger
                        {...uploadOptions}
                        className="upload-list-inline"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Зургаа энэ хэсэг рүү чирч оруулна уу
                        </p>
                        <p className="ant-upload-hint">
                          Нэг болон түүнээс дээш файл хуулах боломжтой
                        </p>
                      </Dragger>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    categories: state.costTypeReducer.costtypes,
    success: state.costReducer.success,
    error: state.costReducer.error,
    loading: state.costReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    loadcostTypes: () => dispatch(loadcostTypes()),
    saveCost: (data) => dispatch(actions.saveCost(data)),
    clear: () => dispatch(actions.clear()),
    clearCat: () => dispatch(clearCat()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
