import "nprogress/nprogress.css";
import "../styles/globals.css";
import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>Airbnb-ish</title>
        <meta
          name="description"
          content="Find holiday rentals, cabins, beach houses, unique homes and experiences around the world – all made possible by Hosts on Airbnb."
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

{
  /* deeyes36acfed */
}

import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Explore from "../components/Explore";
import Banner from "../components/Banner";
import Cards from "../components/Cards";
import Hosting from "../components/Hosting";
import Footer from "../components/Footer";
import { live, discover } from "../data";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Explore />
        <Banner />
        <Cards {...live} />
        <Cards {...discover} />
        <Hosting />
      </main>

      <Footer />
    </>
  );
}
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchResults from "../components/SearchResults";
import Map from "../components/Map";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useState } from "react";
import getCenter from "geolib/es/getCenter";

export default function Search({ searchResults }) {
  const router = useRouter();
  const placeholder = `${router.query.location} | ${format(
    new Date(router.query.checkIn),
    "d MMM, yy"
  )} | ${format(new Date(router.query.checkIn), "d MMM, yy")} | ${
    router.query.guests
  } guests`;
  const [selectedLocation, setSelectedLocation] = useState({});

  const coordinates = [...searchResults].slice(1).map((result) => ({
    longitude: result.long,
    latitude: result.lat,
  }));
  const center = getCenter(coordinates);

  const [viewport, setViewport] = useState({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });
  return (
    <>
      <Header placeholder={placeholder} />
      <main>
        <Map
          results={searchResults}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          viewport={viewport}
          setViewport={setViewport}
        />
        <SearchResults
          setSelectedLocation={setSelectedLocation}
          results={searchResults}
          setViewport={setViewport}
        />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const searchResults = await fetch("https://links.papareact.com/isz").then(
    (data) => data.json()
  );
  return {
    props: {
      searchResults,
    },
  };
}



import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const setInitialTheme = `
      const isDark = window.localStorage.getItem('airbnbTheme') ? (window.localStorage.getItem('airbnbTheme') === 'dark') : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.body.classList.add('dark');
      }
    `;
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

import styled from "styled-components";
import Image from "next/image";

export default function Banner() {
  return (
    <BannerSection>
      <span>
        <h2>Not sure where to go? Perfect.</h2>
        <a href="#" className="btn btn-dark">
          {"I'm flexible"}
        </a>
      </span>
    </BannerSection>
  );
}

const BannerSection = styled.section`
  padding: 6rem var(--sidePadding);
  background: url(/images/banner.jpg);
  background-size: cover;
  border-radius: 1rem;
  color: var(--brown);
  span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: var(--maxWidth);
  }
  h2 {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
    font-weight: 800;
  }
  .btn.btn-dark {
    --bgcolor: var(--brown);
    --color: var(--yellow);
  }
  @media (max-width: 36rem) {
    aspect-ratio: 0.75;
    background: url(images/banner-sm.jpg);
    background-size: cover;
    background-position: center;
    span {
      align-items: center;
      text-align: center;
    }
  }
`
import styled from "styled-components";
import Image from "next/image";

export default function Cards({ title, items, urlPrefix }) {
  return (
    <CardsSection length={items.length}>
      <h2>{title}</h2>

      <div className="cards">
        {items.map((item, index) => (
          <div key={index} className="card">
            <div className="img">
              <Image
                width={128}
                height={128}
                alt={item.title}
                src={urlPrefix + item.img}
                className="shadow"
              />
              <Image
                width={256}
                height={256}
                alt={item.title}
                src={urlPrefix + item.img}
              />
            </div>
            <span>
              <h3>{item.title}</h3>
              {item.p && <p>{item.p}</p>}
            </span>
          </div>
        ))}
      </div>
    </CardsSection>
  );
}

const CardsSection = styled.section`
  .cards {
    display: grid;
    grid-template-columns: repeat(${(props) => props.length}, 1fr);
    gap: 1.5rem;
    margin-bottom: -1.5rem;
    padding: 1.5rem 0;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      display: none;
    }
  }
  .card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    span {
      margin-top: 0.75rem;
      h3 {
        font-size: 1.25rem;
      }
    }
    img {
      border-radius: 1rem;
      width: 100%;
      transition: all 0.2s;
    }
    &:hover img {
      transform: scale(0.95);
    }
    .img {
      position: relative;
      & > div:first-child {
        position: absolute !important;
        overflow: visible !important;
        width: 100%;
      }
      & > div {
        width: 100%;
      }
    }
    .shadow {
      position: absolute;
      filter: blur(1rem) brightness(80%);
      transform: translateY(0.5rem) scaleX(0.9);
      z-index: -1;
      opacity: 0.6;
    }
  }
  @media (max-width: 36rem) {
    .cards {
      grid-template-columns: repeat(${(props) => props.length}, 80%);
      grid-template-rows: 1fr;
      overflow: scroll;
      margin: 0 -1.5rem -1.5rem -1.5rem;
      padding: 1.5rem;
      scroll-snap-type: x mandatory;
      scroll-padding-left: 1.5rem;
    }
    .card {
      scroll-snap-align: start;
      span {
        margin-top: 0.5rem;
        h3 {
          line-height: 1.3;
        }
        p {
          margin-top: 0.25rem;
        }
      }
    }
    .card:last-of-type {
      margin-right: 10rem;
    }
    .card:last-of-type {
      border-right: 1.5rem solid transparent;
      width: calc(100% + 1.5rem);
    }
  }
`;
import { useState, useEffect, useRef } from "react";
import { DateRange, DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styled from "styled-components";
import { useMediaQuery } from "@react-hook/media-query";
import NumberInput from "./NumberInput";

export default function DatePicker({
  close,
  checkInDate,
  checkOutDate,
  numberOfAdults,
  numberOfChildren,
}) {
  const [visible, setVisible] = useState(false);

  const isSmallScreen = useMediaQuery("(max-width: 36rem)");

  const selectionRange = {
    startDate: checkInDate.value,
    endDate: checkOutDate.value,
    key: "selection",
  };

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    return () => setVisible(false);
  }, []);

  function handleSelect(ranges) {
    checkInDate.setValue(ranges.selection.startDate);
    checkOutDate.setValue(ranges.selection.endDate);
  }

  const options = {
    rangeColors: ["#e0565b"],
    ranges: [selectionRange],
    minDate: new Date(),
    onChange: handleSelect,
  };

  return (
    <Container className={visible ? "visible" : null}>
      <div className="inner">
        <h4 style={{ marginBottom: "1.5rem" }}>
          Pick Check-in & Check-out dates
        </h4>
        {isSmallScreen ? (
          <DateRange {...options} />
        ) : (
          <DateRangePicker {...options} />
        )}

        <div className="guests">
          <h4>Add guests</h4>
          <div className="inputs">
            <NumberInput
              name="Adults"
              value={numberOfAdults.value}
              setValue={numberOfAdults.setValue}
            />
            <NumberInput
              name="Children"
              value={numberOfChildren.value}
              setValue={numberOfChildren.setValue}
            />
          </div>
        </div>

        <button className="close button" onClick={close}>
          Close
        </button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  padding: 13.5rem var(--sidePadding) 3rem;
  transform: translate(-50%, -100%);
  overflow: hidden;
  max-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--white);
  border-bottom: 2px solid var(--gray);
  box-shadow: 0 3rem 3rem -5rem var(--dark);
  z-index: -1;
  transition: all 0.2s;
  .button {
    transition: transform 0.2s;
    cursor: pointer;
    &:hover,
    &:focus {
      transform: scale(0.95);
      box-shadow: 0 0 0 1px currentColor;
    }
    &:disabled {
      opacity: 0.5;
      box-shadow: none;
    }
  }
  .guests {
    width: 100%;
    padding-top: 3rem;
  }
  .inputs {
    display: flex;
    padding-top: 1rem;
  }
  .inner {
    width: 100%;
    max-width: 720px;
    height: fit-content;
    max-height: calc(100vh - 18rem);
    overflow: scroll;
    opacity: 0;
    transition: opacity 0.5s 0.2s;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
      -webkit-appearance: none;
    }
  }
  .close {
    position: absolute;
    top: 0;
    right: 0.5rem;
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    background: #ff585d20;
    color: var(--red);
    border-radius: 99px;
  }
  &.visible {
    transform: translate(-50%, 0);
    .inner {
      opacity: 1;
    }
  }
  .rdrDateRangePickerWrapper {
    display: flex;
    justify-content: space-between;
  }
  .rdrDateDisplayWrapper {
    background: none;
  }
  .rdrDayDisabled {
    background-color: var(--light);
  }
  .rdrDateDisplayItem {
    border-radius: 99px;
    background-color: var(--light);
    input {
      color: var(--dark);
    }
  }
  .rdrDefinedRangesWrapper {
    border: none;
    border-radius: 1rem;
  }
  .rdrCalendarWrapper {
    background: none;
    color: var(--dark);
  }
  .rdrStaticRange {
    border: none;
    background: none;
    &:hover,
    &:focus {
      .rdrStaticRangeLabel {
        background: var(--gray);
      }
    }
  }
  .rdrDefinedRangesWrapper {
    margin-right: 1.5rem;
    padding-top: 0.75rem;
    background: var(--light);
  }
  .rdrDayNumber span {
    color: var(--dark);
  }
  .rdrDayPassive .rdrDayNumber span {
    color: var(--dark);
    opacity: 0.33;
  }
  .rdrDayToday .rdrDayNumber span:after {
    background: var(--red);
  }
  @media (max-width: 36rem) {
    padding-top: 7.5rem;
    overflow: scroll;
    height: 100vh;
    .rdrCalendarWrapper {
      font-size: 11px;
    }
    .inner {
      height: 100%;
      max-height: unset;
      overflow: scroll;
      padding-bottom: 10rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: fit-content;
    }
    h4 {
      width: 100%;
    }
    .close {
      top: auto;
      bottom: -3.5rem;
      right: 0;
      margin: 0 auto;
      display: block;
      position: relative;
    }
    .inputs {
      flex-direction: column;
      gap: 1rem;
    }
  }
  @media (min-width: 48rem) {
    .rdrDefinedRangesWrapper {
      font-size: 16px;
    }
    .rdrCalendarWrapper {
      font-size: 16px;
    }
  }
  @media (min-width: 36rem) and (max-width: 48rem) {
    .rdrCalendarWrapper {
      margin: 0 auto;
    }
  }
