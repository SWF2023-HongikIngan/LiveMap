import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { Button, Popover, css } from "@mui/material";
import mapboxgl from "mapbox-gl";
import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map: NextPage = () => {
  const [datas, setDatas] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<{
    level: number[];
    type: string[];
    period: "all" | "day" | "week" | "month";
  }>({
    level: [],
    type: [],
    period: "all",
  });

  const handleOptionChange = (e: any) => {
    setFilter(prev => {
      return {
        ...prev,
        period: e.target.value,
      };
    });
  };

  const { data: totalReports } = useScaffoldContractRead({
    contractName: "ERC721Token",
    functionName: "getActiveNFT",
    args: [],
  });

  const switchLevel = (level: number) => {
    setFilter(prev => {
      return {
        ...prev,
        level: prev.level.includes(level) ? prev.level.filter(l => l !== level) : [...prev.level, level],
      };
    });
  };

  const switchType = (type: string) => {
    setFilter(prev => {
      return {
        ...prev,
        type: prev.type.includes(type) ? prev.type.filter(t => t !== type) : [...prev.type, type],
      };
    });
  };

  // console.log(totalReports); // 이게 중요한 데이터
  useEffect(() => {
    if (map.current === null) return;

    map.current.removeLayer("information");
    map.current.removeLayer("caution");
    map.current.removeLayer("alert");

    if (filter.level.includes(0) === true || filter.level.length === 0) {
      map.current.addLayer({
        id: "information",
        type: "circle",
        source: "information",
        paint: {
          "circle-color": "#4992FF",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });
    }
    if (filter.level.includes(1) === true || filter.level.length === 0) {
      map.current.addLayer({
        id: "caution",
        type: "circle",
        source: "caution",
        paint: {
          "circle-color": "#F3B06C",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });
    }
    if (filter.level.includes(2) === true || filter.level.length === 0) {
      map.current.addLayer({
        id: "alert",
        type: "circle",
        source: "alert",
        paint: {
          "circle-color": "#FF4958",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });
    }
  }, [map, filter]);

  useEffect(() => {
    if (totalReports === undefined) return;

    const fetchData = async () => {
      const result = await Promise.all(
        (totalReports[0] as any).map(async (id: any, index: number) => {
          if ((totalReports[1] as any)[index].slice(0, 4) !== "http") return null;
          const data = await fetch((totalReports[1] as any)[index]).then(res => res.json());
          const address = (totalReports[2] as any)[index];
          return { id, data, address };
        }),
      );

      setDatas(result.filter(item => item !== null)); // null 값 제거
    };

    fetchData();
  }, [totalReports]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (datas.length === 0) return;

    console.log(datas);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [127, 37.57],
      zoom: 11,
    });

    console.log("1");
    map.current.on("load", () => {
      console.log("2");
      map.current.addSource("information", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: datas
            .filter(data => data.data.alertLevel === 0)
            .map(data => {
              return {
                type: "Feature",
                properties: {
                  description: `
                  <a href="/report/${data.id}" class="enter_button">
                    <div class="skeleton" id="skeleton-${data.id}"></div>
                    <img class="info_image" src=${data.data.image} onload="document.getElementById('skeleton-${data.id}').style.display='none'"/>
                    <div class="info_box">
                      <div class="info_box_title">${data.data.name}</div>
                      <img class="enter_image" src="/right_arrow.png"/>
                    </div>
                  </a>
                  `,
                },
                geometry: {
                  type: "Point",
                  coordinates: [data.data.lng, data.data.lat],
                },
              };
            }),
        },
      });

      map.current.addSource("caution", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: datas
            .filter(data => data.data.alertLevel === 1)
            .map(data => {
              return {
                type: "Feature",
                properties: {
                  description: `
                  <a href="/report/${data.id}" class="enter_button">
                    <div class="skeleton" id="skeleton-${data.id}"></div>
                    <img class="info_image" src=${data.data.image} onload="document.getElementById('skeleton-${data.id}').style.display='none'"/>
                    <div class="info_box">
                    <div class="info_box_title">${data.data.name}</div>
                      <img class="enter_image" src="/right_arrow.png"/>
                    </div>
                  </a>
                  `,
                },
                geometry: {
                  type: "Point",
                  coordinates: [data.data.lng, data.data.lat],
                },
              };
            }),
        },
      });

      map.current.addSource("alert", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: datas
            .filter(data => data.data.alertLevel === 2)
            .map(data => {
              return {
                type: "Feature",
                properties: {
                  description: `
                  <a href="/report/${data.id}" class="enter_button">
                    <div class="skeleton" id="skeleton-${data.id}"></div>
                    <img class="info_image" src=${data.data.image} onload="document.getElementById('skeleton-${data.id}').style.display='none'"/>
                    <div class="info_box">
                    <div class="info_box_title">${data.data.name}</div>
                      <img class="enter_image" src="/right_arrow.png"/>
                    </div>
                  </a>
                  `,
                },
                geometry: {
                  type: "Point",
                  coordinates: [data.data.lng, data.data.lat],
                },
              };
            }),
        },
      });

      map.current.addLayer({
        id: "information",
        type: "circle",
        source: "information",
        paint: {
          "circle-color": "#4992FF",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });
      map.current.addLayer({
        id: "caution",
        type: "circle",
        source: "caution",
        paint: {
          "circle-color": "#F3B06C",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });
      map.current.addLayer({
        id: "alert",
        type: "circle",
        source: "alert",
        paint: {
          "circle-color": "#FF4958",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.30)",
        },
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({ closeButton: false });

      map.current.on("click", ["information", "caution", "alert"], (e: any) => {
        // Change the cursor style as a UI indicator.
        map.current.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });
      map.current.on("mouseenter", ["information", "caution", "alert"], () => {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", ["information", "caution", "alert"], () => {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, [datas, filter]);

  return (
    <MapWrapper>
      <div className="map-container" ref={mapContainer} />
      <Filter aria-describedby={id} variant="contained" onClick={handleClick}>
        {open === true ? (
          <Image src="/icon_CloseFilled.png" height={24} width={24} alt="filter" />
        ) : (
          <Image src="/icon_filter.png" height={24} width={24} alt="filter" />
        )}
      </Filter>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              width: "316px",
              backgroundColor: "white",
            },
          },
        }}
      >
        <FilterBox>
          <FilterTitle>위험도</FilterTitle>
          <LevelBox>
            <LevelButton level={0} isSelected={filter.level.includes(0)} onClick={() => switchLevel(0)}>
              정보
            </LevelButton>
            <LevelButton level={1} isSelected={filter.level.includes(1)} onClick={() => switchLevel(1)}>
              주의
            </LevelButton>
            <LevelButton level={2} isSelected={filter.level.includes(2)} onClick={() => switchLevel(2)}>
              경고
            </LevelButton>
          </LevelBox>
          <FilterTitle>재난 종류</FilterTitle>
          <TypeBox>
            <TypeButton
              type={"heavyrain"}
              isSelected={filter.type.includes("heavyrain")}
              onClick={() => switchType("heavyrain")}
            >
              호우
            </TypeButton>
            <TypeButton type={"fire"} isSelected={filter.type.includes("fire")} onClick={() => switchType("fire")}>
              화재
            </TypeButton>
            <TypeButton type={"flood"} isSelected={filter.type.includes("flood")} onClick={() => switchType("flood")}>
              침수
            </TypeButton>
            <TypeButton
              type={"collapse"}
              isSelected={filter.type.includes("collapse")}
              onClick={() => switchType("collapse")}
            >
              붕괴
            </TypeButton>
          </TypeBox>
          <FilterTitle>날짜</FilterTitle>
          <DateBox>
            <label>
              <input type="radio" value="all" checked={filter.period === "all"} onChange={handleOptionChange} />
              전체
            </label>
            <label>
              <input type="radio" value="day" checked={filter.period === "day"} onChange={handleOptionChange} />
              하루
            </label>
            <label>
              <input type="radio" value="week" checked={filter.period === "week"} onChange={handleOptionChange} />
              일주일 전
            </label>
            <label>
              <input type="radio" value="month" checked={filter.period === "month"} onChange={handleOptionChange} />
              한달 전
            </label>
          </DateBox>
        </FilterBox>
      </Popover>
    </MapWrapper>
  );
};

