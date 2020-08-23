const favoriteFriends = []
const favoriteFriendsList = document.querySelector('#favorite-firends-list')
const deleteFavoriteBtn = document.querySelector('#delete-favorite-btn')
// const paginator = document.querySelector('#paginator')
// const searchInput = document.querySelector('#Seach-input')
// const searchForm = document.querySelector('#Search-form')
const modeBtn = document.querySelector('#mode-btn')
// const genderBtn = document.querySelector('.btn-gender')
// const changeNameBtn = document.querySelector('.dropdown-menu')
const total = document.querySelector('#total')
// const regionBtn = document.querySelector('.region-btn')
// const regionList = document.querySelector('.region-list')
// const addFavouriteList = document.querySelector('#addFavourite')
// const LIST_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users'
const FRIENDS_PER_PAGE = 12

let currentPage = 1
let numberOfPages = 0
let mode = 'cardMode'
let changeNameFilter = 'name'
let genderStatus = 0

function renderData(data) {//渲染畫面
  let listHTML = ''
  if (mode === 'cardMode') {
    data.forEach(e => {
      listHTML += `
    <div class="col-sm-6 col-md-3">
      <div id="${e.id}" class="m-2 target">
        <div id="${e.id}" class="card card-content target" data-toggle="modal" data-target="#list-modal">
          <img id="${e.id}" src="${e.avatar}" class="card-img target" alt="friend picture">
            <div id="${e.id}" class="card-body" >
              <span class="card-name target" id="${e.id}">${e.name}</span>
              <span class="card-surname target" id="${e.id}">${e.surname}</span>
            </div>
        </div>
      </div>
    </div>`
    })
  } else if (mode === 'listMode') {
    data.forEach(e => {
      listHTML += `
        <div class="col-sm-12 col-md-12 col-lg-6">
          <div id="${e.id}" class="m-2 target">
            <div id="${e.id}" class="card card-content card-content target" data-toggle="modal" data-target="#list-modal"">
              <div id="${e.id}" class="row d-flex align-items-center target">
                <div id="${e.id}" class="col-4 target">
                  <img src="${e.avatar}" class="card-img target" alt="friend picture" id="${e.id}">
                </div>
                <div id="${e.id}" class="col-4 target">
                  <span class="card-name target" id="${e.id}"><h5>${e.name}</h5></span>
                  <span class="card-surname target" id="${e.id}"><h5>${e.surname}</h5></span>
                </div>
                <div id="${e.id}" class="col-4 target">
                  <span class="card-gender target" id="${e.id}">Gender:${e.gender}</span>
                  <span class="card-region target" id="${e.id}">Region:${e.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })
  }
  favoriteFriendsList.innerHTML = listHTML
  countTotal()
}
function renderPagintor(amount) {//渲染分頁器
  numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
    paginator.innerHTML = rawHTML
  }
}
function renderModal(data) {// 抽換modal資料並渲染
  document.querySelector('#modal-id').innerHTML = data.id
  document.querySelector('#modal-name').innerText = `Name：${data.name} ${data.surname}`
  document.querySelector('#modal-gender').innerText = `Gender：${data.gender}`
  document.querySelector('#modal-region').innerText = `Region：${data.region}`
  document.querySelector('#modal-birthday').innerText = `Birthday：${data.birthday}`
  document.querySelector('#modal-email').innerText = `Email：${data.email}`
  document.querySelector('.image-fuid').src = data.avatar
}
function onListClicked(e) {//點擊卡片
  if (e.target.matches('.target')) {
    const event = favoriteFriends.find((itme) => itme.id === Number(e.target.id))
    renderModal(event)
  }
}
function onPaginatorClick(event) {//點擊Pagintor按鈕 
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  currentPage = Number(event.target.dataset.page)
  renderData(getFriendsByPage(page))
}
function switchDisplay(e) {//變換顯示
  if (e.target.matches('.fa-bars')) {
    mode = 'listMode'
  } else if (e.target.matches('.fa-th')) {
    mode = 'cardMode'
  }
  renderData(getFriendsByPage(currentPage))
}
function getFriendsByPage(page) {// 獲取分頁12筆資料
  const data = favoriteFriends
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}
function getFavoritData() {//localStorage獲取資料localStorage
  data = JSON.parse(localStorage.getItem('favoriteFriends'))
  favoriteFriends.push(...data)
  renderData(getFriendsByPage(1))
}
function countTotal() {//計算朋友數
  let count = favoriteFriends.length
  let listHTML = `Friends <h5><span class="badge badge-pill badge-info">${count} people</span><h5>`
  total.innerHTML = listHTML
}
function deleteFavorite(e) {
  // const favoriteFriends = JSON.parse(localStorage.getItem('favoriteFriends'))
  const friendId = Number(e.target.parentElement.previousElementSibling.firstElementChild.textContent)
  const friendIdIndex = favoriteFriends.findIndex((friend) => friend.id === friendId)
  favoriteFriends.splice(friendIdIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(favoriteFriends))
  renderData(getFriendsByPage(currentPage))
  renderPagintor(favoriteFriends.length)
  countTotal()
}
function init() {// 初始設定
  getFavoritData()
  renderPagintor(favoriteFriends.length)
}
favoriteFriendsList.addEventListener('click', onListClicked)
deleteFavoriteBtn.addEventListener('click', deleteFavorite)
paginator.addEventListener('click', onPaginatorClick)
modeBtn.addEventListener('click', switchDisplay)
// genderBtn.addEventListener('click', filterGender)
// changeNameBtn.addEventListener('click', changeName)
// regionBtn.addEventListener('click', renderRegionAra)
// regionList.addEventListener('click', filterRegion)
// addFavouriteList.addEventListener('click', addFavourite)


init()

