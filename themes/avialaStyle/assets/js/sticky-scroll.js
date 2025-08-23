document.addEventListener('DOMContentLoaded', function() {
  // 获取所有滚动区块
  const sections = document.querySelectorAll('.sticky-scroll-section');
  const container = document.querySelector('.sticky-scroll-container');
  const headerContainer = document.querySelector('.header-container');
  const footer = document.querySelector('footer');
  
  // 检测当前可见区块并激活它
  function checkVisibleSections() {
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    let isSection4Visible = false;
    
    // 根据滚动位置切换 header 样式
    if (scrollPosition < windowHeight / 2) {
      // 在第一屏时添加 first 类
      headerContainer.classList.add('first');
      headerContainer.classList.remove('homeScroll');
    } else {
      // 不在第一屏时移除 first 类，添加 homeScroll 类
      headerContainer.classList.remove('first');
      headerContainer.classList.add('homeScroll');
    }
    
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // 检查该区块是否在视窗中
      if (scrollPosition >= sectionTop - windowHeight / 3 && 
          scrollPosition < sectionTop + sectionHeight - windowHeight / 3) {
        
        // 添加活动状态
        section.classList.add('active');
        
        // 检查是否是第四个区块（index 为 3）
        if (index === 3) {
          isSection4Visible = true;
        }
      } else {
        section.classList.remove('active');
      }
    });
    
    // 控制 footer 的显示/隐藏
    if (footer) {
      if (isSection4Visible) {
        footer.classList.add('visible');
        footer.classList.remove('hidden');
      } else {
        footer.classList.remove('visible');
        footer.classList.add('hidden');
      }
    }
  }
  
  // 滚动事件处理
  container.addEventListener('scroll', function() {
    checkVisibleSections();
  });
  
  // 初始检查
  checkVisibleSections();
  
  // 将第一个区块设为活动状态
  if (sections.length > 0) {
    sections[0].classList.add('active');
    // 确保初始状态时 header 具有 first 类
    if (headerContainer) {
      headerContainer.classList.add('first');
    }
    // 确保初始状态时 footer 是隐藏的
    if (footer) {
      footer.classList.add('hidden');
      footer.classList.remove('visible');
    }
  }
});