export default Map;

const MapWrapper = styled.div`
  .map-container {
    width: 100%;
    height: 100vh;
  }

  .mapboxgl-popup {
    font-size: 12px/20px;
    .mapboxgl-popup-content {
      max-width: 158px;
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: white;
      padding: 8px;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .enter_button {
        display: block;
        max-width: 158px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .skeleton {
          position: absolute;
          width: 142px;
          height: 142px;
          display: block;
          object-fit: cover;
          border-radius: 10px;
          top: 8px;
          background-color: #ccc; /* 스켈레톤의 배경색 */
        }

        .info_image {
          width: 142px;
          height: 142px;
          display: block;
          object-fit: cover;
          border-radius: 10px;
        }
        .info_box {
          margin-top: 8px;
          display: flex;
          width: 100%;
          padding: 0 5px 0 10px;
          justify-content: space-between;

          .info_box_title {
            color: #000;
            font-size: 12px;
            line-height: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .enter_image {
            width: 24px;
            height: 24px;
            object-fit: cover;
          }
        }
      }
    }
    .mapboxgl-popup-tip {
      display: none;
    }
  }
`;

const Filter = styled(Button)`
  position: absolute;
  right: 20px;
  bottom: 50px;
  border-radius: 50px;
  box-shadow: 0px 1px 18px 0px rgba(0, 0, 0, 0.12), 0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 3px 5px -1px rgba(0, 0, 0, 0.2);
  width: 64px;
  height: 64px;
`;

