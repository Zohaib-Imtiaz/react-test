import { Col, Input, Row } from "antd";
import fetchJsonp from "fetch-jsonp";
import { useCallback, useEffect, useRef, useState } from "react";
import FlickrCard from "../../../components/FlickrCard/FlickrCard";

const Gallery = () => {
  const [pictures, setPictures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const updatePictures = (items) => {
    const cardsData = items.map((item) => {
      const description = item.description
        .replace(/<[^>]+>/g, "")
        .split("posted a photo:")[1];
      return {
        title: item.title,
        description,
        imageSource: item.media.m,
        link: item.link,
      };
    });
    setPictures((prevState) => [...prevState, ...cardsData]);
  };

  const fetchImagesFromFlicker = useCallback(() => {
    fetchJsonp(
      `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${searchTerm}`,
      { jsonpCallback: "jsoncallback" }
    )
      .then((res) => res.json())
      .then(({ items }) => updatePictures(items))
      .catch(() => console.log("SEARCH_FAILURE"));
  }, [searchTerm]);

  const search = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScroll = useCallback(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      fetchImagesFromFlicker();
    }
  }, [fetchImagesFromFlicker]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    fetchImagesFromFlicker();
  }, [fetchImagesFromFlicker]);

  return (
    <>
      <Row align={"middle"} justify={"center"}>
        <Col span={24}>
          {/* <Row align={"middle"} justify={"center"} gutter={[24, 24]}>
            <Input placeholder="search pictures" onChange={search} />
          </Row> */}
          <Row align={"middle"} justify={"center"} gutter={[24, 24]}>
            {pictures.map((picture, index) => {
              return (
                <Col key={index}>
                  <FlickrCard
                    title={picture.title}
                    description={picture.description}
                    cover={picture.imageSource}
                    flickrLink={picture.link}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Gallery;
