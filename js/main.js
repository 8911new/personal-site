/* =================================================================
   林深 · 个人网站交互脚本
   功能：鼠标光晕跟随 / 导航滚动状态 / 移动端菜单 /
        滚动渐入(IntersectionObserver) / 列表交错入场
   ================================================================= */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    /* ---------- 1. 鼠标光晕跟随 ---------- */
    const spotlight = document.querySelector('.cursor-spotlight');
    if (spotlight && !isTouch && !prefersReducedMotion) {
        let raf = null;
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        // 用 rAF 做缓动跟随，避免高频 mousemove 抖动
        function loop() {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            spotlight.style.setProperty('--mx', currentX + 'px');
            spotlight.style.setProperty('--my', currentY + 'px');
            raf = requestAnimationFrame(loop);
        }

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!raf) loop();
        }, { passive: true });

        loop();
    }

    /* ---------- 2. 导航滚动状态 ---------- */
    const nav = document.querySelector('.nav');
    const onScroll = () => {
        if (window.scrollY > 24) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- 3. 移动端菜单 ---------- */
    const toggle = document.querySelector('.nav__menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    function setMenu(open) {
        toggle.classList.toggle('is-open', open);
        mobileMenu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            setMenu(!toggle.classList.contains('is-open'));
        });
        // 点击菜单项后关闭
        mobileMenu.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => setMenu(false));
        });
        // ESC 关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.classList.contains('is-open')) setMenu(false);
        });
    }

    /* ---------- 4. 滚动渐入（IntersectionObserver） ---------- */
    // 给需要渐入的元素自动打 .reveal 标签，避免在 HTML 里散落写
    const revealTargets = [
        '.hero__title',
        '.hero__lede',
        '.hero__scroll',
        '.section__head',
        '.about__portrait',
        '.about__lede',
        '.about__text > p',
        '.about__facts > div',
        '.article',
        '.work',
        '.contact__line',
        '.contact__email',
        '.contact__links'
    ];

    const revealElements = [];
    revealTargets.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
            if (!prefersReducedMotion) el.classList.add('reveal');
            revealElements.push(el);
        });
    });

    // 文章 / 作品集内的元素按顺序添加 stagger 延迟
    document.querySelectorAll('.article').forEach((el, i) => {
        el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    document.querySelectorAll('.work-grid > .work').forEach((el, i) => {
        el.setAttribute('data-delay', String(Math.min(i + 1, 4)));
    });
    document.querySelectorAll('.about__facts > div').forEach((el, i) => {
        el.setAttribute('data-delay', String((i % 4) + 1));
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target); // 一次性入场
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });
        revealElements.forEach((el) => io.observe(el));
    } else {
        // 无动画偏好或浏览器不支持：直接显示
        revealElements.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- 5. 文章列表项键盘可达性 ---------- */
    document.querySelectorAll('.article, .work').forEach((el) => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

    /* ---------- 6. 平滑滚动到锚点（强化默认行为） ---------- */
    // CSS scroll-behavior:smooth 已处理，这里仅为不支持时兜底
    if (!('scrollBehavior' in document.documentElement.style) && !prefersReducedMotion) {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href').slice(1);
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

})();
