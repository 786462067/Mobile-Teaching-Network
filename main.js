/**
 * 移动教学网门户 - 主脚本
 */

// ============================================
// 登录页面脚本
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // 自动填充账号密码（演示用）
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.value = 'teacher01';
    }
    if (passwordInput) {
        passwordInput.value = 'password123';
    }
    
    // 密码显示/隐藏切换
    const togglePasswordBtn = document.getElementById('togglePassword');
    
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (eyeOpen && eyeClosed) {
                eyeOpen.classList.toggle('hidden');
                eyeClosed.classList.toggle('hidden');
            }
        });
    }
    
    // 登录表单提交 - 原型直接跳转
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 原型直接跳转到工作台
            window.location.href = 'dashboard.html';
        });
    }
});

// ============================================
// 工作台页面脚本
// ============================================

// Tab切换功能
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // 移除所有active状态
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 添加active状态
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    // 待办事项点击功能
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.todo-title').textContent;
            console.log('跳转到:', title);
            // 实际项目中这里会跳转到对应的应用页面
        });
    });
    
    // 应用卡片点击跳转
    const appCards = document.querySelectorAll('.app-card:not(.add-card)');
    appCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // 忽略添加/移除按钮的点击
            if (e.target.closest('.app-remove') || e.target.closest('.app-add-btn')) return;

            const appName = this.querySelector('.app-name').textContent;

            // 应用跳转地址映射
            const appRoutes = {
                '文件传输': './fileTransfer/index.html',
            };

            const targetUrl = appRoutes[appName];
            if (targetUrl) {
                window.open(targetUrl, '_blank');
            } else {
                alert(appName + ' 应用正在开发中，敬请期待！');
            }
        });
    });

    // 添加应用按钮
    const addAppBtn = document.getElementById('addAppBtn');
    const addAppModal = document.getElementById('addAppModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    if (addAppBtn && addAppModal) {
        addAppBtn.addEventListener('click', function() {
            addAppModal.classList.remove('hidden');
            renderModalApps();
        });
        
        // 点击遮罩关闭
        addAppModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            addAppModal.classList.add('hidden');
        });
    }
    
    // 全部应用 - 添加/移除功能
    const appAddBtns = document.querySelectorAll('.app-add-btn');
    appAddBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.classList.contains('added')) {
                // 移除应用
                this.classList.remove('added');
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    添加
                `;
            } else {
                // 添加应用
                this.classList.add('added');
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    已添加
                `;
            }
        });
    });
    
    // 我的应用 - 移除功能
    const appRemoveBtns = document.querySelectorAll('.app-remove');
    appRemoveBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.app-card');
            
            // 添加删除动画
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                // 检查是否还有应用
                checkEmptyState();
            }, 200);
        });
    });
    
    // 搜索功能
    const searchInput = document.getElementById('appsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const appCards = document.querySelectorAll('#all-apps .app-card');

            appCards.forEach(card => {
                const appName = card.querySelector('.app-name').textContent.toLowerCase();
                const appDesc = card.querySelector('.app-desc').textContent.toLowerCase();

                if (appName.includes(query) || appDesc.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 退出登录按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = './login.html';
            }
        });
    }
});

// 渲染弹窗中的应用列表
function renderModalApps() {
    const modalAppsGrid = document.getElementById('modalAppsGrid');
    if (!modalAppsGrid) return;
    
    // 从"全部应用"中获取应用数据
    const allApps = [
        { name: '教务管理', desc: '成绩录入、课表查询', color: 'blue', icon: 'list' },
        { name: '学生管理', desc: '学籍信息、档案管理', color: 'green', icon: 'user' },
        { name: '在线学习', desc: '课程资源、在线考试', color: 'purple', icon: 'book' },
        { name: '排课系统', desc: '智能排课、教室管理', color: 'orange', icon: 'calendar' },
        { name: '考试中心', desc: '在线考试、试卷管理', color: 'teal', icon: 'check' },
        { name: '通知公告', desc: '校园通知、消息推送', color: 'pink', icon: 'bell' },
        { name: '文件传输', desc: '文件上传、审批管理', color: 'indigo', icon: 'folder' },
        { name: '数据分析', desc: '教学统计、报表导出', color: 'red', icon: 'chart' }
    ];
    
    modalAppsGrid.innerHTML = allApps.map(app => `
        <div class="modal-app-item" data-app="${app.name}">
            <div class="app-icon ${app.color}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    ${getIconPath(app.icon)}
                </svg>
            </div>
            <h4 class="app-name">${app.name}</h4>
        </div>
    `).join('');
    
    // 添加点击事件 - 单选直接添加
    const modalAppItems = modalAppsGrid.querySelectorAll('.modal-app-item');
    modalAppItems.forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.querySelector('.app-name').textContent;
            const appIcon = this.querySelector('.app-icon').className.replace('app-icon ', '');
            
            // 获取应用信息
            const appData = allApps.find(a => a.name === appName);
            if (appData) {
                addAppToMyApps(appData);
                addAppModal.classList.add('hidden');
            }
        });
    });
}

