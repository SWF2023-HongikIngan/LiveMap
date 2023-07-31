import type { NextPage } from "next";
import Map from "~~/components/Map";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <Map />
    </>
  );
};

export default Home;
