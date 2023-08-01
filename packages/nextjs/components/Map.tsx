import { use, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import mapboxgl from "mapbox-gl";
import type { NextPage } from "next";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useContractRead } from "wagmi";

console.log(useScaffoldContractRead)

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map: NextPage = () => {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  // const [lng, setLng] = useState(127);
  // const [lat, setLat] = useState(37.57);
  // const [zoom, setZoom] = useState(11);

  const { data: totalReports } = useScaffoldContractRead({
    contractName: "ERC721Token",
    functionName: "getActiveNFT",
    args: [],
  });

  console.log(totalReports)


  // const { data, isError, isLoading } = useContractRead({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   abi: wagmigotchiABI,
  //   functionName: 'getHunger',
  // })

  // console.log(data)

  const description = `
    <img class="info_image" src="/hole.png"/>
    <div class="info_box">
      <div class="info_box_title">서울시 강남구서울시 강남구서울시 강남구</div>
      <img class="enter_image" src="/right_arrow.png"/>
    </div>
  `;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    
    // console.log(data)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [127, 37.57],
      zoom: 11,
    });

 

    map.current.on("load", () => {
      map.current.addSource("information", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.99342, 37.554319],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.976833, 37.561924],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.952013, 37.532289],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.990185, 37.572204],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.985525, 37.585021],
              },
            },
          ],
        },
      });
      map.current.addSource("caution", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.955523, 37.564941],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.990168, 37.542463],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.976442, 37.52402],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.982403, 37.550141],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.995432, 37.559921],
              },
            },
          ],
        },
      });
      map.current.addSource("alert", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.98942, 37.569764],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.97592, 37.561235],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.96142, 37.5495],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.98592, 37.580321],
              },
            },
            {
              type: "Feature",
              properties: {
                description,
              },
              geometry: {
                type: "Point",
                coordinates: [126.960452, 37.540021],
              },
            },
          ],
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
          "circle-color": "#FFD25F",
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
  });

  return (
    <MapWrapper>
      <div className="map-container" ref={mapContainer} />
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
      .info_image {
        width: 142px;
        height: 142px;
        object-fit: cover;
        border-radius: 10px;
      }
      .info_box {
        margin-top: 8px;
        display: flex;
        width: 100%;
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
    .mapboxgl-popup-tip {
      display: none;
    }
  }
`;
