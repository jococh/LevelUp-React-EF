import ItemListContainer from "../components/Item/ItemListContainer";

function Productos() {
  return (
    <>
      <h1
        style={{
          color:"#b4dd13",
          textAlign:"center",
          padding:"50px 20px 10px"
        }}
      >
        Productos
      </h1>

      <ItemListContainer />
    </>
  );
}

export default Productos;