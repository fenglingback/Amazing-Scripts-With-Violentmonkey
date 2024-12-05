// ==UserScript==
// @name        back to top
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     2.0
// @author      cxfl
// @description 2024/7/21 08:59:17
// ==/UserScript==


let targetName = ["gotop"];

function getUniqueClassAndIds() {
    const classes = new Set();
    const ids = new Set();

    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
        const className = element.className;
        // 检查 className 是否为字符串
        if (typeof className === 'string' && className.length > 0) {
            className.split(/\s+/).forEach(cls => classes.add(cls));
        }
        const id = element.id;
        if (id) {
            ids.add(id);
        }
    });

    const uniqueClasses = Array.from(classes);
    const uniqueIds = Array.from(ids);

    return { uniqueClasses, uniqueIds };
}

const { uniqueClasses, uniqueIds } = getUniqueClassAndIds();
console.log('Unique Classes:', uniqueClasses);
console.log('Unique IDs:', uniqueIds);



// 判断页面中是否存在class或id匹配的元素
let isMatch = targetName.some(name => uniqueClasses.includes(name) || uniqueIds.includes(name));

// 如果页面中存在class或id匹配的元素，则执行以下操作
if (!isMatch) {
    let timeoutIds = [];
    // 创建按钮
    var btn = document.createElement("button");
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
    var svg = btn.querySelector("svg");
    svg.style.transition = "stroke 0.5s";

    function hideBtn() {
        btn.style.display = "none";
    }

    /**
     * 
     * @param {number} delay 延迟时间，单位ms
     */
    function delayHide(delay) {
        timeoutIds.forEach(clearTimeout);
        const id = setTimeout(hideBtn, delay);
        timeoutIds.push(id);
    }

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

    // 回到顶
    btn.addEventListener("click", clickHandler);
    function clickHandler(e) {
        btn.style.backgroundColor = "black";
        svg.querySelector("path").style.stroke = "white";
        let timer = setInterval(function () {
            var distanceY = document.documentElement.scrollTop || document.body.scrollTop;//兼容
            if (distanceY == 0) {
                clearInterval(timer);
                btn.style.backgroundColor = "white";
                svg.querySelector("path").style.stroke = "black";
                return;
            }
            var speed = Math.ceil(distanceY / 16) + 5;//speed先快后慢
            document.documentElement.scrollTop = distanceY - speed;
        }, 10);
    }

    // 将按钮添加到body
    document.body.appendChild(btn);

    function scrollFunction() {
        timeoutIds.forEach(clearTimeout);
        if (window.innerWidth < 1000) {
            hideBtn();
        } else if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block";
            delayHide(3000);
        } else {
            hideBtn();
        }
    }

    // 只监控root元素滚动事件
    document.addEventListener("scroll", scrollFunction, true);

    // 初始检查窗口宽度
    if (window.innerWidth >= 1000) {
        scrollFunction();
    }

    // 当窗口大小改变时检查窗口宽度
    window.onresize = function () {
        scrollFunction();
    };
}

