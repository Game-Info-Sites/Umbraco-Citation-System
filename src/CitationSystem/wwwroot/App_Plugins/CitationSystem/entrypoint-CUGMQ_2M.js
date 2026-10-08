import { UMB_AUTH_CONTEXT as i } from "@umbraco-cms/backoffice/auth";
import { c as s } from "./client.gen-B3-yx8bE.js";
const r = async (n, t) => {
  const e = await n.getContext(i);
  if (!e) {
    console.warn("UMB_AUTH_CONTEXT not available — extension API client will not be authenticated");
    return;
  }
  const o = e.getOpenApiConfiguration();
  s.setConfig({
    auth: o?.token ?? void 0,
    baseUrl: o?.base ?? "",
    credentials: o?.credentials ?? "same-origin"
  }), console.log("Hello from my extension 🎉");
}, c = (n, t) => {
  console.log("Goodbye from my extension 👋");
};
export {
  r as onInit,
  c as onUnload
};
//# sourceMappingURL=entrypoint-CUGMQ_2M.js.map
