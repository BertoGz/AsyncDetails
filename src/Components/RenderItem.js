export const RenderItem = ({ item, isLoading, errorLoading,details }) => {
    if (errorLoading) {
      return (
        <div style={{ backgroundColor: "red" }}>
          <p>Error Fetching</p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div
          style={{
            marginTop:20,
            marginBottom:20,
            display: "flex",
            justifyContent: "center",
            backgroundColor: "rgb(200,200,190)",
            flexDirection: "row",
          }}
        >
          <p
            style={{
              margin: 0,
              display: "flex",
              width: "100%",
              position: "absolute",
              alignSelf: "flex-start",
            }}
          >
            {item?.index + 1}
          </p>
          <p
            style={{
              display: "flex",
              margin: 0,
              fontWeight: 800,
            }}
          >
            {item.label}(loading)
          </p>
        </div>
      );
    } else {
      const { name, worth, locations } = details || {};
      return (
        <div style={{ margin: 2, borderWidth: 10, borderColor: "black" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "lightBlue",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                margin: 0,
                display: "flex",
                width: "100%",
                position: "absolute",
                alignSelf: "flex-start",
              }}
            >
              {item?.index + 1}
            </p>
            <p
              style={{
                display: "flex",
                margin: 0,
                fontWeight: 800,
              }}
            >
              {name}
            </p>
          </div>
          <p style={{ margin: 0, backgroundColor: "lightBlue" }}>
            worth:{worth}
          </p>
          <p style={{ margin: 0, backgroundColor: "lightBlue" }}>
            locations:{locations}
          </p>
        </div>
      );
    }
  };