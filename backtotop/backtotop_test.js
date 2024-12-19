// ==UserScript==
// @name        back to top
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.7
// @author      cxfl
// @description 2024/12/18 02:04:22
// @exclude-match        *://www.crxsoso.com/*
// @exclude-match        *://sanhua.himrr.com/*
// @exclude-match        *://abhisaha.com/*
// ==/UserScript==

(function () {
    'use strict';

    const targetNames = ["gotop", "back-to-top", "top", "bottom-24", "fabtn_back_to_top", "返回顶部", "go-up", "top-link", "fbth-scrolltotop", "backToTop", "ghd-scroll-to-top", "return-img-box", "scrollUpButton-zhwiki", "goTop", "go2top", "scroll-top", "backtop", "arco-icon-arrow-up", "comp__SsBacktop", "ast-scroll-top"];

    function getUniqueClassIdTitle() {
        const classes = new Set();
        const ids = new Set();
        const titles = new Set();

        document.querySelectorAll('div, a, span, button, img, svg').forEach(element => {
            if (typeof element.className === 'string') {
                element.className.split(/\s+/).forEach(cls => classes.add(cls));
            }
            if (element.id) ids.add(element.id);
            const title = element.getAttribute('title');
            if (title) titles.add(title);
        });

        return {
            uniqueClasses: Array.from(classes),
            uniqueIds: Array.from(ids),
            uniqueTitles: Array.from(titles)
        };
    }

    function checkIsExist() {
        const { uniqueClasses, uniqueIds, uniqueTitles } = getUniqueClassIdTitle();
        return targetNames.some(name =>
            uniqueClasses.includes(name) ||
            uniqueIds.includes(name) ||
            uniqueTitles.includes(name)
        );
    }

    function createButton() {
        const btn = document.createElement("button");
        btn.id = "cxfl-BTT-btn";
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M5 12l7-7 7 7" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        Object.assign(btn.style, {
            display: "none",
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: "99999",
            border: "2px solid black",
            backgroundColor: "white",
            borderRadius: "10px",
            cursor: "pointer",
            padding: "7px",
            outline: "none",
            transition: "background-color 0.5s, color 0.5s"
        });

        const svg = btn.querySelector("svg");
        svg.style.transition = "stroke 0.5s";

        let hideTimeout;

        btn.addEventListener("mouseover", () => {
            clearTimeout(hideTimeout);
            btn.style.backgroundColor = "black";
            svg.querySelector("path").style.stroke = "white";
        });

        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "white";
            svg.querySelector("path").style.stroke = "black";
            delayHide();
        });

        btn.addEventListener("click", () => {
            btn.style.backgroundColor = "black";
            svg.querySelector("path").style.stroke = "white";
            smoothScrollToTop();
        });

        document.body.appendChild(btn);

        function delayHide() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                btn.style.display = "none";
            }, 3000);
        }

        function smoothScrollToTop() {
            const scrollToTop = () => {
                const c = scrollContainer.scrollTop;
                if (c > 0) {
                    window.requestAnimationFrame(scrollToTop);
                    scrollContainer.scrollTo(0, c - c / 8);
                } else {
                    btn.style.backgroundColor = "white";
                    svg.querySelector("path").style.stroke = "black";
                }
            };
            scrollToTop();
        }

        return { btn, delayHide };
    }

    function findScrollContainer() {
        const elements = [document.documentElement, document.body, ...document.body.children];
        for (const el of elements) {
            if (el.scrollHeight > el.clientHeight) {
                return el;
            }
        }
        return window;
    }

    function init() {
        if (checkIsExist()) {
            console.log("该网站存在回到顶部按钮！");
            return;
        }

        console.log("页面不存在回到顶部按钮，启动生成！");
        const { btn, delayHide } = createButton();

        const scrollContainer = findScrollContainer();
        let lastKnownScrollPosition = 0;
        let ticking = false;

        function updateScrollPosition(scrollPos) {
            if (window.innerWidth < 1000) {
                btn.style.display = "none";
            } else if (scrollPos > 20) {
                btn.style.display = "block";
                delayHide();
            } else {
                btn.style.display = "none";
            }
        }

        function onScroll() {
            lastKnownScrollPosition = scrollContainer.scrollTop;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateScrollPosition(lastKnownScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        }

        scrollContainer.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        // 初始检查
        onScroll();

        // 监听 DOM 变化，以防止动态加载的内容影响滚动检测
        const observer = new MutationObserver(() => {
            onScroll();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期检查滚动位置，以防其他方法失效
        setInterval(onScroll, 1000);
    }

    // 使用 requestIdleCallback 或 setTimeout 来延迟初始化，确保不会影响页面加载性能
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            init();
        });
    } else {
        setTimeout(init, 1000);
    }
})();

