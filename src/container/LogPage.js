import "antd/dist/antd.css";
import "../App.css";
import { Link, withRouter } from "react-router-dom";
import { Layout, Table, Tag, Button, Dropdown, Menu } from "antd";
import { Component } from "react";
import MapTemp from "./MapTemp";
import axios from "axios";
import SignUp from "../component/SignUp/SignUp";
import Login from "../component/Login/Login";
import { NotificationOutlined } from "@ant-design/icons";
import { AiOutlineUser } from "react-icons/ai";
const { Header, Content, Footer } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <button
        style={{
          background: "white",
          border: "white",
        }}
        onClick={() => window.location.reload(false)}
      >
        <Link to="/detail/noti">
          New earthquake announcement: Thai Binh, Viet Nam
        </Link>
      </button>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1" disabled>
      New earthquake announcement:Tokyo, Japan
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="2" disabled>
      New earthquake announcement:New York, United States
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" disabled>
      New earthquake announcement:Mexico City, Mexico
    </Menu.Item>
  </Menu>
);
const user_menu = (
  <Menu>
    <Menu.Item key="0">
    <Login />
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
    <SignUp />
    </Menu.Item>
  </Menu>
);
function changeDate(this_date) {
  var return_date = "";
  return_date =
    this_date.getHours().toString() +
    ":" +
    this_date.getMinutes().toString() +
    ":" +
    this_date.getSeconds().toString() +
    " " +
    this_date.getDate().toString() +
    "/" +
    this_date.getMonth().toString() +
    "/" +
    this_date.getFullYear().toString();

  return return_date;
}
class LogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pagination: {
        current: 1,
        pageSize: 3,
      },
      loading: false,
      config_center: {
        lat: null,
        lng: null,
      },
    };
  }
  componentDidMount() {
    axios
      .get("https://5fa8a7c7c9b4e90016e697f4.mockapi.io/api/jishin/log")
      .then((res) => {
        const posts = res.data.map((obj) => {
          let timeLeft = "";
          const difference = obj.occure_time - Date.now() / 1000;
          if (difference > 0) {
            if (difference > 24 * 60 * 60)
              timeLeft = `${Math.floor(difference / 24 / 60 / 60)} days left`;
            else if (difference > 60 * 60)
              timeLeft = `${Math.floor(difference / 60 / 60)} hours left`;
            else if (difference > 60)
              timeLeft = `${Math.floor(difference / 60)} minutes left`;
            else timeLeft = `${difference} seconds left`;
          }
          return {
            id: obj.id,
            occure_time: `
            ${changeDate(new Date(obj.occure_time * 1000))} ${timeLeft ? "- " + timeLeft : ""
              }`,
            place: obj.place,
            strength: obj.strength,
            coord_lat: obj.coord_lat,
            coord_lng: obj.coord_long,
          };
        });
        this.setState({ posts });
      });
  }
  handleTableChange = (pagination) => {
    this.setState({
      pagination: {
        ...pagination,
      },
    });
  };
  handleChangeMap = () => {
    this.setState({
      config_center: {
        lat: 22,
        lng: 105,
      },
    });
  };

  handleCenterLocation = (x, y) => {
    this.setState({
      config_center: {
        lat: x,
        lng: y,
      },
    });
  }
  selectRow = (record) => {
    this.handleCenterLocation(record.coord_lat, record.coord_lng);
    // window.location.href = "#";
  }
  render() {
    const { posts, pagination, loading, config_center } = this.state;
    const columns = [
      {
        title: "場所",
        dataIndex: "place",
        key: "jishin_place",
        render: text => (<div><Link to={`/earth_quake/` + (posts.find(x => x.place === text).id -1).toString()}>{text}</Link></div>),
        // render: text => (<div><Link to={`/earth_quake`}>{text}</Link></div>),
      },
      {
        title: "起きる時間",
        dataIndex: "occure_time",
        key: "jishin_occure_time",
      },
      {
        title: "震度",
        dataIndex: "strength",
        key: "strength",
        render: (text) => <Tag color="red">{text}</Tag>,
      },
    ];
    var i = 0;
    var jishin_data = [];
    for (i = 0; i < posts.length - 1; i++) {
      jishin_data[i] = posts[i];
    }
    return (
      <Layout style={{ background: "#FFFFFF" }}>
        <Header
          className="site-layout-sub-header-background"
          style={{
            padding: 0,
            textAlign: "center",
            fontSize: "30px",
            color: "black",
            background: "#FFE3F2",
          }}
        >
          <span>地震情報</span>
          <Dropdown overlay={menu} placement="bottomCenter">
            <Button
              style={{
                left: 310,
                width: 10,
                background: "#FFE3F2",
                border: "white",
              }}
              icon={<NotificationOutlined style={{ fontSize: "30px" }} />}
              size="large"
            >
              <span className="badge ">1</span>
              {/* bottomRight */}
            </Button>
          </Dropdown>
          <Dropdown overlay={user_menu} placement="bottomCenter">
            <Button
              style={{
                left: 350,
                width: 10,
                background: "#FFE3F2",
                border: "white",
              }}
              icon={<AiOutlineUser style={{ fontSize: "30px" }} />}
              size="large"
            >
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px 0", minHeight: "800px" }}>
          <div>
            <MapTemp
              pagename={this.props.pagename}
              center={this.props.user_location}
              user_location={this.props.user_location}
              earthquake_data={jishin_data}
            />
          </div>
        </Content>
        <Table
          columns={columns}
          dataSource={jishin_data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
          onRow={(record) => ({
            onClick: () => {
              this.selectRow(record);
            },
          })}
        />
        <Footer style={{ textAlign: "center", background: "#FFFFFF" }}>
          開発チーム・花火
        </Footer>
      </Layout>
    );
  }
}

export default withRouter(LogPage);
