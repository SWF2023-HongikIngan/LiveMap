import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import mapboxgl from "mapbox-gl";
import type { NextPage } from "next";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map: NextPage = () => {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  // const [lng, setLng] = useState(127);
  // const [lat, setLat] = useState(37.57);
  // const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (map.current) return; // initialize map only once
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
                description:
                  "<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.99342, 37.554319],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.976833, 37.561924],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.952013, 37.532289],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Ballston Arts & Crafts Market</strong><p>The Ballston Arts & Crafts Market sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.990185, 37.572204],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's Seersucker Social bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
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
                description: "<strong>Event 16</strong><p>Description of Event 16</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.955523, 37.564941],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 17</strong><p>Description of Event 17</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.990168, 37.542463],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 18</strong><p>Description of Event 18</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.976442, 37.52402],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 19</strong><p>Description of Event 19</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.982403, 37.550141],
              },
            },
            {
              type: "Feature",
              properties: {
                description: `
                  <button class="test_button" onClick={testHandler}>버튼</button>
                `,
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
                description: "<strong>Event 11</strong><p>Description of Event 11</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.98942, 37.569764],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 12</strong><p>Description of Event 12</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.97592, 37.561235],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 13</strong><p>Description of Event 13</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.96142, 37.5495],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 14</strong><p>Description of Event 14</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.98592, 37.580321],
              },
            },
            {
              type: "Feature",
              properties: {
                description: "<strong>Event 15</strong><p>Description of Event 15</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [126.960452, 37.540021],
              },
            },
          ],
        },
      });

      // Add a layer showing the information.
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
      // Add a layer showing the caution.
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
      // Add a layer showing the alert.
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
    height: calc(100vh - 104px);
  }

  .mapboxgl-popup {
    max-width: 400px;
    font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
    .mapboxgl-popup-content {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.17);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: white;
      padding: 30px;
      border-radius: 20px;
      overflow: hidden;
    }
    .mapboxgl-popup-tip {
      display: none;
    }
  }
`;
