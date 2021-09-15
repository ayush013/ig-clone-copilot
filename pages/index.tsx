import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../constants";

// create an Tile component which accepts url as a prop
// it renders an image with url
// image has a class w-full h-72 object-cover

export const Tile = ({ url }) => {
  return (
    <div className="col-span-1">
      <img
        src={url.download_url}
        alt="tile"
        className="h-72 w-full object-cover"
      />
    </div>
  );
};

// create a component which looks like instagram feed
// it accepts a list of images as a prop
// it renders a list of Tile components
// each Tile component has a url prop

export const Feed = ({ images }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <Tile key={index} url={image} />
      ))}
    </div>
  );
};

// Language: typescript

// create a Home component with Inifinite Scroll
// it fetches images from the API_URL and stores them in state
// it renders a Feed component with the images
// it renders a Loader component when the state is loading
// it renders a Error component when the state is error

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const btn = useRef(null);

  // create a function which uses IntersectionObserver to load more images
  // it detects when the button is in the viewport
  // it fetches more images from the API_URL
  // it observes the the btn ref and calls the API when it is in the viewport

  const loadMore = () => {
    setLoading(true);
    fetch(`${API_URL}?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setImages((images) => [...images, ...data]);
        setPage(page + 1);
        setLoading(false);
      });
  };

  // create a function which uses IntersectionObserver to observe the btn ref
  // it detects when the button is in the viewport
  // it calls the loadMore function when it is in the viewport

  const observeBtn = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Intersecting");
          loadMore();
        }
      });
    });
    observer.observe(btn.current);

    return observer;
  };

  useEffect(() => {
    const observer = observeBtn();

    return () => observer.unobserve(btn.current);
  }, [btn, page]);

  return (
    <>
      <Feed images={images} />
      <button ref={btn}>Load more</button>
    </>
  );
};

export default Home;
