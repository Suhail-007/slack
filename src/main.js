import lineChart from './chart.js'

//sidebar 
document.addEventListener('click', e => {
  const btn = e.target.closest('.nav_btn_container');

  const sideBar = document.querySelector('.navbar');

//if user is not clicking inside of sidebar, close it
  if (!btn && !e.target.closest('.navbar')) sideBar.classList.remove('open');

  if (btn) sideBar.classList.add('open');
});