// 获取图标路径
function getIconPath(icon) {
    const icons = {
        list: '<path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        user: '<path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 20c0-3.33 6-5 6-5s6 1.67 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 7H20M4 12a2.5 2.5 0 012.5-2.5H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 2v4m8-4v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        check: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        bell: '<path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        folder: '<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        chart: '<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    return icons[icon] || icons.list;
}

// 添加应用到我的应用
function addAppToMyApps(appData) {
    const myAppsGrid = document.querySelector('#my-apps .apps-grid');
    const emptyState = document.getElementById('emptyState');
    
    if (!myAppsGrid) return;
    
    // 检查是否已存在
    const existingApps = myAppsGrid.querySelectorAll('.app-card:not(.add-card)');
    for (let card of existingApps) {
        if (card.querySelector('.app-name').textContent === appData.name) {
            return; // 已存在则不添加
        }
    }
    
    // 隐藏空状态
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    // 创建应用卡片
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.innerHTML = `
        <div class="app-icon ${appData.color}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                ${getIconPath(appData.icon)}
            </svg>
        </div>
        <h4 class="app-name">${appData.name}</h4>
        <p class="app-desc">${appData.desc}</p>
        <button class="app-remove" title="移除应用">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    `;
    
    // 添加删除事件
    appCard.querySelector('.app-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        appCard.style.transform = 'scale(0.8)';
        appCard.style.opacity = '0';
        setTimeout(() => {
            appCard.remove();
            checkEmptyState();
            // 同步更新全部应用中的按钮状态
            updateAllAppsButton(appData.name, false);
        }, 200);
    });

    // 添加点击跳转事件
    appCard.style.cursor = 'pointer';
    appCard.addEventListener('click', function(e) {
        if (e.target.closest('.app-remove')) return;
        const appName = appData.name;
        const appRoutes = {
            '文件传输': './fileTransfer/index.html',
        };
        const targetUrl = appRoutes[appName];
        if (targetUrl) {
            window.open(targetUrl, '_blank');
        } else {
            alert(appName + ' 应用正在开发中，敬请期待！');
        }
    });
    
    // 插入到添加按钮之前
    const addCard = myAppsGrid.querySelector('.add-card');
    myAppsGrid.insertBefore(appCard, addCard);
    
    // 同步更新全部应用中的按钮状态
    updateAllAppsButton(appData.name, true);
}

// 更新全部应用中的按钮状态
function updateAllAppsButton(appName, isAdded) {
    const allAppsCards = document.querySelectorAll('#all-apps .app-card');
    allAppsCards.forEach(card => {
        if (card.querySelector('.app-name').textContent === appName) {
            const btn = card.querySelector('.app-add-btn');
            if (isAdded) {
                btn.classList.add('added');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    已添加
                `;
            } else {
                btn.classList.remove('added');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    添加
                `;
            }
        }
    });
}

// 检查空状态
function checkEmptyState() {
    const myAppsGrid = document.querySelector('#my-apps .apps-grid');
    const emptyState = document.getElementById('emptyState');
    
    if (!myAppsGrid || !emptyState) return;
    
    // 计算应用卡片数量（排除添加按钮）
    const appCards = myAppsGrid.querySelectorAll('.app-card:not(.add-card)');
    
    if (appCards.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// 键盘事件 - ESC关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('addAppModal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    }
});
