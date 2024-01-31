import {Context} from "@nuxt/types";
import Helpers from "~/utils/helpers";

export default function (context: Context) {
  Helpers.setAppContext(context);
}