`
import styled from "styled-components";
import Image from "next/image";
import { places } from "../data";

export default function Explore() {
  return (
    <ExploreSection>
      <h2>Explore nearby</h2>
      <div className="items">
        {places.map((item, index) => (
          <div key={index} className="item">
            <div className="img">
              <Image
                width={64}
                height={64}
                alt={item.name}
                src={`/images/explore/${index + 1}.jpg`}
                className="shadow"
              />
              <Image
                width={128}
                height={128}
                alt={item.name}
                src={`/images/explore/${index + 1}.jpg`}
              />
            </div>
            <span>
              <h3>{item.name}</h3>
              <p>{item.time}-hour drive</p>
            </span>
          </div>
        ))}
      </div>
    </ExploreSection>
  );
}

const ExploreSection = styled.section`
  .items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(239px, 1fr));
    gap: 1.5rem;
    margin-bottom: -1.5rem;
    padding: 1.5rem 0;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      display: none;
    }
  }
  .item {
    display: flex;
    align-items: center;
    border-radius: 1rem;
    transition: all 0.2s;
    cursor: pointer;
    span {
      padding: 0 1.5rem;
      white-space: nowrap;
      transition: padding 0.2s;
    }
    .img {
      position: relative;
      width: 5rem;
      height: 5rem;
      img {
        border-radius: 1rem;
        transition: transform 0.2s;
        width: 100%;
      }
      & > div:first-child {
        position: absolute !important;
        overflow: visible !important;
      }
      & > div {
        width: 100%;
      }
      img.shadow {
        filter: blur(0.5rem) brightness(80%);
        transform: translateY(0.25rem) scaleX(0.9);
        z-index: -1;
        opacity: 0.6;
      }
    }
    &:hover {
      background: var(--white);
      box-shadow: 0 0.25rem 0.5rem #48484810;
      img.shadow {
        transform: translateY(0) scale(0);
      }
      img {
        transform: scale(0.8);
      }
      span {
        padding: 0 2.5rem 0 0.5rem;
      }
    }
  }
  @media (max-width: 36rem) {
    .items {
      grid-template-columns: repeat(4, 1fr);
      overflow: scroll;
      margin: 0 -1.5rem -1.5rem -1.5rem;
      padding: 1.5rem;
      scroll-snap-type: x mandatory;
      scroll-padding-left: 1.5rem;
    }
    .item {
      scroll-snap-align: start;
    }
    .item:last-of-type {
      margin-right: 10rem;
    }
  }
