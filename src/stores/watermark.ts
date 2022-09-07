import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { errRequestHandler } from "@/plugins/errorResponser";
import { envConfig } from "@/plugins/envConfig";

interface Watermark {
  blob: Blob;
  name: string;
  type: number;
  isWatermark: boolean;
  preview: string;
  path: string;
}

interface OptionsSettings {
  options: {
    onlyLimit: boolean;
    page?: number;
    itemsPerPage: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    groupBy?: string[];
    groupDesc?: boolean[];
    mustSort?: boolean;
    multiSort?: boolean;
    allCount?: number;
    maxPages?: number;
  };
}

interface ResultWithMessage {
  message: string;
  result: any;
}
interface State {
  imageList: Watermark[];
  optionsSettings: OptionsSettings;
}
interface PaginationBack {
  allCount: number;
  maxPages: number;
  page: number;
}
interface ImagesListWithPagination extends PaginationBack {
  data: Watermark[];
}

export type { OptionsSettings, Watermark };

export const useWatermarkStore = defineStore({
  id: "watermark",
  state: (): State => ({
    imageList: [],
    optionsSettings: {
      options: {
        onlyLimit: false,
        itemsPerPage: 12,
        maxPages: 0,
        allCount: 0,
        sortBy: ["id"],
        sortDesc: [true],
      },
    },
  }),
  getters: {
    getList: (state): Watermark[] => state.imageList || [],

    getOptionsSettings: (state): OptionsSettings => {
      return state.optionsSettings;
    },
  },
  actions: {
    setOptionsSettings(options: OptionsSettings): void {
      this.optionsSettings = options;
    },

    fetchListMain(): Promise<boolean> {
      const options = JSON.parse(JSON.stringify(this.optionsSettings));
      return axiosClient
        .post(`${envConfig.API_URL}watermark/getList`, options)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setImageList(respdata.result);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    setImageList(payload: ImagesListWithPagination): void {
      this.imageList = payload.data || [];
      this.imageList.forEach((img) => {
        img.isWatermark = true;
        img.preview = `${envConfig.API_URL}${img.path}`;
        return img;
      });
      this.optionsSettings.options.allCount = payload.allCount;
      this.optionsSettings.options.page = payload.page;
      this.optionsSettings.options.maxPages = payload.maxPages;
    },
    sendDeleteWatermark(id: number): Promise<boolean> {
      return axiosClient
        .delete(`${envConfig.API_URL}watermark/${id}`)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    sendImage(payload: Watermark): Promise<boolean> {
      const form = new FormData();
      form.append("file", payload.blob);
      form.append("name", payload.name);
      form.append("type", payload.type.toString());
      return axiosClient
        .post(`${envConfig.API_URL}watermark/`, form)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
  },
});
