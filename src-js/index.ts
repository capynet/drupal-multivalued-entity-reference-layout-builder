import "reflect-metadata";
import container from "./conatiner"
import './sass/pel.scss';
import TYPES from "./types";
import { ILayoutBuilder } from "./interfaces";

declare global {
  interface Window {
    LayoutBuilderWrapper: any;
    Drupal: any;
  }
}

window.LayoutBuilderWrapper = function (pelContainer, jsonLayout) {
  container.get<ILayoutBuilder>(TYPES.layoutBuilder).setup(pelContainer, jsonLayout)
}
