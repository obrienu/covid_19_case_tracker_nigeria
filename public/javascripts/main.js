$(document).ready(() => {

  const menuBtn = $('.menu-btn');
  const menu = $('#nav');
  let menuIsOpen = false;

  const handleMenu = () => {
    menuBtn.toggleClass('close');
    if (menuIsOpen) {
      menu.css('height', '3.5rem');
      menuIsOpen = false;
    } else {
      menu.css('height', '13.5rem');
      menuIsOpen = true;
    }
  };
  menuBtn.on('click', handleMenu);
});
