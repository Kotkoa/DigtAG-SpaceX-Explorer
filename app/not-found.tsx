"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const basePath = "/DigtAG-SpaceX-Explorer";
    const path = window.location.pathname.slice(basePath.length) || "/";
    const search = window.location.search;
    const hash = window.location.hash;
    if (path !== "/" && path !== "") {
      sessionStorage.setItem("spa-redirect", path + search + hash);
      window.location.replace(basePath + "/");
    }
  }, []);

  return null;
}
