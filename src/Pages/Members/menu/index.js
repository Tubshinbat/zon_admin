import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
//Hooks
import { usePathname } from "../../../hooks/use-url";

//Sub menu init data
const subItems = [
  {
    label: "Гишүүд",
    key: "/member",
  },
  {
    label: "Гишүүдын ангилал",
    key: "/member/type",
  },
];

const Index = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  const history = useHistory();
  const handleClick = (el) => {
    history.push(el.key);
  };

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={subItems}
    />
  );
};

export default Index;
