// ==UserScript==
// @name        back to top
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     2.1.1
// @author      cxfl
// @description 2024/7/21 08:59:17
// ==/UserScript==


let targetNames = ["gotop", "el-backtop", "back-to-top", "top", "bottom-24", "fabtn_back_to_top", "返回顶部", "go-up", "top-link", "fbth-scrolltotop", "backToTop", "ghd-scroll-to-top", "return-img-box", "scrollUpButton-zhwiki", "goTop"];
let timeoutIds = [];

// 创建按钮
const btn = document.createElement("button");
btn.id = "cxfl-BTT-btn";

// SVG图标作为按钮内容
btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M5 12l7-7 7 7" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// 按钮CSS
btn.style.display = "none"; // 默认隐藏
btn.style.position = "fixed"; // 固定在页面
btn.style.bottom = "80px"; // 距离底部80像素
btn.style.right = "20px"; // 距离右侧20像素
btn.style.zIndex = "99"; // 确保按钮在最前
btn.style.border = "2px solid black"; // 黑色边框
btn.style.backgroundColor = "white"; // 按钮白色背景
btn.style.borderRadius = "10px"; // 按钮圆角
btn.style.cursor = "pointer"; // 鼠标悬停时光标变为指针
btn.style.padding = "7px"; // 按钮内边距
btn.style.outline = "none"; // 无外边框
btn.style.transition = "background-color 0.5s, color 0.5s"; // 渐变效果

// SVG样式
const svg = btn.querySelector("svg");
svg.style.transition = "stroke 0.5s";

// 悬停时反转颜色
btn.onmouseover = function () {
    timeoutIds.forEach(clearTimeout);
    btn.style.backgroundColor = "black";
    svg.querySelector("path").style.stroke = "white";
};
btn.onmouseout = function () {
    btn.style.backgroundColor = "white";
    svg.querySelector("path").style.stroke = "black";
    delayHide(3000);
};

// 回到顶部
btn.addEventListener("click", () => {
    btn.style.backgroundColor = "black";
    const svg = btn.querySelector("svg");
    svg.querySelector("path").style.stroke = "white";
    let timer = setInterval(function () {
        var distanceY = document.documentElement.scrollTop || document.body.scrollTop; //兼容
        if (distanceY == 0) {
            clearInterval(timer);
            btn.style.backgroundColor = "white";
            svg.querySelector("path").style.stroke = "black";
            return;
        }
        var speed = Math.ceil(distanceY / 16) + 5;//speed先快后慢
        document.documentElement.scrollTop = distanceY - speed;
    }, 10);
});

document.body.appendChild(btn);


function getUniqueClassIdTitle() {
    const classes = new Set();
    const ids = new Set();
    const titles = new Set();

    // 获取页面中所有div、a、span、button元素
    const elements = document.querySelectorAll('div, a, span, button, img');

    elements.forEach(element => {
        const className = element.className;
        // 检查 className 是否为字符串
        if (typeof className === 'string' && className.length > 0) {
            className.split(/\s+/).forEach(cls => classes.add(cls));
        }
        const id = element.id;
        if (typeof id === 'string' && id.length > 0) {
            ids.add(id);
        }

        const title = element.getAttribute('title');
        if (title) {
            titles.add(title);
        }
    });

    const uniqueClasses = Array.from(classes);
    const uniqueIds = Array.from(ids);
    const uniqueTitles = Array.from(titles);

    // console.log(uniqueClasses);
    // console.log(uniqueIds);

    return { uniqueClasses, uniqueIds, uniqueTitles };
}

function checkBtn() {
    const { uniqueClasses, uniqueIds, uniqueTitles } = getUniqueClassIdTitle();

    // 判断页面中是否存在特定的类名、id或title，并打印存在的类名、id或title
    let isMatch = targetNames.some(name => {
        if (uniqueClasses.includes(name) || uniqueIds.includes(name) || uniqueTitles.includes(name)) {
            // console.log(name);
            return true;
        } else {
            return false;
        }
    })

    if (isMatch) {
        btn.style.display = "none";
    } else if (window.innerWidth < 1000) {
        btn.style.display = "none";
    } else if (document.body.scrollTop > 160 || document.documentElement.scrollTop > 160) {
        btn.style.display = "block";
        delayHide(3000);
    } else {
        btn.style.display = "none";
    }
}

function debounceCheckBtn(delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(checkBtn, delay);
    };
}

function delayHide(delay) {
    timeoutIds.forEach(clearTimeout);
    const id = setTimeout(() => {
        btn.style.display = "none";
    }, delay);
    timeoutIds.push(id);
}


document.addEventListener("scroll", debounceCheckBtn(300), true);

// 初始检查窗口宽度
if (window.innerWidth >= 1000) {
    checkBtn();
}

// 当窗口大小改变时检查窗口宽度
window.onresize = function () {
    checkBtn();
};