`;

import styled from "styled-components";
import Image from "next/image";
import { Globe, DollarSign, Facebook, Twitter, Instagram } from "react-feather";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <FooterSection>
      <div className="footerInner">
        <span>
          <h2>About</h2>
          <ul>
            <li>How Airbnb works</li>
            <li>Newsroom</li>
            <li>Airbnb 2021</li>
            <li>Investors</li>
            <li>Airbnb Plus</li>
            <li>Airbnb Luxe</li>
            <li className="lg-hidden">HotelTonight</li>
            <li className="lg-hidden">Airbnb for Work</li>
            <li className="lg-hidden">Made possible by Hosts</li>
            <li className="lg-hidden">Careers</li>
            <li className="lg-hidden">Founders&apos; Letter</li>
          </ul>
        </span>
        <span>
          <h2>Community</h2>
          <ul>
            <li>Diversity & Belonging</li>
            <li>Accessibility</li>
            <li>Airbnb Associates</li>
            <li>Frontline Stays</li>
            <li>Guest Referrals</li>
            <li>Airbnb.org</li>
          </ul>
        </span>
        <span>
          <h2>Host</h2>
          <ul>
            <li>Host your home</li>
            <li>Host an Online Experience</li>
            <li>Host an Experience</li>
            <li>Responsible hosting</li>
            <li>Resource Centre</li>
            <li>Community Centre</li>
          </ul>
        </span>
        <span>
          <h2>Support</h2>
          <ul>
            <li>Our COVID-19 Response</li>
            <li>Help Centre</li>
            <li>Cancellation options</li>
            <li>Neighbourhood Support</li>
            <li>Trust & Safety</li>
          </ul>
        </span>
        <span className="footer-bottom">
          <p>
            <ThemeToggle text />
          </p>
          <p>
            <span>
              <Globe className="globe" />
              English
            </span>
            <span>
              <DollarSign className="dollar" />
              USD
            </span>
            <span>
              <Facebook />
            </span>
            <span>
              <Twitter />
            </span>
            <span>
              <Instagram />
            </span>
          </p>
          <p>
            &copy; 2021{" "}
            <a href="https://dashsantosh.me" target="_blank" rel="noreferrer">
              Dash Santosh
            </a>
          </p>
        </span>
      </div>
    </FooterSection>
  );
}

const FooterSection = styled.footer`
  padding: 3rem var(--sidePadding);
  background: var(--gray);
  border-top: 1px solid #0002;
  h2 {
    font-size: 1rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    font-weight: 800;
  }
  .footerInner {
    & > span {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 0;
    }
    & > span + span {
      border-top: 1px solid #0002;
    }
    & > span:first-of-type {
      padding-top: 0;
    }
    & > span:last-of-type {
      padding-bottom: 0;
    }
    ul {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      li {
        padding: 0.25rem 0;
        font-size: 0.85rem;
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.2s;
        width: fit-content;
        &:hover {
          opacity: 1;
          text-decoration: underline;
        }
      }
    }
    .footer-bottom {
      display: flex;
      flex-direction: row-reverse;
      align-items: flex-end;
      justify-content: space-between;
      a {
        margin-left: 0.5rem;
      }
      a:hover {
        text-decoration: underline;
        color: var(--red);
      }
      svg {
        height: 1rem;
      }
      svg.globe {
        margin-right: 0.1rem;
      }
      svg.dollar {
        margin-right: -0.1rem;
      }
      span + span {
        margin-left: 1rem;
      }
      p,
      span {
        display: flex;
        align-items: center;
      }
    }
  }
  @media (max-width: 36rem) {
    .footerInner .footer-bottom {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
  }
  @media (min-width: 81rem) {
    .footerInner {
      display: flex;
      flex-flow: row wrap;
      max-width: 1200px;
      margin: 0 auto;
      justify-content: space-between;
      .footer-bottom {
        flex: 0 0 100%;
        padding-top: 1.5rem;
        margin-top: 1.5rem;
      }
      .lg-hidden {
        display: none;
      }
      & > span:not(.footer-bottom) {
        padding: 0;
        border-top: none !important;
      }
    }
  }
`;


import styled from "styled-components";
import { Search, Globe, Menu, User } from "react-feather";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import DatePicker from "./DatePicker";
import ThemeToggle from "./ThemeToggle";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/router";
import MobileNav from "./MobileNav";
export default function Header({ placeholder }) {
  const router = useRouter();

  const navRef = useRef(null);
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const primaryLocationRef = useRef(null);
  const secondaryLocationRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width: 36rem)");

  //form data

  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [numberOfAdults, setNumberOfAdults] = useState(0);
  const [numberOfChildren, setNumberOfChildren] = useState(0);

  const openDatePicker = () => {
    setInputFocus(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (!isSmallScreen && secondaryLocationRef.current) {
        secondaryLocationRef.current.focus();
      }
    }, 10);
  };
  const closeDatePicker = () => {
    setInputFocus(false);
    setLocation("");
    setNumberOfChildren(0);
    setNumberOfAdults(0);
    setCheckInDate(new Date());
    setCheckOutDate(new Date());
    document.body.style.overflow = "initial";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      primaryLocationRef.current.focus();
      return;
    }
    router.push({
      pathname: "/search",
      query: {
        location: location,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: numberOfChildren + numberOfAdults,
      },
    });
    setTimeout(() => closeDatePicker(), 100);
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (!headerRef.current.contains(event.target)) {
        closeDatePicker();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderSection
      ref={headerRef}
      className={[
        scrolled || inputFocus || router.pathname !== "/" ? "scrolled" : null,
        inputFocus ? "inputFocus" : null,
      ]}
    >
      <div className="headerInner">
        <div className="logo" onClick={() => router.push("/")}>
          <svg
            viewBox="0 0 256 276"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M238 223.1a41 41 0 01-46 35c-7-.8-13.8-3-21-7.1-10-5.5-19.8-14-31.4-26.8 18.2-22.3 29.2-42.7 33.4-61 1.9-8.5 2.2-16.2 1.3-23.4a44.7 44.7 0 00-7.4-18.7 46.5 46.5 0 00-38.9-19.6c-16 0-30.3 7.4-38.9 19.6a44.8 44.8 0 00-7.4 18.7 57.3 57.3 0 001.3 23.5c4.2 18.2 15.5 38.9 33.4 61.2A123.8 123.8 0 0185 251.3c-7.2 4.1-14.1 6.3-21 7.1a41 41 0 01-46-35c-.9-6.9-.3-13.8 2.4-21.5.9-2.8 2.2-5.5 3.6-8.8l6.4-13.8.2-.6c19-41 39.5-83 60.7-123.8l.8-1.7 6.7-12.7c2.2-4.4 4.6-8.5 7.7-12a28.8 28.8 0 0144.1 0c3 3.5 5.5 7.6 7.7 12 2.2 4.2 4.4 8.6 6.7 12.7l.8 1.7c21 41 41.4 83 60.4 124.1v.3c2.2 4.4 4.1 9.4 6.3 13.8 1.4 3.3 2.8 6 3.6 8.8 2.2 7.2 3 14 2 21.2zm-110-13c-14.9-18.7-24.6-36.3-27.9-51.2a44.5 44.5 0 01-.8-16.9c.6-4.4 2.2-8.2 4.4-11.5 5.3-7.5 14-12.2 24.3-12.2 10.2 0 19.3 4.4 24.3 12.2 2.2 3.3 3.8 7.1 4.4 11.5.8 5 .5 10.8-.8 16.9-3.4 14.6-13 32.2-27.9 51.3zm124.4-14.3l-4.2-10-6.3-14-.3-.2c-19-41.4-39.4-83.3-61-124.7l-.8-1.7c-2.2-4.1-4.4-8.5-6.6-13-2.7-4.9-5.5-10.1-9.9-15.1a44.5 44.5 0 00-35-17.1C114.5 0 102 6 93 16.6a95 95 0 00-10 15.1l-6.6 13-.8 1.6c-21.2 41.4-42 83.3-61 124.7l-.2.6-6.4 14c-1.4 3-2.7 6.4-4.1 10a58.6 58.6 0 0062 79.4 72.8 72.8 0 0027.6-9.4c11.3-6.3 22-15.4 34.2-28.7a144.9 144.9 0 0034.2 28.7 72.9 72.9 0 0034.8 10 58.5 58.5 0 0058.2-50.2 52.1 52.1 0 00-2.5-29.6z"
              fill="currentColor"
            />
          </svg>
          <span>airbnb</span>
        </div>
        <nav ref={navRef}>
          <a href="#" className="active">
            Places to stay
          </a>
          <a href="#">Experiences</a>
          <a href="#">Online Experiences</a>
        </nav>
        <MobileNav />
        <form className="search">
          <input
            type="text"
            ref={primaryLocationRef}
            placeholder={placeholder ? placeholder : "Where are you going?"}
            onFocus={openDatePicker}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {inputFocus && (
            <div className="overlay">
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  value={location}
                  ref={secondaryLocationRef}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you going?"
                />
              </div>

              <div className="field">
                <label>Check-in</label>
                <input disabled placeholder="Add dates" value={checkInDate} />
              </div>

              <div className="field">
                <label>Check-out</label>
                <input disabled placeholder="Add dates" value={checkOutDate} />
              </div>

              <div className="field">
                <label>Guests</label>
                <span className="guestNumber">
                  {numberOfChildren || numberOfAdults ? (
                    <p>{numberOfAdults + numberOfChildren} guests</p>
                  ) : (
                    <p className="empty">Add guests</p>
                  )}
                </span>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={
              inputFocus &&
              !(
                location &&
                checkInDate &&
                checkOutDate &&
                (numberOfAdults || numberOfChildren)
              )
            }
            onClick={handleSubmit}
            aria-label="search places"
          >
            <Search />
            <span>Search</span>
          </button>
        </form>
        {inputFocus && (
          <DatePicker
            className="datepicker"
            close={closeDatePicker}
            checkInDate={{ value: checkInDate, setValue: setCheckInDate }}
            checkOutDate={{ value: checkOutDate, setValue: setCheckOutDate }}
            numberOfAdults={{
              value: numberOfAdults,
              setValue: setNumberOfAdults,
            }}
            numberOfChildren={{
              value: numberOfChildren,
              setValue: setNumberOfChildren,
            }}
          />
        )}

        <div className="profile">
          <a href="#">Become a host</a>
          <ThemeToggle icon />
          <a href="#" className="globe">
            <Globe />
          </a>
          <div className="user">
            <Menu className="menu" />
            <User className="userIcon" />
          </div>
        </div>
      </div>
    </HeaderSection>
  );
}

const HeaderSection = styled.header`
  position: fixed;
  top: 0;
  color: #fafafc;
  padding: 1.5rem var(--sidePadding);
  width: 100%;
  z-index: 10;
  transition: background 0.2s, border-bottom 0.2s;
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--light);
    border-radius: 99px;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    transition: all 0.2s;
    label,
    input,
    .guestNumber {
      background: none;
      font-size: 14px;
      border: none;
      line-height: 1.5;
      display: block;
      color: var(--dark);
      outline: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    input {
      width: 100%;
      font-weight: 700;
      &::placeholder {
        color: var(--dark);
        font-weight: 400;
        opacity: 0.5;
      }
    }
    .guestNumber {
      font-weight: 700;
      .empty {
        color: var(--dark);
        font-weight: 400;
        opacity: 0.5;
      }
    }
    .field {
      width: 100%;
      padding: 0.5rem 1.5rem;
      border-radius: 99px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: background 0.2s;
      position: relative;
      & + .field::before {
        position: absolute;
        content: "";
        width: 2px;
        height: 2rem;
        background: var(--gray);
        border-radius: 2px;
        left: 0;
        transition: transform 0.2s;
      }
      &:hover,
      &:focus-within {
        background: var(--gray);
      }
      &:last-of-type {
        padding-right: 10rem;
      }
    }
  }
  .overlay:hover .field::before,
  .overlay:focus-within .field::before {
    transform: scale(0);
  }
  .user,
  .profile,
  .logo,
  .globe,
  nav {
    display: flex;
    align-items: center;
  }
  .headerInner {
    max-width: var(--containerWidth);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
  }
  & > div {
    flex: 0 0 20%;
  }
  nav {
    flex: 1;
    justify-content: center;
    transition: all 0.2s;
    a + a {
      margin-left: 1.5rem;
    }
    a {
      position: relative;
    }
    a::before {
      position: absolute;
      content: "";
      width: 1.5rem;
      height: 2px;
      border-radius: 2px;
      background: var(--light);
      bottom: -0.5rem;
      left: calc(50% - 0.75rem);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.2s;
    }
    a:hover::before,
    a.active::before {
      transform: scaleX(1);
    }
  }
  .logo {
    cursor: pointer;
    svg {
      height: 2rem;
      color: #fafafc;
      transition: color 0.2s;
    }
    span {
      font-weight: 600;
      font-size: 1.15rem;
      margin-left: 0.5rem;
    }
  }
  .profile {
    justify-content: flex-end;
    white-space: nowrap;
    svg {
      height: 1.15rem;
    }
    a,
    .themeToggle {
      margin-right: 1.5rem;
    }
    .userIcon {
      background: #2e2e48;
      border-radius: 99px;
      height: 1.5rem;
      width: 1.5rem;
      color: #fafafc;
    }
    .user {
      background: #fafafc;
      border-radius: 99px;
      padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    }
    .menu {
      color: #2e2e48;
      margin-right: 0.5rem;
    }
  }
  form {
    position: absolute;
    transform: translate(-50%, 150%);
    left: 50%;
    top: -1rem;
    background: var(--light);
    padding: 0.5rem;
    border-radius: 99px;
    display: flex;
    align-items: center;
    max-width: 720px;
    margin: 1.5rem 0;
    width: 60vw;
    box-shadow: 0 1rem 3rem -1rem #1e1e38;
    transition: all 0.2s;
    transform-origin: center;
    & * {
      transition: all 0.2s;
    }
    & > input {
      background: none;
      border: none;
      font-size: 1.15rem;
      flex: 1;
      padding: 0 1.5rem;
      color: var(--dark);
      outline: none;
      &::placeholder {
        color: var(--dark);
        opacity: 0.6;
      }
    }
    & > button {
      background: var(--red);
      color: #fafafc;
      border: none;
      padding: 0.5rem calc(1.75rem / 2);
      height: 3rem;
      max-width: 300px;
      display: flex;
      align-items: center;
      border-radius: 99px;
      font-weight: 700;
      font-size: 1rem;
      overflow: hidden;
      z-index: 2;
      &:hover:not(:disabled) {
        box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--red);
      }
      &:disabled {
        opacity: 0.5;
      }
    }
    & > button svg {
      height: 1.25rem;
      margin-right: 0.75rem;
      flex: 0 0 1.25rem;
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  @media (max-width: 36rem) {
    .profile,
    .logo,
    nav,
    form > button span {
      display: none;
    }
    .overlay {
      display: none;
    }
    .headerInner {
      grid-template-columns: 1fr;
    }
    form {
      position: relative;
      transform: none !important;
      width: 100% !important;
      left: unset;
      top: 0;
      margin: 0;
      & > input {
        padding: 0 1rem;
        font-size: 1rem;
      }
      & > button {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0 0.6rem;
      }
      & > button svg {
        height: 1rem;
        width: 1rem;
      }
    }
  }
  @media (min-width: 36rem) and (max-width: 62.5rem) {
    nav {
      display: none;
    }
    .headerInner {
      grid-template-columns: 1fr 1fr;
    }
  }
  &.scrolled:not(.inputFocus) {
    background: var(--light);
    color: var(--dark);
    border-bottom: 2px solid var(--gray);
    .overlay {
      opacity: 0;
      pointer-events: none;
    }
    nav {
      opacity: 0;
      pointer-events: none;
    }
    .logo svg {
      color: var(--red);
    }
    .user {
      box-shadow: 0 0 0 2px var(--gray);
    }
    form {
      box-shadow: 0 0 0 2px var(--gray);
      transform: translate(-50%, 0.125rem) scale(0.83);
      width: 480px;
      & > button {
        max-width: 3rem;
      }
      & > button span {
        opacity: 0;
      }
    }
    @media (max-width: 36rem) {
      padding-top: 1rem;
      padding-bottom: 1rem;
      form {
        padding: 0;
        box-shadow: none;
        background: var(--gray);
      }
    }
    @media (min-width: 36rem) and (max-width: 62.5rem) {
      .profile {
        opacity: 0;
        pointer-events: none;
      }
      form {
        left: auto;
        right: 0;
        transform: translate(0, 0.125rem) scale(0.83);
        width: 50%;
      }
    }
  }
  &.inputFocus {
    color: var(--dark);
    .logo svg {
      color: var(--red);
    }
    form {
      background: var(--light);
      width: 100%;
      box-shadow: 0 1rem 1.5rem -0.5rem #0001;
    }
  }
`;

import styled from "styled-components";
import Image from "next/image";

export default function Hero() {
  return (
    <HeroSection className="light hero">
      <div className="heroInner">
        <span>
          <h1>Olympian & Paralympian Online Experiences</h1>
          <a href="#" className="btn btn-light">
            Explore Now
          </a>
        </span>
      </div>
    </HeroSection>
  );
}

const HeroSection = styled.section`
  background: linear-gradient(to bottom, #0a0c2c80 3rem, transparent 10rem),
    url(/images/hero.jpg);
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: var(--light);
  padding: 15rem var(--sidePadding) 6rem;
  .heroInner {
    display: flex;
    max-width: var(--containerWidth);
    margin: 0 auto;
  }
  span {
    max-width: var(--maxWidth);
  }
  h1 {
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 36rem) {
    background: linear-gradient(to bottom, #0a0c2c80 3rem, transparent),
      url(images/hero-sm.jpg);
    background-position: center, bottom left;
    background-size: cover, cover;
    align-items: flex-start;
    padding-top: 7.5rem;
    height: 75vh;
    max-height: 720px;
  }
`;

import styled from "styled-components";
import Image from "next/image";

export default function Hosting() {
  return (
    <HostingSection className="light">
      <span>
        <h2>Try hosting</h2>
        <p>
          Earn extra income and unlock new oppurtunities by sharing your space.
        </p>
        <a href="#" className="btn btn-light">
          Learn more
        </a>
      </span>
    </HostingSection>
  );
}

const HostingSection = styled.section`
  padding: 6rem var(--sidePadding);
  background: url(images/host.jpg);
  background-size: cover;
  background-position: 33% center;
  border-radius: 1rem;
  color: var(--light);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h2 {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
    font-weight: 800;
  }
  span {
    max-width: var(--maxWidth);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  p {
    margin-bottom: 1.5rem;
  }
  @media (max-width: 36rem) {
    aspect-ratio: 0.75;
    background: url(images/host-sm.jpg);
    background-size: cover;
    background-position: center;
    position: relative;
    h2 {
      margin-bottom: 0.25rem;
    }
    p {
      margin-bottom: 0.5rem;
    }
    span {
      position: absolute;
      padding: 0 var(--sidePadding);
      height: 50%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex-direction: column;
    }
  }
`;

import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { resultImages } from "../data";
import { MapPin } from "react-feather";

export default function Map({
  results,
  selectedLocation,
  setSelectedLocation,
  viewport,
  setViewport,
}) {
  const containerRef = useRef(null);
  const handleScroll = () => {
    if (window.scrollY < window.innerHeight * 1.2) {
      containerRef.current.style.transform =
        "translateY(" + window.scrollY * 0.2 + "px)";
    }
  };

  useEffect(() => {
    const containerRefCurr = containerRef.current;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MapContainer ref={containerRef}>
      <ReactMapGL
        mapStyle="mapbox://styles/santdas36/cks0kblsg0vyx17qw3jc0vqtv"
        mapboxApiAccessToken="pk.eyJ1Ijoic2FudGRhczM2IiwiYSI6ImNrZzBlNG9mcDJncXoyeXM4enY2ZjZmeXgifQ.1nUvNLjy9AS8sDvCRJnvNg"
        {...viewport}
        width="100%"
        height="100%"
        className="mapgl-container"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {results.map((result, index) => (
          <div key={result.long}>
            <Marker longitude={result.long} latitude={result.lat}>
              <p
                role="img"
                className={`mapMarker ${
                  selectedLocation.long === result.long ? "active" : null
                }`}
                onClick={() => setSelectedLocation({ ...result, index })}
                aria-label="push-pin"
              >
                <MapPin className="mapPin" />
              </p>
            </Marker>

            {selectedLocation.long === result.long ? (
              <Popup
                onClose={() => setSelectedLocation({})}
                closeOnClick={true}
                latitude={result.lat}
                longitude={result.long}
                className="popup"
              >
                <PopupInner bg={resultImages[selectedLocation.index][0]}>
                  <h5>{result.title}</h5>
                  <h4>{result.price}</h4>
                </PopupInner>
              </Popup>
            ) : (
              false
            )}
          </div>
        ))}
      </ReactMapGL>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 90vh;
  z-index: 1;
  margin-bottom: -35vh;
  background: var(--gray);
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, var(--light) 30%, transparent);
    z-index: 3;
    height: 20vh;
    pointer-events: none;
  }
  .mapMarker {
    position: relative;
    animation: markerAnim 0.5s infinite ease-out alternate;
    &.active {
      animation-play-state: paused;
      &::before {
        animation-play-state: paused;
      }
    }
    &::before {
      content: "";
      position: absolute;
      width: 1rem;
      height: 0.25rem;
      background: var(--dark);
      transform-origin: bottom center;
      filter: blur(2px);
      border-radius: 100%;
      bottom: 0.125rem;
      left: 0.25rem;
      z-index: -1;
      opacity: 0.5;
      animation: markerShadowAnim 0.5s infinite ease-out alternate;
    }
  }
  @keyframes markerAnim {
    to {
      transform: translateY(-0.5rem);
    }
  }
  @keyframes markerShadowAnim {
    to {
      transform: translateY(0.5rem) scale(0.25);
      opacity: 1;
    }
  }
  .mapPin {
    stroke: none;
    fill: var(--red);
    circle {
      fill: var(--gray);
    }
  }
  .mapboxgl-popup {
    z-index: 1;
  }
  .mapboxgl-popup-content {
    border-radius: 1rem;
    padding: 0;
    max-width: 240px;
    width: 75%;
    background: var(--dark);
  }
  .mapboxgl-popup-close-button {
    right: 0;
    top: 0;
    color: var(--white);
    line-height: 1;
    z-index: 98;
    background: var(--red);
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 0 1rem 0 1rem;
    box-shadow: -0.5rem 0.5rem 0.5rem #0002;
  }
  .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
    border-bottom-color: var(--dark);
  }
  .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
    border-bottom-color: var(--dark);
  }
  .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
    border-bottom-color: var(--dark);
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: var(--dark);
  }
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
    border-bottom: none;
    border-left: none;
    border-top-color: var(--dark);
  }
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
    border-top-color: var(--dark);
  }
  .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-right-color: var(--dark);
  }
  .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    border-left-color: var(--dark);
  }
  @media (min-width: 48rem) {
    margin-bottom: -50vh;
    height: calc(100vh + 10rem);
    .mapboxgl-popup-content {
      width: 360px;
    }
  }
`;

const PopupInner = styled.div`
  background: linear-gradient(to top, var(--dark), transparent),
    url(/images/results/${(props) => props.bg});
  background-size: cover;
  padding: 5rem 1rem 0.5rem;
  box-shadow: 0 0.25rem 0.5rem #0002;
  border-radius: 1rem;
  color: var(--white);
`;

import styled from "styled-components";
import { Home, Search, Heart, User } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useRouter } from "next/router";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <MobileNavDiv className={isOpen ? "open" : null}>
      <div
        className="toggle"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span></span>
      </div>
      <div className="items">
        <div
          onClick={() => router.push("/")}
          className={`item ${router.pathname === "/" ? "active" : null}`}
        >
          <Home /> Home
        </div>
        <div
          className={`item ${router.pathname === "/search" ? "active" : null}`}
        >
          <Search /> Explore
        </div>
        <div className="item">
          <Heart /> Wishlist
        </div>
        <div className="item">
          <User /> Profile
        </div>
        <ThemeToggle icon text className="item" />
      </div>
    </MobileNavDiv>
  );
}

const MobileNavDiv = styled.div`
  display: none;
  @media (max-width: 36rem) {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 0;
    color: var(--dark);
    z-index: 99;
    .items {
      display: flex;
      pointer-events: none;
      opacity: 0;
      transform: translateX(3rem);
      flex-direction: column;
      gap: 0.5rem;
      background: var(--dark);
      color: var(--light);
      padding: 1rem 1.5rem 1rem 0.75rem;
      border-radius: 1rem 0 0 1rem;
      box-shadow: 0.5rem 0.5rem 1rem #0005;
      position: fixed;
      right: 0;
      bottom: 5.5rem;
      transition: all 0.2s;
      .item {
        display: flex;
        align-items: center;
        padding: 0.25rem 3rem 0.25rem 0.5rem;
        border-radius: 1rem;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: #88a2;
        }
        &.active {
          color: var(--red);
        }
        svg {
          margin-right: 1rem;
          width: 1.25rem;
        }
      }
    }
    .toggle {
      width: 3rem;
      height: 3rem;
      border-radius: 99px;
      background: var(--dark);
      box-shadow: 0 0.5rem 1rem #0002;
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      display: grid;
      place-items: center;
      transition: all 0.2s;
      cursor: pointer;
      z-index: 99;
      span {
        display: block;
        position: relative;
        height: 2px;
        width: 1.5rem;
        background: var(--light);
        border-radius: 3px;
        transition: all 0.2s;
        &::before,
        &::after {
          position: absolute;
          content: "";
          height: 2px;
          width: 1.5rem;
          background: var(--light);
          border-radius: 3px;
          transition: all 0.2s;
        }
        &::before {
          transform: translateY(-6px);
        }
        &::after {
          transform: translateY(6px);
        }
      }
    }
    &.open {
      .items {
        pointer-events: auto;
        opacity: 1;
        transform: translateX(0);
      }
      .toggle {
        background: var(--red);
        span {
          background: var(--red);
          &::before {
            background: #fff;
            transform: translate(0) rotate(45deg);
          }
          &::after {
            background: #fff;
            transform: translate(0) rotate(-45deg);
          }
        }
      }
    }
  }
`;


import styled from "styled-components";

export default function NumberInput({ name, value, setValue }) {
  return (
    <InputDiv>
      <label htmlFor={name}>{name}</label>
      <span>
        <button
          disabled={value <= 0}
          onClick={() => !(value <= 0) && setValue((val) => val - 1)}
          className="button"
        >
          -
        </button>
        <input
          min={0}
          max={20}
          value={value}
          id={name}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          placeholder="Add dates"
        />
        <button
          onClick={() => !(value >= 20) && setValue((val) => val + 1)}
          className="button"
        >
          +
        </button>
      </span>
    </InputDiv>
  );
}
const InputDiv = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  span {
    background: var(--light);
    padding: 0.5rem;
    border-radius: 99px;
    display: flex;
    width: fit-content;
  }
  label {
    font-size: 1rem;
    display: block;
    margin-right: 1rem;
  }
  input,
  button {
    background: none;
    border: none;
    font-size: 1rem;
    text-align: center;
    outline: none;
  }
  button {
    line-height: 1;
    border-radius: 99px;
    background: var(--gray);
    color: var(--dark);
    padding: 0 1rem;
  }
  input {
    padding: 0.5rem;
    width: 4rem;
  }
  @media (max-width: 36rem) {
    span {
      margin-left: auto;
      padding: 0.25rem;
    }
  }
`;

import styled from "styled-components";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Star, Heart } from "react-feather";
export default function ResultCard({
  imgSrc,
  location,
  title,
  description,
  star,
  total,
  price,
  lat,
  onClick,
}) {
  const [liked, setLiked] = useState(false);
  const imagesRef = useRef(null);
  const [currSlide, setCurrSlide] = useState(0);

  const scrollToImage = (index) => {
    imagesRef.current.scrollLeft = imagesRef.current.offsetWidth * index;
  };

  const handleScroll = (e) =>
    setCurrSlide(Math.round(e.target.scrollLeft / e.target.offsetWidth));

  useEffect(() => {
    const imagesRefCurr = imagesRef.current;
    imagesRefCurr.addEventListener("scroll", handleScroll);
    return () => imagesRefCurr.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CardDiv onClick={onClick}>
      <div ref={imagesRef} className="carousel">
        {imgSrc.map((url, index) => (
          <ImageComponent key={index} url={url} location={location} />
        ))}
      </div>
      {imgSrc?.length > 1 && (
        <div className="scroller">
          {imgSrc.map((img, idx) => (
            <span
              key={idx}
              className={currSlide === idx ? "active" : null}
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(idx);
              }}
            ></span>
          ))}
        </div>
      )}
      <Heart
        className={`heart ${liked ? "liked" : null}`}
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
      />

      <div className="details">
        <div className="rating">
          <Star className="star" /> {star}{" "}
          <small>({String(lat).split(".")[1].substring(0, 3)})</small>
        </div>
        <p className="subtitle">{location}</p>
        <h2>{title}</h2>
        <p className="description">{description}</p>
        <p className="price">
          <span>
            {price.split(" ")[0]} <small>/night</small>
          </span>
          <span className="total">{total}</span>
        </p>
      </div>
    </CardDiv>
  );
}

const ImageComponent = ({ index, url, location }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`img ${loading ? "loading" : null}`}>
      <Image
        layout="fill"
        alt={location}
        objectFit="cover"
        src={`/images/results/${url}`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

const CardDiv = styled.div`
  border-radius: 1rem;
  position: relative;
  .carousel {
    position: relative;
    width: 100%;
    display: fix;
    border-radius: 1rem;
    overflow: scroll;
    transition: all 0.2s;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    &::-webkit-scrollbar {
      display: none;
      -webkit-appearance: none;
    }
    .img {
      flex: 0 0 100%;
      padding-bottom: 66.67%;
      position: relative;
      scroll-snap-align: start;
      &.loading {
        animation: shimmer 2s infinite;
        background: linear-gradient(
          to right,
          #eff1f3 4%,
          #e2e2e2 25%,
          #eff1f3 36%
        );
        background-size: 1000px 100%;
      }
    }
    img {
      transition: transform 0.2s;
    }
  }
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  .scroller {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 2;
    width: fit-content;
    left: 50%;
    transform: translate(-50%, -2rem);
    &::-webkit-scrollbar {
      display: none;
      -webkit-appearance: none;
    }
    span {
      display: block;
      width: 0.3rem;
      height: 0.3rem;
      background: #fff;
      opacity: 0.5;
      transition: all 0.2s;
      margin: 1rem 0.25rem;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0.1rem 0.2rem #002;
    }
    span.active {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  .details {
    padding: 1rem 0.25rem;
    transition: transform 0.2s;
    width: 100%;
  }
  svg.heart {
    height: 1.5rem;
    position: absolute;
    z-index: 2;
    right: 1rem;
    top: 1rem;
    transition: all 0.2s;
    color: #fff;
    &.liked {
      stroke: var(--red);
      fill: var(--red);
      filter: drop-shadow(0 0.15rem 0.25rem #0008);
    }
  }
  .rating {
    display: flex;
    align-items: center;
    width: fit-content;
    margin-bottom: 0.25rem;
    small {
      color: #889;
      font-size: 100%;
      margin-left: 0.25rem;
    }
    svg {
      stroke: none;
      fill: var(--red);
      height: 1rem;
      margin-right: 0.25rem;
    }
  }
  .subtitle {
    font-size: 1rem;
  }
  h2 {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0.25rem 0 0.5rem;
    line-height: 1.2;
  }
  .price {
    font-weight: 700;
    font-size: 1.15rem;
    small {
      font-weight: 400;
    }
  }
  .description,
  .total {
    display: none;
    color: #889;
  }
  &:hover {
    background: var(--white);
    box-shadow: 0 0.5rem 1rem #48484810;
    .img img {
      transform: scale(1.05);
    }
    .details {
      transform: scale(0.95);
    }
  }
  @media (min-width: 48rem) {
    display: flex;
    gap: 1.5rem;
    .carousel {
      flex: 0 0 300px;
    }
    .details {
      padding-right: 1rem;
    }
    .description {
      display: block;
      margin-bottom: 1rem;
    }
    .subtitle,
    .description {
      display: flex;
    }
    .price {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: flex-end;
      & .total {
        font-weight: 400;
        font-size: 0.85rem;
        color: #889;
        display: inline-block;
      }
    }
    .rating {
      position: absolute;
      bottom: 0.75rem;
      margin-left: -0.5rem;
    }
    svg.heart {
      color: var(--dark);
      &.liked {
        filter: none;
      }
    }
    .scroller {
      left: 150px;
      bottom: -1.5rem;
      span {
        box-shadow: 0 1px 2px #000;
      }
    }
    &:hover {
      background: var(--white);
      box-shadow: 0 0.5rem 1rem #48484810;
      .carousel {
        transform: scale(0.93);
      }
      .img img {
        transform: scale(1);
      }
      .details {
        transform: scale(1);
      }
    }
  }
`;



import styled from "styled-components";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Image from "next/image";
import ResultCard from "./ResultCard";
import { resultImages } from "../data";
import { ArrowLeft, ArrowRight } from "react-feather";

export default function SearchResults({
  results,
  setViewport,
  setSelectedLocation,
}) {
  const router = useRouter();
  const checkInDate = format(new Date(router.query.checkIn), "do MMM, yyyy");
  const checkOutDate = format(new Date(router.query.checkOut), "do MMM, yyyy");

  const setSelection = (data) => {
    setSelectedLocation(data);
    setViewport({ latitude: data.lat - 0.01, longitude: data.long, zoom: 11 });
    console.log(data);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ResultsDiv className="hero">
      <div className="inner">
        <p className="details">
          300+ stays - <span className="date">{checkInDate}</span> to{" "}
          <span className="date">{checkOutDate}</span> for {router.query.guests}{" "}
          guests
        </p>
        <h1>Stays in {router.query.location}</h1>

        <div className="results">
          {results.map((item, index) => (
            <ResultCard
              onClick={() =>
                setSelection({ lat: item.lat, long: item.long, index: index })
              }
              {...item}
              imgSrc={resultImages[index]}
              key={index}
            />
          ))}
        </div>

        <div className="navigation">
          <button className="prev" aria-label="previous">
            <ArrowLeft />
          </button>
          <span className="active">1</span>
          <span>2</span>
          <span>3</span>
          ...
          <span>8</span>
          <span>9</span>
          <button className="next" aria-label="next">
            <ArrowRight />
          </button>
        </div>
      </div>
    </ResultsDiv>
  );
}

const ResultsDiv = styled.section`
  height: fit-content;
  padding: 3rem var(--sidePadding);
  z-index: 1;
  position: relative;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -1rem 2rem -1rem #0003;
  background: var(--light);
  max-width: calc(var(--containerWidth) + 2 * var(--sidePadding));
  margin: 0 auto;
  .inner {
    display: flex;
    flex-direction: column;
  }
  .navigation {
    display: flex;
    padding-top: 1.5rem;
    align-items: center;
    button,
    span {
      background: var(--gray);
      border: none;
      border-radius: 99px;
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      outline: none;
      &:hover,
      &:focus {
        box-shadow: 0 0 0 1px var(--dark);
      }
    }
    span {
      width: 2rem;
      height: 2rem;
      margin: 0 0.75rem;
      user-select: none;
      cursor: pointer;
      @media (max-width: 36rem) {
        display: none;
      }
      &.active {
        background: var(--dark);
        color: var(--light);
      }
    }
    button.prev {
      margin-right: auto;
    }
    button.next {
      margin-left: auto;
    }
  }
  h1 {
    font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2rem);
    line-height: 1.2;
    margin-top: 1rem;
  }
  .date {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    background: var(--gray);
    white-space: nowrap;
    line-height: 2;
    font-size: 90%;
  }
  .results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: var(--sidePadding) 0;
    @media (min-width: 48rem) {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 36rem) {
    &::before {
      position: absolute;
      content: "";
      background: var(--dark);
      width: 3rem;
      height: 3px;
      border-radius: 3px;
      opacity: 0.25;
      top: 0.75rem;
      left: calc(50% - 1.5rem);
    }
    .details {
      font-size: 0.85rem;
    }
  }
`;


import { useEffect, useState } from "react";
import { Sun, Moon } from "react-feather";
import styled from "styled-components";

const ThemeToggle = ({ text, icon, className }) => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"));
  }, []);
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      window.localStorage.setItem("airbnbTheme", "dark");
    } else {
      document.body.classList.remove("dark");
      window.localStorage.setItem("airbnbTheme", "light");
    }
  }, [isDark]);

  return (
    <Container
      className={`${className} themeToggle`}
      onClick={() => setIsDark(!isDark)}
    >
      {icon && (
        <> {isDark ? <Sun className="sun" /> : <Moon className="moon" />} </>
      )}
      {text && "Switch Theme"}
    </Container>
  );
};

export default ThemeToggle;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: fit-content;
  cursor: pointer;
`;



import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchResults from "../components/SearchResults";
import Map from "../components/Map";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useState } from "react";
import getCenter from "geolib/es/getCenter";

export default function Search({ searchResults }) {
  const router = useRouter();
  const placeholder = `${router.query.location} | ${format(
    new Date(router.query.checkIn),
    "d MMM, yy"
  )} | ${format(new Date(router.query.checkIn), "d MMM, yy")} | ${
    router.query.guests
  } guests`;
  const [selectedLocation, setSelectedLocation] = useState({});

  const coordinates = [...searchResults].slice(1).map((result) => ({
    longitude: result.long,
    latitude: result.lat,
  }));
  const center = getCenter(coordinates);

  const [viewport, setViewport] = useState({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });
  return (
    <>
      <Header placeholder={placeholder} />
      <main>
        <Map
          results={searchResults}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          viewport={viewport}
          setViewport={setViewport}
        />
        <SearchResults
          setSelectedLocation={setSelectedLocation}
          results={searchResults}
          setViewport={setViewport}
        />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const searchResults = await fetch("https://links.papareact.com/isz").then(
    (data) => data.json()
  );
  return {
    props: {
      searchResults,
    },
  };
}



import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const setInitialTheme = `
      const isDark = window.localStorage.getItem('airbnbTheme') ? (window.localStorage.getItem('airbnbTheme') === 'dark') : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.body.classList.add('dark');
      }
    `;
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;


import "nprogress/nprogress.css";
import "../styles/globals.css";
import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>Airbnb-ish</title>
        <meta
          name="description"
          content="Find holiday rentals, cabins, beach houses, unique homes and experiences around the world – all made possible by Hosts on Airbnb."
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

{
  /* deeyes36acfed */
}


import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Explore from "../components/Explore";
import Banner from "../components/Banner";
import Cards from "../components/Cards";
import Hosting from "../components/Hosting";
import Footer from "../components/Footer";
import { live, discover } from "../data";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Explore />
        <Banner />
        <Cards {...live} />
        <Cards {...discover} />
        <Hosting />
      </main>

      <Footer />
    </>
  );
}

export const discover = {
  title: "Discover things to do",
  items: [
    {
      title: "Featured collection: Wanderlust",
      p: "Travel from home with Online Experiences.",
      img: "1.jpg",
    },
    {
      title: "Online Experiences",
      p: "Live, interactive activities led by Hosts.",
      img: "2.jpg",
    },
    {
      title: "Experiences",
      p: "Find unforgettable activities near you.",
      img: "3.jpg",
    },
  ],
  urlPrefix: "/images/discover/",
};

export const live = {
  title: "Live anywhere",
  items: [
    {
      title: "Outdoor getaways",
      img: "1.jpg",
    },
    {
      title: "Unique stays",
      img: "2.jpg",
    },
    {
      title: "Entire homes",
      img: "3.jpg",
    },
    {
      title: "Pets allowed",
      img: "4.jpg",
    },
  ],
  urlPrefix: "/images/live/",
};

export const places = [
  { name: "Bengaluru", time: 3 },
  { name: "Puducherry", time: 3 },
  { name: "Kodaikannal", time: 3.5 },
  { name: "Mysuru", time: 4 },
  { name: "Chennai", time: 4.5 },
  { name: "Kochi", time: 6 },
  { name: "Ooty", time: 3.5 },
  { name: "Trivandrum", time: 7.5 },
];

export const resultImages = [
  ["11.jpg", "12.jpg", "13.jpg", "19.jpg"],
  ["5.jpg", "6.jpg", "7.jpg"],
  ["4.jpg", "9.jpg", "10.jpg"],
  ["8.jpg"],
  ["1.jpg", "2.jpg", "3.jpg", "15.jpg"],
  ["16.jpg", "17.jpg"],
  ["18.jpg", "14.jpg", "20.jpg"],
];