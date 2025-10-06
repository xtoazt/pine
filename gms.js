(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[3461], {
    10893: function(e, s, l) {
        (window.__NEXT_P = window.__NEXT_P || []).push(["/games/[id]", function() {
            return l(73863)
        }
        ])
    },
    93659: function(e, s, l) {
        "use strict";
        var a = l(85893);
        l(67294);
        var n = l(31415)
          , t = l(41664)
          , i = l.n(t)
          , c = l(96981)
          , o = l(949)
          , r = l.n(o);
        let d = e => {
            let {name: s, companyName: l, url: t, width: o=512, height: d=384, image: m="", imgClass: h="", wrapperClass: u="", isDeleteButton: x, exclusiveGame: p, onDelete: g} = e
              , j = e => {
                let {src: s} = e;
                return m || s
            }
            ;
            return (0,
            a.jsxs)("div", {
                className: "".concat(r().productList, " ").concat(u),
                children: [Boolean(p) && (0,
                a.jsx)("img", {
                    src: "/assets/icons/dimond-icon.svg",
                    alt: "Exclusive Game",
                    className: "product-exclusive",
                    "data-tooltip-id": "gd-tooltip",
                    "data-tooltip-html": "This game is GD exclusive",
                    "data-tooltip-delay-show": 300
                }), x && (0,
                a.jsx)(n.Z, {
                    className: "absolute z-10 -top-1 -right-1 bg-interdimensional text-white rounded-3xl w-5 h-5 xl:h-7 xl:w-7 flex items-center justify-center cursor-pointer p-1",
                    onClick: g
                }), (0,
                a.jsx)(i(), {
                    href: "/games/".concat(t),
                    className: "product-img overflow-hidden",
                    children: (0,
                    a.jsx)(c.oy, {
                        className: "".concat(h, " rounded-2xl"),
                        loader: j,
                        src: m,
                        alt: s,
                        width: o,
                        height: d,
                        style: {
                            maxHeight: "".concat(d, "px")
                        }
                    })
                }), (0,
                a.jsx)(i(), {
                    href: "/games/".concat(t),
                    className: "product-name",
                    children: s
                }), (0,
                a.jsx)(i(), {
                    href: "/games?company=".concat(l),
                    className: "company-name",
                    children: l
                })]
            })
        }
        ;
        s.Z = d
    },
    73863: function(e, s, l) {
        "use strict";
        l.r(s),
        l.d(s, {
            __N_SSP: function() {
                return G
            }
        });
        var a = l(85893)
          , n = l(67294)
          , t = l(73359)
          , i = l(78932)
          , c = l(55733)
          , o = l.n(c)
          , r = l(41664)
          , d = l.n(r)
          , m = l(11163)
          , h = l(21818)
          , u = l(22920)
          , x = l(54421)
          , p = l(45526)
          , g = l(65224)
          , j = l.n(g)
          , v = l(29245)
          , f = l(49826)
          , w = l(54080)
          , N = l(93659)
          , b = l(62074)
          , y = l(37986)
          , _ = l.n(y);
        let k = ["one", "two", "three", "four", "five"]
          , C = e => {
            var s, l, c, r, g, y, C, G, T, A, D, E, S, I, O, P, R, M;
            let {game: U} = e
              , [z,B] = (0,
            n.useState)(!1)
              , L = (0,
            n.useRef)(null)
              , q = (0,
            n.useRef)(null)
              , X = (0,
            n.useRef)(null)
              , {authenticated: Z} = (0,
            b.CG)(e => e.auth)
              , {push: F, query: H} = (0,
            m.useRouter)()
              , [Y,W] = (0,
            t.t)(x.Of.GET_GAMES)
              , J = () => {
                if (U && U.company) {
                    let e = U.company;
                    Y({
                        variables: {
                            id: "",
                            filters: {
                                company: e
                            }
                        }
                    })
                }
            }
            ;
            (0,
            n.useEffect)( () => {
                U && J()
            }
            , [U]);
            let K = (0,
            n.useCallback)(function() {
                let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location.href;
                if (U) {
                    let s = U.https ? "https" : "http";
                    return null == U || U.md5,
                    (null == U ? void 0 : U.type) === "flash" ? "".concat(s, "://flash.gamedistribution.com/?game=").concat(null == U ? void 0 : U.md5, "/?gd_sdk_referrer_url=").concat(e) : "".concat(s, "://").concat("html5", ".gamedistribution.com/").concat(null == U ? void 0 : U.md5, "/?gd_sdk_referrer_url=").concat(e)
                }
                return ""
            }, [U])
              , Q = async () => {
                let e = new (o())
                  , s = null == U ? void 0 : U.assets.map(async (s, l) => {
                    let a = await fetch("".concat("https://img.gamedistribution.com/").concat(s.name))
                      , n = await a.arrayBuffer();
                    e.file("image".concat(l + 1, ".jpg"), n)
                }
                )
                  , l = "Game Title: ".concat(null == U ? void 0 : U.title);
                e.file("game_title.txt", l),
                await Promise.all(s),
                e.generateAsync({
                    type: "blob"
                }).then(e => {
                    let s = document.createElement("a");
                    s.href = URL.createObjectURL(e),
                    s.download = "".concat(null == U ? void 0 : U.title, "_images.zip"),
                    s.click()
                }
                )
            }
              , V = () => {
                B(!1)
            }
              , $ = e => {
                if (e) {
                    let s = e.textContent;
                    s ? navigator.clipboard.writeText(s).then( () => u.Am.success("Copied")) : console.error("Content is null or empty")
                }
            }
              , ee = (e, s) => {
                F("/games?".concat(e, "=").concat(s))
            }
              , es = () => {
                if (X.current) {
                    let e = X.current.textContent;
                    e ? navigator.clipboard.writeText(e).then( () => u.Am.success("Copied")) : console.error("Content is null or empty")
                }
            }
              , el = () => {
                let e = window.location.href
                  , s = "".concat("https://www.instagram.com/", "?url=").concat(encodeURIComponent(e))
                  , l = window.screen.width
                  , a = window.screen.height;
                window.open(s, "_blank", "width=".concat(600, ",height=").concat(400, ",left=").concat(l / 2 - 300, ",top=").concat(a / 2 - 200))
            }
              , ea = e => {
                let s, {type: l, name: n} = e;
                switch (l) {
                case 0:
                    s = (0,
                    a.jsx)(d(), {
                        href: "https://itunes.apple.com/us/app/".concat(n, "?mt=8"),
                        title: "GD App Store Download",
                        target: "_blank",
                        children: (0,
                        a.jsx)("img", {
                            src: "/assets/apps-logo/app-store.png",
                            alt: "GD App Store"
                        })
                    }, "".concat(n, "_").concat(l));
                    break;
                case 1:
                    s = (0,
                    a.jsx)(d(), {
                        href: "https://play.google.com/store/apps/details?id=".concat(n),
                        title: "GD Google Play Download",
                        target: "_blank",
                        children: (0,
                        a.jsx)("img", {
                            src: "/assets/apps-logo/google-play.png",
                            alt: "GD Google Play"
                        })
                    }, "".concat(n, "_").concat(l));
                    break;
                case 2:
                    s = (0,
                    a.jsx)(d(), {
                        href: "https://www.amazon.com/gp/product/".concat(n),
                        title: "GD Amazon",
                        target: "_blank",
                        children: (0,
                        a.jsx)("img", {
                            src: "/assets/apps-logo/amazon.png",
                            alt: "GD Amazon"
                        })
                    }, "".concat(n, "_").concat(l))
                }
                return s
            }
            ;
            return (0,
            a.jsxs)("div", {
                className: _().gameDetail,
                children: [(0,
                a.jsxs)("div", {
                    className: "flex flex-col lg:flex-row gap-6",
                    children: [(0,
                    a.jsxs)("div", {
                        className: "lg:w-2/3 flex flex-col gap-6",
                        children: [(0,
                        a.jsx)("div", {
                            dangerouslySetInnerHTML: {
                                __html: '<iframe src="'.concat(K(), '" width="100%" height="680" allowFullScreen />')
                            }
                        }), (0,
                        a.jsxs)("div", {
                            className: "box",
                            children: [(0,
                            a.jsxs)("div", {
                                className: "flex flex-wrap justify-between items-center gap-5 mb-6",
                                children: [(0,
                                a.jsxs)("div", {
                                    className: "flex flex-col md:flex-row justify-end gap-4 max-sm:w-full max-sm:order-last",
                                    children: [(0,
                                    a.jsx)(p.zx, {
                                        buttonType: "buttonSecondary",
                                        text: "Share",
                                        onClick: () => B(!0)
                                    }), (0,
                                    a.jsx)(d(), {
                                        className: "".concat(j().button, " buttonSecondary text-center"),
                                        href: K(),
                                        target: "_blank",
                                        children: "Open in a new tab"
                                    })]
                                }), Boolean(null == U ? void 0 : U.exclusiveGame) && (0,
                                a.jsx)("img", {
                                    src: "/assets/icons/dimond-blue-icon.svg",
                                    alt: "GD Exclusive Game",
                                    className: "w-[42px] h-[39px]",
                                    "data-tooltip-id": "gd-tooltip",
                                    "data-tooltip-html": "This game is GD exclusive",
                                    "data-tooltip-delay-show": 300
                                })]
                            }), (0,
                            a.jsxs)("div", {
                                className: "info-line",
                                children: [(0,
                                a.jsx)("div", {
                                    className: "row",
                                    children: (0,
                                    a.jsxs)("span", {
                                        className: "flex flex-1",
                                        children: ["Game Title:", (0,
                                        a.jsx)("strong", {
                                            className: "font-semibold pl-1",
                                            children: null == U ? void 0 : U.title
                                        })]
                                    })
                                }), (0,
                                a.jsxs)("div", {
                                    className: "row",
                                    children: [(0,
                                    a.jsxs)("span", {
                                        className: "flex flex-1",
                                        children: ["Published by:", (0,
                                        a.jsx)(d(), {
                                            href: "/games/?company=".concat(null == U ? void 0 : U.company),
                                            className: "text-interdimensional underline pl-1",
                                            children: null == U ? void 0 : U.company
                                        })]
                                    }), (0,
                                    a.jsxs)("span", {
                                        children: ["Mobile Web Compatible: ", (null == U ? void 0 : null === (s = U.mobile) || void 0 === s ? void 0 : s.length) > 0 ? null == U ? void 0 : U.mobile.join(" - ").replaceAll("For", "") : "No"]
                                    })]
                                }), (null == U ? void 0 : null === (l = U.languages) || void 0 === l ? void 0 : l.length) > 0 && (0,
                                a.jsxs)("div", {
                                    className: "row",
                                    children: [(0,
                                    a.jsx)("span", {
                                        className: "flex flex-1",
                                        children: "Language"
                                    }), (0,
                                    a.jsx)("div", {
                                        className: "tags",
                                        children: null == U ? void 0 : null === (c = U.languages) || void 0 === c ? void 0 : c.map( (e, s) => (0,
                                        a.jsx)("span", {
                                            className: "tag cursor-pointer",
                                            onClick: () => ee("languages", e),
                                            children: e
                                        }, e + s))
                                    })]
                                }), ((null == U ? void 0 : null === (r = U.gender) || void 0 === r ? void 0 : r.length) || (null == U ? void 0 : null === (g = U.ageGroup) || void 0 === g ? void 0 : g.length)) > 0 && (0,
                                a.jsxs)("div", {
                                    className: "row",
                                    children: [(null == U ? void 0 : null === (y = U.gender) || void 0 === y ? void 0 : y.length) > 0 && (0,
                                    a.jsxs)("div", {
                                        className: "flex justify-between gap-4",
                                        children: [(0,
                                        a.jsx)("span", {
                                            className: "flex",
                                            children: "Gender"
                                        }), (0,
                                        a.jsx)("div", {
                                            className: "tags",
                                            children: null == U ? void 0 : null === (C = U.gender) || void 0 === C ? void 0 : C.map( (e, s) => (0,
                                            a.jsx)("span", {
                                                className: "tag",
                                                children: e
                                            }, e + s))
                                        })]
                                    }), (null == U ? void 0 : null === (G = U.ageGroup) || void 0 === G ? void 0 : G.length) > 0 && (0,
                                    a.jsxs)("div", {
                                        className: "flex justify-between gap-4",
                                        children: [(0,
                                        a.jsx)("span", {
                                            className: "flex",
                                            children: "Age Group"
                                        }), (0,
                                        a.jsx)("div", {
                                            className: "tags",
                                            children: null == U ? void 0 : null === (T = U.ageGroup) || void 0 === T ? void 0 : T.map( (e, s) => (0,
                                            a.jsx)("span", {
                                                className: "tag",
                                                children: e
                                            }, e + s))
                                        })]
                                    })]
                                })]
                            }), (0,
                            a.jsxs)("article", {
                                children: [(0,
                                a.jsx)("h3", {
                                    children: "DESCRIPTION"
                                }), (0,
                                a.jsx)("p", {
                                    className: "mb-10",
                                    children: null == U ? void 0 : U.description
                                }), (0,
                                a.jsx)("h3", {
                                    children: "INSTRUCTIONS"
                                }), (0,
                                a.jsx)("p", {
                                    children: null == U ? void 0 : U.instruction
                                })]
                            })]
                        }), (0,
                        a.jsxs)(a.Fragment, {
                            children: [(0,
                            a.jsxs)("div", {
                                className: "box copy-box",
                                children: [(0,
                                a.jsx)("h3", {
                                    children: "EMBED"
                                }), (0,
                                a.jsxs)("div", {
                                    className: "row mb-6",
                                    children: [(0,
                                    a.jsx)("span", {
                                        ref: L,
                                        className: "copy-input",
                                        children: (M = K("https://www.example.com/games/{game-path}"),
                                        '<iframe src="'.concat("".concat(M), '" width="').concat(null == U ? void 0 : U.width, '" height="').concat(null == U ? void 0 : U.height, '" scrolling="none" frameborder="0"></iframe>'))
                                    }), (0,
                                    a.jsx)(p.zx, {
                                        buttonType: "buttonPrimary",
                                        text: "Copy",
                                        onClick: () => $(null == L ? void 0 : L.current)
                                    })]
                                }), (0,
                                a.jsx)("h3", {
                                    children: "EXAMPLE URL"
                                }), (0,
                                a.jsxs)("div", {
                                    className: "row",
                                    children: [(0,
                                    a.jsx)("span", {
                                        ref: q,
                                        className: "copy-input",
                                        children: K()
                                    }), (0,
                                    a.jsx)(p.zx, {
                                        buttonType: "buttonPrimary",
                                        text: "Copy",
                                        onClick: () => $(null == q ? void 0 : q.current)
                                    })]
                                })]
                            }), (0,
                            a.jsx)("div", {
                                className: "box",
                                children: (0,
                                a.jsxs)("article", {
                                    className: "flex flex-col gap-4 !max-h-40",
                                    children: [(0,
                                    a.jsx)("h3", {
                                        className: "!mb-0",
                                        children: "IMPORTANT NOTIFICATION ABOUT EMBEDDING GAMES"
                                    }), (0,
                                    a.jsxs)("p", {
                                        children: ["Ads should be requested from the game's page url to avoid loss of ads performance. To make this happen please adjust your game frame request url as follows: gd_sdk_referrer_url should be added to the request url . To do that please modify your request url as:", (0,
                                        a.jsx)("strong", {
                                            className: "block mt-3",
                                            children: "https://html5.gamedistribution.com/GAME_ID/?gd_sdk_referrer_url=YOUR_EXACT_GAME_PAGE_URL"
                                        })]
                                    }), (0,
                                    a.jsx)("h3", {
                                        className: "!mb-0",
                                        children: "CORRECT USAGE"
                                    }), (0,
                                    a.jsxs)("p", {
                                        children: ["If your page url is ", (0,
                                        a.jsx)("strong", {
                                            children: "https://www.example.com/games"
                                        }), " then your request url should be as follows:", (0,
                                        a.jsxs)("strong", {
                                            className: "block mt-3",
                                            children: ["https://", "html5", ".gamedistribution.com/", U.md5, "/?gd_sdk_referrer_url=https://www.example.com/games"]
                                        })]
                                    }), (0,
                                    a.jsx)("p", {
                                        children: "You can check example url below to see how we are using in this page."
                                    }), (0,
                                    a.jsx)("h3", {
                                        className: "!mb-0",
                                        children: "WRONG USAGE"
                                    }), (0,
                                    a.jsxs)("strong", {
                                        className: "block",
                                        children: ["https://", "html5", ".gamedistribution.com/", U.md5, "/"]
                                    })]
                                })
                            })]
                        })]
                    }), (0,
                    a.jsxs)("div", {
                        className: "lg:w-1/3",
                        children: [(null == W ? void 0 : null === (A = W.data) || void 0 === A ? void 0 : null === (D = A.gamesSearched) || void 0 === D ? void 0 : D.hits.length) > 0 && (0,
                        a.jsxs)(a.Fragment, {
                            children: [(0,
                            a.jsx)("h2", {
                                className: "page-title !text-1.5xl",
                                children: "Similar Games"
                            }), (0,
                            a.jsx)("div", {
                                className: "grid grid-cols-2 gap-2 mb-5",
                                children: null == U ? void 0 : U.similarGames.slice(0, 6).map(e => {
                                    var s;
                                    return (0,
                                    a.jsx)(N.Z, {
                                        name: e.title,
                                        companyName: e.company,
                                        url: null === (s = e.slugs[0]) || void 0 === s ? void 0 : s.name,
                                        image: (0,
                                        v.BA)(e.assets, "512x384"),
                                        imgClass: "lg:!max-h-[134px]"
                                    }, e.objectID)
                                }
                                )
                            })]
                        }), (0,
                        a.jsxs)("div", {
                            className: "box game-info",
                            children: [(0,
                            a.jsxs)("ul", {
                                className: "row",
                                children: [(0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Published"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: new Date(null == U ? void 0 : U.firstActiveDate).toDateString()
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Last Updated"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: new Date(null == U ? void 0 : U.lastPublishedAt).toDateString()
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Type"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: null == U ? void 0 : null === (E = U.type) || void 0 === E ? void 0 : E.toUpperCase()
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Subtype"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: null == U ? void 0 : U.subType
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Screen Orientation"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: null == U ? void 0 : U.mobileMode
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Dimensions"
                                    }), (0,
                                    a.jsx)("span", {
                                        children: "".concat(null == U ? void 0 : U.width, "x").concat(null == U ? void 0 : U.height)
                                    })]
                                }), (0,
                                a.jsxs)("li", {
                                    children: [(0,
                                    a.jsx)("strong", {
                                        children: "Company"
                                    }), (0,
                                    a.jsx)("span", {
                                        onClick: () => ee("company", null == U ? void 0 : U.company),
                                        className: "cursor-pointer text-interdimensional underline",
                                        children: null == U ? void 0 : U.company
                                    })]
                                })]
                            }), (0,
                            a.jsxs)("div", {
                                className: "row",
                                children: [(0,
                                a.jsx)("h4", {
                                    children: "Genres"
                                }), (0,
                                a.jsx)("div", {
                                    className: "tags",
                                    children: null == U ? void 0 : null === (S = U.categories) || void 0 === S ? void 0 : S.map( (e, s) => (0,
                                    a.jsx)("span", {
                                        className: "tag cursor-pointer",
                                        onClick: () => ee("genres", e),
                                        children: e
                                    }, e + s))
                                })]
                            }), (0,
                            a.jsxs)("div", {
                                className: "row",
                                children: [(0,
                                a.jsx)("h4", {
                                    children: "Tags"
                                }), (0,
                                a.jsx)("div", {
                                    className: "tags",
                                    children: null == U ? void 0 : null === (I = U.tags) || void 0 === I ? void 0 : I.map( (e, s) => (0,
                                    a.jsx)("span", {
                                        className: "tag",
                                        children: e
                                    }, e + s))
                                })]
                            }), (null == U ? void 0 : null === (O = U.bundles) || void 0 === O ? void 0 : O.length) > 0 && (0,
                            a.jsxs)("div", {
                                className: "row",
                                children: [(0,
                                a.jsx)("h4", {
                                    children: "Apps/Amazon"
                                }), (0,
                                a.jsx)("div", {
                                    className: "flex gap-1 items-center",
                                    children: null == U ? void 0 : null === (P = U.bundles) || void 0 === P ? void 0 : P.map(e => ea(e))
                                })]
                            })]
                        }), (0,
                        a.jsxs)("div", {
                            className: "mt-6",
                            children: [(0,
                            a.jsxs)("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [(0,
                                a.jsx)("h4", {
                                    className: "!mb-0",
                                    children: "THUMBNAILS & ICONS"
                                }), (0,
                                a.jsx)(p.zx, {
                                    buttonType: "buttonPrimary",
                                    text: "Download",
                                    className: "flex gap-1",
                                    onClick: Q,
                                    children: (0,
                                    a.jsx)(i.Z, {
                                        className: "w-5 stroke-2 stroke-white"
                                    })
                                })]
                            }), (0,
                            a.jsx)("div", {
                                className: "".concat(_().gameThumnailImage, " grid gap-4"),
                                children: null == U ? void 0 : null === (R = U.assets) || void 0 === R ? void 0 : R.map( (e, s) => {
                                    let l = "".concat("https://img.gamedistribution.com/").concat(e.name);
                                    return (0,
                                    a.jsx)("div", {
                                        className: k[s],
                                        children: (0,
                                        a.jsx)("img", {
                                            alt: null == e ? void 0 : e.name,
                                            src: l
                                        })
                                    }, e.name)
                                }
                                )
                            })]
                        })]
                    })]
                }), (0,
                a.jsx)("div", {
                    className: "sm:-mx-7 mt-5",
                    children: (0,
                    a.jsx)(f.Z, {})
                }), (0,
                a.jsx)(w.Z, {
                    isOpen: z,
                    closeModal: () => {
                        V()
                    }
                    ,
                    panelClassName: "max-w-3xl pt-[3.375rem] pb-[4.375rem]",
                    title: (0,
                    a.jsx)("div", {
                        className: "text-[1.875rem] text-cetaceanBlue text-center py-1 font-semibold mb-[2.813rem]",
                        children: "Share"
                    }),
                    children: (0,
                    a.jsxs)("div", {
                        className: "px-[5.625rem]",
                        children: [(0,
                        a.jsxs)("ul", {
                            className: "grid grid-cols-6 gap-x-[22px]",
                            children: [(0,
                            a.jsx)(h.Dk, {
                                url: window.location.href,
                                children: (0,
                                a.jsx)("img", {
                                    src: "/assets/facebook-share.svg",
                                    alt: "facebook-share"
                                })
                            }), (0,
                            a.jsx)(h.B, {
                                url: window.location.href,
                                children: (0,
                                a.jsx)("img", {
                                    src: "/assets/x-share.svg",
                                    width: 56,
                                    alt: "twitter-share"
                                })
                            }), (0,
                            a.jsx)("li", {
                                className: "cursor-pointer",
                                onClick: el,
                                children: (0,
                                a.jsx)("img", {
                                    src: "/assets/instagram-share.svg",
                                    alt: "instagram-share"
                                })
                            }), (0,
                            a.jsx)(h.r2, {
                                url: window.location.href,
                                children: (0,
                                a.jsx)("img", {
                                    src: "/assets/linkedin-share.svg",
                                    alt: "linkedin-share"
                                })
                            }), (0,
                            a.jsx)(h.N0, {
                                url: window.location.href,
                                children: (0,
                                a.jsx)("img", {
                                    src: "/assets/whatsupp-share.svg",
                                    alt: "whatsupp-share"
                                })
                            }), (0,
                            a.jsx)(h.tq, {
                                url: window.location.href,
                                children: (0,
                                a.jsx)("img", {
                                    className: "mr-[0]",
                                    src: "/assets/telegram-share.svg",
                                    alt: "telegram-share"
                                })
                            })]
                        }), (0,
                        a.jsx)("div", {
                            ref: X,
                            className: "copy-input mt-10",
                            children: window.location.href
                        }), (0,
                        a.jsx)("div", {
                            className: "w-full flex justify-center mt-[35px]",
                            children: (0,
                            a.jsx)(p.zx, {
                                buttonType: "buttonPrimary",
                                text: "Copy",
                                className: "xm",
                                onClick: es
                            })
                        })]
                    })
                })]
            })
        }
        ;
        var G = !0;
        s.default = C
    },
    949: function(e) {
        e.exports = {
            productList: "ProductItem_productList__sA9IM"
        }
    },
    37986: function(e) {
        e.exports = {
            searchInput: "games_searchInput__3kX7E",
            gameThumnailImage: "games_gameThumnailImage__eM2Tb",
            hamburgerIcon: "games_hamburgerIcon__Gsqul",
            sortBy: "games_sortBy__q3C8O",
            gameDetail: "games_gameDetail__tX9YO"
        }
    }
}, function(e) {
    e.O(0, [4344, 9774, 2888, 179], function() {
        return e(e.s = 10893)
    }),
    _N_E = e.O()
}
]);
