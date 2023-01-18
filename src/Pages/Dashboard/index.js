import React, { useEffect } from "react";
import { connect } from "react-redux";

// Components
import PageTitle from "../../Components/PageTitle";

// Actions
import { getCountUser, getUsers } from "../../redux/actions/userActions";
import { getCountService } from "../../redux/actions/serviceActions";
import { getCountFaq } from "../../redux/actions/faqActions";
import { getCountNews, loadNews } from "../../redux/actions/newsActions";

const Dashboard = (props) => {
  const init = () => {
    props.getCountUser();
    props.getCountNews();
    props.getCountFaq();
    props.getCountService();
    props.getUsers(`limit=6`);
    props.loadNews(`limit=6`);
  };
  const clear = () => {};
  // UseEffect's

  useEffect(() => {
    init();
    return () => {
      clear();
    };
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Хянах самбар" />
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="count-box tile-green">
                  <div className="inner">
                    <h3>{props.userTotal}</h3>
                    <p>Нийт Хэрэглэгчид</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-users"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    serviceTotal: state.serviceReducer.totalCount,
    userTotal: state.userReducer.totalCount,
    newsTotal: state.newsReducer.totalCount,
    courseTotal: state.courseReducer.totalCount,
    faqTotal: state.faqReducer.totalCount,
    orders: state.orderReducer.orders,
    users: state.userReducer.users,
    news: state.newsReducer.allNews,
    courses: state.courseReducer.courses,
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    getCountUser: () => dispatch(getCountUser()),
    getCountNews: () => dispatch(getCountNews()),
    getCountService: () => dispatch(getCountService()),
    getCountFaq: () => dispatch(getCountFaq()),
    loadNews: (query) => dispatch(loadNews(query)),
    getUsers: (query) => dispatch(getUsers(query)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(Dashboard);
