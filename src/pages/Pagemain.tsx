import { useNavigate } from "react-router-dom";

function PageMain() {
  let items = [
    { label: "600点レベル", path: "/600" },
    { label: "700点レベル", path: "/700" },
    { label: "800点レベル", path: "/800" },
    { label: "900点レベル", path: "/900" },
  ];

  const navigate = useNavigate();

  return (
    <>
      <h1>レベル選択</h1>
      <ul className="list-group">
        {items.map((item) => (
          <button
            className="list-group-item"
            key={item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </ul>
    </>
  );
}
export default PageMain;
