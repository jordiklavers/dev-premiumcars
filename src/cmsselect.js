"use strict";
(() => {
  var X = Object.defineProperty;
  var Y = (e, t, o) =>
    t in e
      ? X(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
      : (e[t] = o);
  var R = (e, t, o) => (Y(e, typeof t != "symbol" ? t + "" : t, o), o);
  var p = "fs-attributes";
  var L = "cmsattribute";
  var U = "cmscore";
  var M = "cmsload";
  var u = "cmsselect";
  var x = "support";
  var C = async (...e) => {
    var o;
    let t = [];
    for (let s of e) {
      let n = await ((o = window.fsAttributes[s]) == null ? void 0 : o.loading);
      t.push(n);
    }
    return t;
  };
  var m = class {
    static activateAlerts() {
      this.alertsActivated = !0;
    }
    static alert(t, o) {
      if ((this.alertsActivated && window.alert(t), o === "error"))
        throw new Error(t);
    }
  };
  R(m, "alertsActivated", !1);
  var g = () => {};
  var B = {
    wrapper: "w-dyn-list",
    list: "w-dyn-items",
    item: "w-dyn-item",
    paginationWrapper: "w-pagination-wrapper",
    paginationNext: "w-pagination-next",
    paginationPrevious: "w-pagination-previous",
    pageCount: "w-page-count",
    emptyState: "w-dyn-empty",
  };
  var v = (e) => e instanceof HTMLSelectElement;
  var f = (e) => typeof e == "string";
  var y = (e) => {
    let t = e.split("-"),
      o = parseInt(t[t.length - 1]);
    if (!isNaN(o)) return o;
  };
  function O(e, t, o) {
    var n;
    let s = window.fsAttributes[e];
    return (s.destroy = o || g), (n = s.resolve) == null || n.call(s, t), t;
  }
  var S = (e, t = "1", o = "iife") => {
    let n = `${e}${o === "esm" ? ".esm" : ""}.js`;
    return `https://cdn.jsdelivr.net/npm/@finsweet/attributes-${e}@${t}/${n}`;
  };
  var z = S(U, "1"),
    h = async () => {
      let { fsAttributes: e } = window;
      e.cmscore || (e.cmscore = {});
      let { cmscore: t } = e;
      if (t.import) return t.import;
      try {
        return (
          (t.import = import(z)),
          t.import.then((o) => {
            o && (t.version || (t.version = o.version));
          }),
          t.import
        );
      } catch (o) {
        m.alert(`${o}`, "error");
        return;
      }
    };
  var Q = `${p}-${x}`,
    P = async () => {
      var n;
      let { fsAttributes: e, location: t } = window,
        { host: o, searchParams: s } = new URL(t.href);
      return !o.includes("webflow.io") || !s.has(Q)
        ? !1
        : (n = e.import) == null
        ? void 0
        : n.call(e, x, "1");
    };
  var N = (e) => (t) => `${e}${t ? `-${t}` : ""}`,
    A = (e) => {
      let t = (n, i, r) => {
        let c = e[n],
          { key: l, values: E } = c,
          a;
        if (!i) return `[${l}]`;
        let b = E == null ? void 0 : E[i];
        f(b)
          ? (a = b)
          : (a = b(r && "instanceIndex" in r ? r.instanceIndex : void 0));
        let d = r && "caseInsensitive" in r && r.caseInsensitive ? "i" : "";
        if (!(r != null && r.operator)) return `[${l}="${a}"${d}]`;
        switch (r.operator) {
          case "prefixed":
            return `[${l}^="${a}"${d}]`;
          case "suffixed":
            return `[${l}$="${a}"${d}]`;
          case "contains":
            return `[${l}*="${a}"${d}]`;
        }
      };
      function o(n, i) {
        let r = t("element", n, i),
          c = (i == null ? void 0 : i.scope) || document;
        return i != null && i.all
          ? [...c.querySelectorAll(r)]
          : c.querySelector(r);
      }
      return [
        t,
        o,
        (n, i) => {
          let r = e[i];
          return r ? n.getAttribute(r.key) : null;
        },
      ];
    };
  var T = {
      preventLoad: { key: `${p}-preventload` },
      debugMode: { key: `${p}-debug` },
      src: { key: "src", values: { finsweet: "@finsweet/attributes" } },
      dev: { key: `${p}-dev` },
    },
    [_, Nt] = A(T);
  var V = (e) => {
    let { currentScript: t } = document,
      o = {};
    if (!t) return { attributes: o, preventsLoad: !1 };
    let n = {
      preventsLoad: f(t.getAttribute(T.preventLoad.key)),
      attributes: o,
    };
    for (let i in e) {
      let r = t.getAttribute(e[i]);
      n.attributes[i] = r;
    }
    return n;
  };
  var $ = ({ scriptAttributes: e, attributeKey: t, version: o, init: s }) => {
      var c;
      J(), (c = window.fsAttributes)[t] || (c[t] = {});
      let { preventsLoad: n, attributes: i } = V(e),
        r = window.fsAttributes[t];
      (r.version = o),
        (r.init = s),
        n ||
          (window.Webflow || (window.Webflow = []),
          window.Webflow.push(() => s(i)));
    },
    J = () => {
      let e = tt();
      if (window.fsAttributes && !Array.isArray(window.fsAttributes)) {
        I(window.fsAttributes, e);
        return;
      }
      let t = Z(e);
      I(t, e),
        et(t),
        (window.fsAttributes = t),
        (window.FsAttributes = window.fsAttributes),
        P();
    },
    Z = (e) => {
      let t = {
        cms: {},
        push(...o) {
          var s, n;
          for (let [i, r] of o)
            (n = (s = this[i]) == null ? void 0 : s.loading) == null ||
              n.then(r);
        },
        async import(o, s) {
          let n = t[o];
          return (
            n ||
            new Promise((i) => {
              let r = document.createElement("script");
              (r.src = S(o, s)),
                (r.async = !0),
                (r.onload = () => {
                  let [c] = I(t, [o]);
                  i(c);
                }),
                document.head.append(r);
            })
          );
        },
        destroy() {
          var o, s;
          for (let n of e)
            (s = (o = window.fsAttributes[n]) == null ? void 0 : o.destroy) ==
              null || s.call(o);
        },
      };
      return t;
    },
    tt = () => {
      let e = _("src", "finsweet", { operator: "contains" }),
        t = _("dev");
      return [...document.querySelectorAll(`script${e}, script${t}`)].reduce(
        (n, i) => {
          var c;
          let r =
            i.getAttribute(T.dev.key) ||
            ((c = i.src.match(/[\w-. ]+(?=(\.js)$)/)) == null ? void 0 : c[0]);
          return r && !n.includes(r) && n.push(r), n;
        },
        []
      );
    },
    I = (e, t) =>
      t.map((s) => {
        let n = e[s];
        return (
          n ||
          ((e[s] = {}),
          (n = e[s]),
          (n.loading = new Promise((i) => {
            n.resolve = (r) => {
              i(r), delete n.resolve;
            };
          })),
          n)
        );
      }),
    et = (e) => {
      let t = Array.isArray(window.fsAttributes) ? window.fsAttributes : [];
      e.push(...t);
    };
  var D = "1.7.0";
  var nt = `fs-${u}`,
    rt = "text-value",
    st = "select",
    w = {
      element: {
        key: `${nt}-element`,
        values: { textValue: N(rt), select: st },
      },
    },
    [k, K] = A(w);
  var it = "fs-cms-element",
    ct = {
      wrapper: "wrapper",
      list: "list",
      item: "item",
      paginationWrapper: "pagination-wrapper",
      paginationNext: "pagination-next",
      paginationPrevious: "pagination-previous",
      pageCount: "page-count",
      emptyState: "empty",
    },
    H = (e) => {
      let t = `.${B[e]}`,
        o = `[${it}="${ct[e]}"]`;
      return `:is(${t}, ${o})`;
    };
  var F = (e, t) => {
    let o = e.getAttribute(t);
    return o ? y(o) : void 0;
  };
  var j = (e, t) => {
      let o = F(e, w.element.key),
        s = W(o),
        n = new Set(),
        i = new Set();
      for (let r of s) {
        q(e, r, i);
        let c = r.closest(H("wrapper"));
        if (!c) continue;
        let l = t.createCMSListInstance(c);
        !l || n.add(l);
      }
      for (let r of n)
        r.on("additems", (c) => {
          for (let { element: l } of c) {
            let E = W(o, l);
            for (let a of E) q(e, a, i);
          }
        });
      return [...n];
    },
    W = (e, t = document) => [
      ...t.querySelectorAll(k("element", "textValue", { instanceIndex: e })),
    ],
    q = (e, { innerText: t }, o) => {
      if (!t || o.has(t)) return;
      let s = new Option(t, t);
      e.options.add(s), o.add(t);
    };
  var G = async () => {
    let e = await h();
    if (!e) return [];
    await C(L);
    let t = K("select", { operator: "prefixed", all: !0 }),
      o = new Set();
    for (let n of t) {
      if (!v(n)) continue;
      let i = j(n, e);
      for (let r of i) o.add(r);
    }
    let s = [...o];
    return (
      await C(M),
      O(u, s, () => {
        var n;
        for (let i of s) (n = i.destroy) == null || n.call(i);
      })
    );
  };
  $({ init: G, version: D, attributeKey: u });
})();
