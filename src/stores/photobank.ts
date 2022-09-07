import { defineStore } from "pinia";
import { axiosClient } from "@/plugins/axios";
import { errRequestHandler } from "@/plugins/errorResponser";
import { useUserStore } from "./user";
import { ElMessage } from "element-plus";
import { envConfig } from "@/plugins/envConfig";

export interface SimpleObject {
  [key: string]: any;
}

interface Image {
  key?: string;
  blob?: Blob;
  id: number;
  preview: string;
  type_name: string;
  tag_names: string[];
  creator: string;
  created_at: number;
  source_name: string;
  author_name: string;
  used: string[];
  author_id: number | null;
  newAuthor?: string;
  source_id: number | null;
  newSource?: string;
  tags: Set<number | string>;
  description: string;
  del_after: number;
  del_checked: boolean;
  type: number;
  paths: SimpleObject;
}

interface PhotoCardSettings {
  version: string;
  author: boolean;
  source: boolean;
  tags: boolean;
  creator: boolean;
  date: boolean;
  date_full: boolean;
}

interface ImageToUpload extends Partial<Image> {
  mime: string;
  name: string;
  size: number;
  cropped: boolean;
  is_gif: boolean;
  preview: string;
  initial_url: string;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface ImageToBackend extends Image {
  tagsNew: string[];
  tags: number[];
}
type Tag = {
  id: number;
  name: string;
};
type Author = {
  id: number;
  name: string;
};
type Source = {
  id: number;
  name: string;
};
export type User = {
  id: number;
  name: string;
  cnt_images: number;
  cnt_deleted: number;
  cnt_active: number;
};
interface FilterPayload {
  select: string[];
  filter: SimpleObject;
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
interface FilterSettings extends FilterPayload {
  version: string;
  applyCnt: number;
  data: {
    id: null | number;
    types: number[];
    dates: string[];
    tags: number[];
    authors: number[];
    sources: number[];
    users: number[];
    search: string;
    wthoutSources: number[];
  };
}

interface ResultWithMessage {
  message: string;
  result: any;
}
interface State {
  tags: Tag[];
  all_tags: Tag[];
  authors: Author[];
  sources: Source[];
  all_authors: Author[];
  all_sources: Source[];
  imageList: Image[];
  listToEdit: ImageToUpload[];
  filterSettings: FilterSettings;
  users: User[];
  all_users: User[];
  card_settings: PhotoCardSettings;
}
interface PaginationBack {
  allCount: number;
  maxPages: number;
  page: number;
}
interface ImagesListWithPagination extends PaginationBack {
  data: Image[];
}

export type {
  Image,
  Tag,
  Author,
  Source,
  FilterSettings,
  ImageToUpload,
  PhotoCardSettings,
};

function getImageFullPath(src: string): string {
  const isDev = envConfig.API_URL.indexOf(".dev.lan") !== -1;
  return `${isDev ? envConfig.API_URL : "https://static.riafan.ru/"}${src}`;
}
function getCntFilter(filter: FilterSettings): number {
  let cnt = 0;
  filter.data.authors.length > 0 && cnt++;
  filter.data.dates.length > 0 && cnt++;
  filter.data.sources.length > 0 && cnt++;
  filter.data.tags.length > 0 && cnt++;
  filter.data.types.length > 0 && cnt++;
  filter.data.users.length > 0 && cnt++;
  filter.data.id || (-1 > 0 && cnt++);
  filter.data.search.length > 0 && cnt++;
  filter.data.wthoutSources.length > 0 && cnt++;
  !!filter.data.id && cnt++;
  return cnt;
}
export const usePhotobankStore = defineStore({
  id: "photobank",
  state: (): State => ({
    tags: [],
    all_tags: [],
    sources: [],
    all_sources: [],
    authors: [],
    all_authors: [],
    imageList: [],
    listToEdit: [],
    users: [],
    all_users: [],
    card_settings: {
      version: "1.0",
      date: true,
      date_full: false,
      author: true,
      source: true,
      creator: true,
      tags: true,
    },
    filterSettings: {
      version: "0.14",
      applyCnt: 0,
      filter: {},
      data: {
        search: "",
        id: null,
        users: [],
        types: [],
        dates: [],
        sources: [],
        authors: [],
        tags: [],
        wthoutSources: [],
      },
      options: {
        onlyLimit: false,
        itemsPerPage: 54,
        maxPages: 0,
        allCount: 0,
        sortBy: ["id"],
        sortDesc: [true],
      },
      select: [
        "deleted_at",
        "preview",
        "tags_names",
        "id",
        "type_name",
        "creator",
        "created_at",
        "source_name",
        "author_name",
        "used",
      ],
    },
  }),
  getters: {
    getCardSettrings: (state): PhotoCardSettings => {
      const userInfo = useUserStore().getUser;
      const settingsLocal = localStorage.getItem(
        `photo_card_settings_${state.card_settings.version}_${userInfo?.id}`
      );
      if (!settingsLocal) {
        localStorage.setItem(
          `photo_card_settings_${state.filterSettings.version}_${userInfo?.id}_pb`,
          JSON.stringify(state.card_settings)
        );
      } else {
        state.card_settings = JSON.parse(settingsLocal) as PhotoCardSettings;
      }
      return state.card_settings;
    },
    getFilterSettings: (state): FilterSettings => {
      const userInfo = useUserStore().getUser;
      const filterLocal = localStorage.getItem(
        `filter_settings_${state.filterSettings.version}_${userInfo?.id}_pb`
      );
      if (!filterLocal) {
        localStorage.setItem(
          `filter_settings_${state.filterSettings.version}_${userInfo?.id}_pb`,
          JSON.stringify(state.filterSettings)
        );
      } else {
        state.filterSettings = JSON.parse(filterLocal) as FilterSettings;
      }
      return state.filterSettings;
    },
    getFilterSettingsRaw: (state): FilterPayload => {
      const copy = JSON.parse(JSON.stringify(state.filterSettings));
      delete copy.data;
      if (state.filterSettings.data.id) {
        copy.filter["id"] = state.filterSettings.data.id;
      }
      if (state.filterSettings.data.search.length) {
        copy.filter["search"] = state.filterSettings.data.search;
      }
      if (state.filterSettings.data.tags.length) {
        copy.filter["&tags"] = state.filterSettings.data.tags;
      }
      if (state.filterSettings.data.authors.length) {
        copy.filter["&author_id"] = state.filterSettings.data.authors;
      }
      if (state.filterSettings.data.wthoutSources.length) {
        copy.filter["$source_id"] = state.filterSettings.data.wthoutSources;
      }
      if (state.filterSettings.data.sources.length) {
        copy.filter["&source_id"] = state.filterSettings.data.sources;
      }
      if (state.filterSettings.data.types.length) {
        copy.filter["&type"] = state.filterSettings.data.types;
      }
      if (state.filterSettings.data.users.length) {
        copy.filter["&user_id"] = state.filterSettings.data.users;
      }
      if (state.filterSettings.data.id || 0 > 0) {
        copy.filter["id"] = state.filterSettings.data.id;
      }
      if (state.filterSettings.data.dates.length === 2) {
        copy.filter[">=created_at"] = Math.round(
          new Date(state.filterSettings.data.dates[0]).getTime() / 1000
        );
        copy.filter["<created_at"] =
          Math.round(
            new Date(state.filterSettings.data.dates[1]).getTime() / 1000
          ) + 86400;
      }
      return copy;
    },
    getListToEdit: (state): ImageToUpload[] => state.listToEdit || [],
    getList: (state): Image[] => state.imageList || [],
    getTags: (state): Tag[] => state.tags || [],
    getAllTagsById: (state): SimpleObject =>
      state.all_tags.reduce((acc, el) => {
        acc[el.id] = el.name;
        return acc;
      }, {} as SimpleObject),
    getAllTags: (state): Tag[] => state.all_tags,
    getAuthors: (state): Author[] => state.authors || [],
    getAllAuthorsById: (state): SimpleObject =>
      state.all_authors.reduce((acc, el) => {
        acc[el.id] = el.name;
        return acc;
      }, {} as SimpleObject),
    getAllAuthors: (state): Author[] => state.all_authors,
    getSources: (state): Source[] => state.sources || [],
    getAllSourcesById: (state): SimpleObject =>
      state.all_sources.reduce((acc, el) => {
        acc[el.id] = el.name;
        return acc;
      }, {} as SimpleObject),
    getAllSources: (state): Source[] => state.all_sources,
    getAllUsers: (state): User[] => state.all_users,
    getUsers: (state): User[] => state.users,
    getAllUsersById: (state): SimpleObject =>
      state.all_users.reduce((acc, el) => {
        acc[el.id] = el.name;
        return acc;
      }, {} as SimpleObject),
  },
  actions: {
    clearFilterSettings(): void {
      this.filterSettings.data = Object.assign(this.filterSettings.data, {
        id: null,
        search: "",
        types: [],
        dates: [],
        tags: [],
        authors: [],
        sources: [],
        users: [],
        wthoutSources: [],
      });
      this.setFilterSettings(this.filterSettings, true);
    },
    setCardSettings(): void {
      const userInfo = useUserStore().getUser;
      localStorage.setItem(
        `photo_card_settings_${this.card_settings.version}_${userInfo?.id}`,
        JSON.stringify(this.card_settings)
      );
    },
    setFilterSettings(filter: FilterSettings, inLC = false): void {
      const userInfo = useUserStore().getUser;
      this.filterSettings = filter;
      this.filterSettings.applyCnt = getCntFilter(this.filterSettings);
      if (inLC) {
        ElMessage({
          message: "Фильтр сохранен",
          type: "success",
          center: true,
          duration: 1500,
          showClose: true,
        });
        localStorage.setItem(
          `filter_settings_${this.filterSettings.version}_${userInfo?.id}_pb`,
          JSON.stringify(this.filterSettings)
        );
      }
    },
    setImagesForEditor(items: ImageToUpload[]): void {
      this.listToEdit = items || [];
      this.listToEdit.forEach((img) => {
        img.preview = getImageFullPath(img.preview);
        img.tags = new Set(img.tags);
      });
    },
    setImageList(payload: ImagesListWithPagination): void {
      this.imageList = payload.data || [];
      this.imageList.forEach((img) => {
        img.preview = getImageFullPath(img.preview);
        Object.keys(img.paths).forEach(
          (pathName) =>
            (img.paths[pathName] = getImageFullPath(img.paths[pathName]))
        );
      });
      this.filterSettings.options.allCount = payload.allCount;
      this.filterSettings.options.page = payload.page;
      this.filterSettings.options.maxPages = payload.maxPages;
    },
    setUsers(items: User[]): void {
      const ids = this.all_users.map((el) => el.id);
      this.all_users = this.all_users.concat(
        items.filter((item) => !ids.includes(item.id)) || []
      );
      this.users = items || [];
    },
    setTags(items: Tag[]): void {
      const ids = this.all_tags.map((el) => el.id);
      this.all_tags = this.all_tags.concat(
        items.filter((item) => !ids.includes(item.id)) || []
      );
      this.tags = items || [];
    },
    setAuthors(items: Author[]): void {
      const ids = this.all_users.map((el) => el.id);
      this.all_authors = this.all_authors.concat(
        items.filter((item) => !ids.includes(item.id)) || []
      );
      this.authors = items || [];
    },
    setSources(items: Source[]): void {
      const ids = this.all_sources.map((el) => el.id);
      this.all_sources = this.all_sources.concat(
        items.filter((item) => !ids.includes(item.id)) || []
      );
      this.sources = items || [];
    },
    fetchSources(payload: FilterPayload): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/imagesSources`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setSources(respdata.result?.data);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    fetchAuthors(payload: FilterPayload): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/imagesAuthors`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setAuthors(respdata.result?.data);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    fetchUsers(payload: FilterPayload): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/imagesUsers`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setUsers(respdata.result?.data);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    fetchTags(payload: FilterPayload): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}api/tags`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setTags(respdata.result);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    fetchImagesForEditor(ids: number[]): Promise<boolean> {
      const payload = {
        select: [
          "preview",
          "tags",
          "id",
          "type",
          "source_id",
          "author_id",
          "del_after",
          "description",
        ],
        filter: { "&id": ids },
      };
      return axiosClient
        .post(`${envConfig.API_URL}photobank/getList`, payload)
        .then((resp) => {
          const respdata: ResultWithMessage = resp.data;
          if (
            Object.prototype.hasOwnProperty.call(respdata, "message") &&
            respdata.message === "ok"
          ) {
            this.setImagesForEditor(respdata.result.data);
            return true;
          } else {
            return respdata.message || -1;
          }
        })
        .catch((e) => errRequestHandler(e));
    },
    fetchListMain(): Promise<boolean> {
      const raw = JSON.parse(JSON.stringify(this.getFilterSettingsRaw));
      raw.filter["!!!deleted_at"] = 0;
      return axiosClient
        .post(`${envConfig.API_URL}photobank/getList`, raw)
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
    fetchListTrash(): Promise<boolean> {
      const raw = JSON.parse(JSON.stringify(this.getFilterSettingsRaw));
      raw.filter[">deleted_at"] = 0;
      delete raw.filter[">=created_at"];
      delete raw.filter["<created_at"];
      return axiosClient
        .post(`${envConfig.API_URL}photobank/getList`, raw)
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
    sendImagesUpd(payload: ImageToUpload[]): Promise<boolean> {
      const copyObj = JSON.parse(JSON.stringify(payload)) as ImageToBackend[];
      copyObj.forEach((image, ind) => {
        const tagsCopy = Array.from(payload[ind].tags || []);
        image.tagsNew = [];
        image.tags = [];
        tagsCopy.forEach((tag) => {
          if (typeof tag === "string") {
            image.tagsNew.push(tag);
          } else {
            image.tags.push(tag);
          }
        });
        image.tags = image.tags.filter((tag) => typeof tag !== "string");
      });
      return axiosClient
        .put(`${envConfig.API_URL}photobank/editImages`, {
          images_metadata: copyObj,
        })
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
    sendImages(payload: ImageToUpload[]): Promise<boolean> {
      const form = new FormData();
      const copyObj = JSON.parse(JSON.stringify(payload)) as ImageToBackend[];
      copyObj.forEach((image, ind) => {
        form.append(image.key || "", payload[ind].blob || "");
        const tagsCopy = Array.from(payload[ind].tags || []);
        image.tagsNew = [];
        image.tags = [];
        tagsCopy.forEach((tag) => {
          if (typeof tag === "string") {
            image.tagsNew.push(tag);
          } else {
            image.tags.push(tag);
          }
        });
        image.tags = image.tags.filter((tag) => typeof tag !== "string");
      });
      form.append("images_metadata", JSON.stringify(copyObj));
      return axiosClient
        .post(`${envConfig.API_URL}photobank/create`, form)
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
    undeleteImage(ids: number[]): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/undelete`, { ids })
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
    sendDeleteImages(ids: number[]): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/deleteImages`, { ids })
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
    sendDeleteImagesByUserId(user_id: number): Promise<boolean> {
      return axiosClient
        .post(`${envConfig.API_URL}photobank/deleteImagesByUserId`, { user_id })
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