const FilterBox = styled.div`
  padding: 20px;
`;

const FilterTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const LevelBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
`;

const LevelButton = styled.div<{ level: number; isSelected: boolean }>`
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;

  ${props => {
    const { level, isSelected } = props;
    switch (level) {
      case 0:
        return isSelected
          ? css`
              color: white;
              background-color: #5c90f7;
              border: 1px solid #5c90f7;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-bottom: 1px;
                border-radius: 50%;
                background-color: white;
                margin-right: 5px;
              }
            `
          : css`
              border: 1px solid #666666;
              color: #666;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-bottom: 1px;
                border-radius: 50%;
                background-color: #5c90f7;
                margin-right: 5px;
              }
            `;
      case 1:
        return isSelected
          ? css`
              color: white;
              background-color: #f3af6c;
              border: 1px solid #f3af6c;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                margin-bottom: 1px;
                height: 8px;
                border-radius: 50%;
                background-color: white;
                margin-right: 5px;
              }
            `
          : css`
              border: 1px solid #666666;
              color: #666;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                margin-bottom: 1px;
                height: 8px;
                border-radius: 50%;
                background-color: #f3af6c;
                margin-right: 5px;
              }
            `;
      case 2:
        return isSelected
          ? css`
              color: white;
              background-color: #eb585e;
              border: 1px solid #eb585e;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                margin-bottom: 1px;
                height: 8px;
                border-radius: 50%;
                background-color: white;
                margin-right: 5px;
              }
            `
          : css`
              border: 1px solid #666666;
              color: #666;
              &:before {
                content: "";
                display: inline-block;
                width: 8px;
                margin-bottom: 1px;
                height: 8px;
                border-radius: 50%;
                background-color: #eb585e;
                margin-right: 5px;
              }
            `;
    }
  }}
`;

const TypeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
`;

const TypeButton = styled.div<{ type: string; isSelected: boolean }>`
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #ee845e;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => {
    const { type, isSelected } = props;
    switch (type) {
      case "heavyrain":
        return isSelected
          ? css`
              color: white;
              background-color: #ee845e;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_heavyrain_select.png");
                background-size: cover;
                margin-right: 3px;
              }
            `
          : css`
              color: #ff7d54;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_heavyrain.png");
                background-size: cover;
                margin-right: 3px;
              }
            `;
      case "fire":
        return isSelected
          ? css`
              color: white;
              background-color: #ee845e;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_fire_select.png");
                background-size: cover;
                margin-right: 3px;
              }
            `
          : css`
              border: 1px solid #ff7d54;
              color: #ff7d54;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_fire.png");
                background-size: cover;
                margin-right: 3px;
              }
            `;
      case "flood":
        return isSelected
          ? css`
              color: white;
              background-color: #ee845e;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_flood_select.png");
                background-size: cover;
                margin-right: 3px;
              }
            `
          : css`
              color: #ff7d54;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_flood.png");
                background-size: cover;
                margin-right: 3px;
              }
            `;
      case "collapse":
        return isSelected
          ? css`
              color: white;
              background-color: #ee845e;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_collapse_select.png");
                background-size: cover;
                margin-right: 3px;
              }
            `
          : css`
              color: #ff7d54;
              &:before {
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 1px;
                background-image: url("/filter_icon/icn_collapse.png");
                background-size: cover;
                margin-right: 3px;
              }
            `;
    }
  }}
`;

const DateBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    margin-right: 5px;
    bottom: -1px;
    position: relative;
  }
`;
