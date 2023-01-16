import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Tree,
  Upload,
  message,
  Select,
} from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";
import { loadMenus } from "../../../redux/actions/menuActions";
import { loadFooterMenus } from "../../../redux/actions/footerMenuActions";
import { loadNewsCategories } from "../../../redux/actions/newsCategoryActions";
import * as actions from "../../../redux/actions/pageActions";
import { getExcelData as ServiceDataGet } from "../../../redux/actions/serviceActions";
import { getExcelData as PlatformDataGet } from "../../../redux/actions/platformActions";
import { getExcelData as CostDataGet } from "../../../redux/actions/costActions";
import { getExcelData as PartnerGet } from "../../../redux/actions/partnerActions";
import { getExcelData as GetPageDatas } from "../../../redux/actions/pageActions";

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
  const [pictures, setPictures] = useState([]);

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedMenu, setCheckedMenu] = useState([]);
  const [checkedFooterMenu, setCheckedFooterMenu] = useState([]);
  const [choiseData, setChoiseData] = useState();
  const [gData, setGData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [footerMenuData, setFooterMenuData] = useState([]);

  const [status, setStatus] = useState(true);
  const [newsActive, setNewsActive] = useState(false);
  const [listActive, setListActive] = useState(false);
  const [pageActive, setPageActive] = useState(false);
  const [pageParentActive, setPageParentActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modal, setModal] = useState(null);
  const [pages, setPages] = useState();
  const [setProgress] = useState(0);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  // FUNCTIONS
  const init = () => {
    props.loadFooterMenus();
    props.loadMenus();
    props.platformDataGet();
    props.serviceDataGet();
    props.costDataGet();
    props.partnerDataGet();
    props.loadNewsCategories();
    props.getPageDatas();
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setPictures([]);
    setCheckedKeys([]);
    setCheckedFooterMenu([]);
    setCheckedMenu([]);
    setGData([]);
    setMenuData([]);
    setFooterMenuData([]);
    setLoading(false);
  };

  // -- TREE FUNCTIONS

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onCheckMenu = (values) => {
    setCheckedMenu(values);
  };

  const onCheckFooterMenu = (values) => {
    setCheckedFooterMenu(values);
  };

  const handleChange = (event) => {
    form.setFieldsValue({ pageInfo: event });
  };

  const handleAdd = (values, st = null) => {
    if (pictures && pictures.length > 0) {
      const imgs = pictures.map((el) => el.name);
      values.pictures = imgs;
    }
    if (!values.status) values.status = true;
    values.status = status;
    if (st == "draft") values.status = false;

    if (checkedKeys && checkedKeys.length > 0)
      values.categories = [...checkedKeys];
    if (checkedMenu && checkedMenu.length > 0) values.menu = [...checkedMenu];
    if (checkedFooterMenu && checkedFooterMenu.length > 0)
      values.footerMenu = [...checkedFooterMenu];

    if (!values.page) {
      delete values.page;
    }
    values.pageParentActive = pageParentActive;
    values.pageActive = pageActive;
    values.listActive = listActive;
    values.newsActive = newsActive;
    values.modalActive = modalActive;
    values.choiseModal = modal;

    const data = {
      ...values,
    };

    delete values.date;

    const sendData = convertFromdata(data);
    props.savePage(sendData);
  };

  const handleRemove = (stType, file) => {
    let index;
    let deleteFile;
    let list;

    index = pictures.indexOf(file);
    deleteFile = pictures[index].name;
    list = pictures.slice();
    list.splice(index, 1);
    setPictures(list);

    axios
      .delete("/imgupload", { data: { file: deleteFile } })
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
      setPictures((bp) => [...bp, img]);
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
    fileList: [...pictures],
    customRequest: uploadImage,
    accept: "image/*",
    name: "picture",
    multiple: true,
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

  useEffect(() => {
    const data = menuGenerateData(props.menus);
    setMenuData(data);
  }, [props.menus]);

  useEffect(() => {
    const data = menuGenerateData(props.footerMenus);
    setFooterMenuData(data);
  }, [props.footerMenus]);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/pages"), 2000);
    }
  }, [props.success]);

  useEffect(() => {
    let data = [];
    switch (modal) {
      case "platforms": {
        data = props.platforms.map((platform) => ({
          value: platform._id,
          label: platform.name,
        }));
        break;
      }
      case "services": {
        data = props.services.map((service) => ({
          value: service._id,
          label: service.name,
        }));
        break;
      }
      case "costs": {
        data = props.costs.map((cost) => ({
          value: cost._id,
          label: cost.name + " " + cost.mark + "/" + cost.date,
        }));
        break;
      }
      case "partners": {
        data = props.partners.map((partner) => ({
          value: partner._id,
          label: partner.name,
        }));
        break;
      }
      default: {
        data = [];
        break;
      }
    }
    setChoiseData(data);
  }, [modal]);

  useEffect(() => {
    if (props.pages && props.pages.length > 0) {
      let data = [];
      data = props.pages.map((el) => ({
        value: el._id,
        label: el.name,
      }));
      setPages(data);
    }
  }, [props.pages]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Сайтын цэс нэмэх нэмэх" />
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
                            label="Хуудасны нэр"
                            name="name"
                            rules={[requiredRule]}
                          >
                            <Input placeholder="Сайтын хуудасны нэр оруулна уу" />
                          </Form.Item>
                        </div>
                        <div
                          className="col-12"
                          style={{
                            display:
                              pageParentActive == true ? "block" : "none",
                          }}
                        >
                          <Form.Item
                            label="Хуудастай холбох"
                            name="page"
                            rules={pageParentActive == true && [requiredRule]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              options={pages}
                            ></Select>
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Модал"
                            name="choiseModal"
                            rules={modalActive == true && [requiredRule]}
                            style={{
                              display: modalActive == true ? "block" : "none",
                            }}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="Модал сонгох"
                              onChange={(value) => setModal(value)}
                              options={[
                                {
                                  value: "platforms",
                                  label: "Платформууд",
                                },
                                {
                                  value: "services",
                                  label: "Үйлчилгээнүүд",
                                },
                                {
                                  value: "costs",
                                  label: "Үнийн мэдээлэл",
                                },
                                {
                                  value: "partners",
                                  label: "Хамтрагч компани",
                                },
                                {
                                  value: "contact",
                                  label: "Холбоо барих",
                                },
                              ]}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Холбох модалын өгөгдлүүд"
                            name="modal"
                            rules={
                              modal &&
                              modal !== "contact" &&
                              modal !== "costs" && [requiredRule]
                            }
                            style={{
                              display:
                                modal && modal != "contact" && modal !== "costs"
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="Холбох модал өгөгдлүүд"
                              options={choiseData}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Дэлгэрэнгүй"
                            name="pageInfo"
                            getValueFromEvent={(e) =>
                              e.target && e.target.getContent()
                            }
                            rules={[requiredRule]}
                          >
                            <Editor
                              apiKey="2nubq7tdhudthiy6wfb88xgs36os4z3f4tbtscdayg10vo1o"
                              init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                  "advlist autolink lists link image charmap print preview anchor",
                                  "searchreplace visualblocks code fullscreen",
                                  "insertdatetime media table paste code help wordcount image media  code  table  ",
                                ],
                                toolbar:
                                  "undo redo | fontselect fontsizeselect formatselect blockquote  | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help | link image | quickbars | media | code | tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
                                file_picker_types: "image",
                                automatic_uploads: false,
                                file_picker_callback: function (
                                  cb,
                                  value,
                                  meta
                                ) {
                                  var input = document.createElement("input");
                                  input.setAttribute("type", "file");
                                  input.setAttribute("accept", "image/*");
                                  input.onchange = async function () {
                                    var file = this.files[0];
                                    const fData = new FormData();
                                    fData.append("file", file);
                                    const res = await axios.post(
                                      "/imgupload",
                                      fData
                                    );
                                    const url =
                                      `${base.cdnUrl}` + res.data.data;
                                    cb(url);
                                  };
                                  input.click();
                                },
                              }}
                              onEditorChange={(event) => handleChange(event)}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <div className="card">
                        <div class="card-header">
                          <h3 class="card-title">САЙТЫН ҮНДСЭН ЦЭС</h3>
                        </div>
                        <div className="card-body">
                          <Form.Item name="menu">
                            <Tree
                              checkable
                              onCheck={onCheckMenu}
                              checkedKeys={checkedMenu}
                              treeData={menuData}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="card">
                        <div class="card-header">
                          <h3 class="card-title"> ХӨЛНИЙ ЦЭС</h3>
                        </div>
                        <div className="card-body">
                          <Form.Item name="footermenu">
                            <Tree
                              checkable
                              onCheck={onCheckFooterMenu}
                              checkedKeys={checkedFooterMenu}
                              treeData={footerMenuData}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="card">
                        <div class="card-header">
                          <h3 class="card-title">МЭДЭЭНИЙ АНГИЛАЛ</h3>
                        </div>
                        <div
                          className="card-body"
                          style={{
                            display: newsActive == true ? "block" : "none",
                          }}
                        >
                          <Form.Item name="type">
                            <Tree
                              checkable
                              onCheck={onCheck}
                              checkedKeys={checkedKeys}
                              treeData={gData}
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
                          <Form.Item
                            label={`Идэвхтэй эсэх`}
                            tooltip="Идэвхтэй байгаа тохиолдолд нийтэд харагдана"
                            name="status"
                          >
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              checked={status}
                              onChange={(value) => setStatus(value)}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Хуудас сонгох"
                            name="pageParentActive"
                            tooltip="Эцэг хуудас  дээр  тус хуудас жагсаалт болж харагдана"
                          >
                            <Switch
                              checkedChildren="Холбосон"
                              unCheckedChildren="Холбоогүй"
                              size="medium"
                              checked={pageParentActive}
                              onChange={(value) => {
                                setPageParentActive(value);
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Модалтой холбох"
                            name="modalActive"
                            tooltip="Платформ, Үйлчилгээ, үнийн мэдээлэл гэх мэт модалуудтай холбох боломжтой холбосоноор үүсгэсэн сайтын хуудас тэдгээр хэсэгт жагсаалт хэлбэртэй харагдана"
                          >
                            <Switch
                              checkedChildren="Холбосон"
                              unCheckedChildren="Холбоогүй"
                              size="medium"
                              checked={modalActive}
                              onChange={(value) => {
                                setModalActive(value);
                                setModal("");
                                form.setFieldValue("choiseModal", "");
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Мэдээний ангилал холбох"
                            name="newsActive"
                            tooltip="Холбосон мэдээний ангиллуудын нийтлэлүүд жагсаалт хэлбэртэй харагдана "
                          >
                            <Switch
                              checkedChildren="Холбосон"
                              unCheckedChildren="Холбоогүй"
                              size="medium"
                              checked={newsActive}
                              onChange={(value) => setNewsActive(value)}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Холбоотой цэсүүдийг жагсаалтаар харуулах"
                            name="listActive"
                            tooltip="Таны сонгосон цэс үндсэн цэс бол түүнд хамааргаадах дэд цэсүүд жагсаалт хэлбэртэй харагдана"
                          >
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              checked={listActive}
                              onChange={(value) => setListActive(value)}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Хуудсуудыг жагсаалт хэлбэртэй харуулах"
                            name="pageActive"
                            tooltip="Нэг цэс дээр 1 - ээс дээш хуудас холбосон бол тэдгээр хуудсуудыг жагсаалт хэлбэрээр харуулах боломжтой"
                          >
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              checked={pageActive}
                              onChange={(value) => setPageActive(value)}
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
                              .catch((info) => {
                                // console.log(info);
                              });
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
                              .catch((info) => {
                                // console.log(info);
                              });
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
    categories: state.newsCategoryReducer.categories,
    menus: state.menuReducer.menus,
    footerMenus: state.footerMenuReducer.footerMenus,
    success: state.pageReducer.success,
    error: state.pageReducer.error,
    loading: state.pageReducer.loading,
    services: state.serviceReducer.excelData,
    platforms: state.platformReducer.excelData,
    costs: state.costReducer.excelData,
    partners: state.partnerReducer.excelData,
    pages: state.pageReducer.excelData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    loadFooterMenus: () => dispatch(loadFooterMenus()),
    loadMenus: () => dispatch(loadMenus()),
    loadNewsCategories: () => dispatch(loadNewsCategories()),
    savePage: (data) => dispatch(actions.savePage(data)),
    serviceDataGet: (query) => dispatch(ServiceDataGet(query)),
    platformDataGet: (query) => dispatch(PlatformDataGet(query)),
    costDataGet: (query) => dispatch(CostDataGet(query)),
    partnerDataGet: (query) => dispatch(PartnerGet(query)),
    getPageDatas: (query) => dispatch(GetPageDatas(query)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
